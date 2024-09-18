// Q1.

use retail_store

// Q2.
db.createCollection("products")
db.createCollection("customers")
db.createCollection("sales")

// Q3.

db.products.insertMany(
    [
        { "productID": 1, "name": "Laptop", "category": "Electronics", "price": 1000, "stock": 50 },
        { "productID": 2, "name": "Smartphone", "category": "Electronics", "price": 700, "stock": 100 },
        { "productID": 3, "name": "Tablet", "category": "Electronics", "price": 500, "stock": 80 },
        { "productID": 4, "name": "Headphones", "category": "Accessories", "price": 100, "stock": 200 },
        { "productID": 5, "name": "Keyboard", "category": "Accessories", "price": 50, "stock": 150 }
    ]
)

db.customers.insertMany(
    [
        { "customerID": 1, "name": "Alice", "age": 25, "loyaltyPoints": 100 },
        { "customerID": 2, "name": "Bob", "age": 30, "loyaltyPoints": 200 },
        { "customerID": 3, "name": "Charlie", "age": 35, "loyaltyPoints": 150 },
        { "customerID": 4, "name": "David", "age": 40, "loyaltyPoints": 300 },
        { "customerID": 5, "name": "Eve", "age": 45, "loyaltyPoints": 250 }
    ]
)

db.sales.insertMany(
    [
        { "saleID": 1, "productID": 1, "customerID": 1, "date": "2023-07-01", "quantity": 1, "totalPrice": 1000 },
        { "saleID": 2, "productID": 2, "customerID": 2, "date": "2023-07-02", "quantity": 2, "totalPrice": 1400 },
        { "saleID": 3, "productID": 3, "customerID": 3, "date": "2023-07-03", "quantity": 1, "totalPrice": 500 },
        { "saleID": 4, "productID": 4, "customerID": 4, "date": "2023-07-04", "quantity": 3, "totalPrice": 300 },
        { "saleID": 5, "productID": 5, "customerID": 5, "date": "2023-07-05", "quantity": 4, "totalPrice": 200 }
    ]
)

// Q4.

db.customers.aggregate([
    {
        $lookup: {
            from: "sales",
            localField: "customerID",
            foreignField: "customerID",
            as: "sales_info"
        }
    },
    {
        $unwind: "$sales_info"
    },
    {
        $lookup: {
            from: "products",
            localField: "productID",
            foreignField: "sales_info.productID",
            as: "products_info"
        }
    },
    {
        $unwind: "$products_info"
    },
    {
        $match: {
            "products_info.category": "Electronics"
        }
    },
    {
        $project:{
            _id: 0,
            name: 1,
            product: "$products_info.name"
        }
    }
])

// Q5.

db.products.aggregate([
    {
        $lookup: {
            from: "sales",
            localField: "productID",
            foreignField: "productID",
            as: "sales_info"
        }
    },
    {
        $unwind: "$sales_info"
    },
    {
        $match: {
            "sales_info.quantity": {
                $gt: 1
            }
           
        }
    }

])

db.sales.aggregate([
    {
        $group: {
            _id: "$productID",
            "sum_quality": {
                $sum: "$quantity"
            }
        }
    }

])

// Q6.

const sum_quality_1 = db.sales.aggregate(
    [  
        {
            $group: {
                _id: "$productID",
                "sum_quality": {
                    $sum: "$quantity"
                }
            }
        },
       {
            $match: 
            {
                "_id": 1
            }
       },
    ]
).toArray()[0].sum_quality

db.products.updateOne(
    {
        "productID": 1
    },
    {
        $inc : {
            "stock": -sum_quality_1
        }
    }
)

// Q7. 
db.sales.deleteMany(
    {
        "totalPrice": {
            $lt: 300
        }
    }
)

// Q8.
db.products.updateMany(
    {},
    [
        {
            $set:
            {
                "discount": 0
            }
        }
    ]
)

// Q9.

// db.products.getIndexes() -> get indexes
db.products.createIndex(
    {
        "name": 1,
        "category": -1
    },
    {
        name: "name_cat_index"
    }

)

// Q10.
db.products.aggregate([
    {
        $lookup: {
            from: "sales",
            localField: "productID",
            foreignField: "productID",
            as: "sales_info"
        }
    },
    {
        $unwind: "$sales_info"
    },
    {
        $group: {
            _id: "$category",
            "total sales": {
                $sum: "$sales_info.totalPrice"
            }
        }
    },
    {
        $project: {
            "total sales": 1
        }
    }
   
])

// Q11.
sh.enableSharding("retail_store");
sh.shardCollection("retail.sales", { customer_id: 1 });

// Q12.

// modify replication
```bash
sudo nano /etc/mongodb.conf
```

// add
```
replication:
  replSetName: 'rs0'
```


const session = db.getMongo().startSession();
session.startTransaction();

const new_customer = {
     "productID": 1,
     "name": "Alice", 
     "age": 25,
     "loyaltyPoints": 50 
}

try {
    const customerCollection = session.getDatabase("retail_store").customers;
    // check loyaltyPoints 1- 150loyaltyPoints 1- 150
    if(new_customer.loyaltyPoints < 1 || new_customer.loyaltyPoints > 150)
    {
        throw new Error("The loyaltyPoints must be 1 - 150!!!");
    }

    // update or insert a customer with customerID
    customerCollection.updateOne(
        {
            "productID" : new_customer.productID,
        },
        {
            $set: {
                $inc: {
                    "loyaltyPoints": new_customer.loyaltyPoints
                }
            }
        },
        {
            upsert: true
        }
    )
    // Commit transaction
    session.commitTransaction();
    print("Successfully Transaction!!!");
} catch (err) {
    session.abortTransaction();
    print("Transaction Failed: " + err);
} finally {
    session.endSession();
}

// Q13.
db.createView(
    "highValuesSales",
    "sales",
    [
        {
            $match: {
                "totalPrice": {
                    $gt: 500
                }
            },
        },
        {
            $project:
            {
                _id: 0
            }
        }
    ]
)