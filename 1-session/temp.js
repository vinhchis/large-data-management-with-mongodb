db.Stud_marks.insertMany([
  {
    name: "Adam",
    gender: "M",
    subjects: ["Java", "C", "Python"],
    marks: [89, 78, 90],
    average: 85.6,
  },
  {
    name: "Franklin",
    gender: "M",
    subjects: ["C", "VB", "Python"],
    marks: [78, 85, 89],
    average: 84,
  },
  {
    name: "Michael",
    gender: "M",
    subjects: ["Java", "PHP"],
    marks: [88, 89],
    average: 88.5,
  },
  {
    name: "Amelia",
    gender: "F",
    subjects: ["Ruby", "C++"],
    marks: [86, 87],
    average: 86.5,
  },
]);

// Session and Transaction

// modify replication
```
replication:
  replSetName: 'rs0'
```;

// Create db
// use bank

// Tạo collection accounts và chèn dữ liệu mẫu
db.accounts.insertMany([
  {
    _id: ObjectId("60d5f4834af9d25c8b2b9b11"),
    accountHolder: "John Doe",
    balance: 1000,
  },
  {
    _id: ObjectId("60d5f4834af9d25c8b2b9b12"),
    accountHolder: "Jane Smith",
    balance: 500,
  },
]);

// Tạo collection transactions và chèn dữ liệu mẫu (nếu có)
db.transactions.insertMany([
  {
    _id: ObjectId("60d5f4834af9d25c8b2b9b13"),
    fromAccountId: ObjectId("60d5f4834af9d25c8b2b9b11"),
    toAccountId: ObjectId("60d5f4834af9d25c8b2b9b12"),
    amount: 100,
    date: ISODate("2021-06-25T10:00:00Z"),
  },
]);

//

const session = db.getMongo().startSession();
session.startTransaction();

try {
  const accountCollection = session.getDatabase("bank").accounts;
  const fromAccountId = ObjectId("60d5f4834af9d25c8b2b9b11");
  const toAccountId = ObjectId("60d5f4834af9d25c8b2b9b12");

  const amount = 100;

  const fromAccount = accountCollection.findOne({ _id: fromAccountId });
  const toAccount = accountCollection.findOne({ _id: toAccountId });

  if (fromAccount.balance < amount) {
    throw new Error("Not enough balance !!!");
  }

  accountCollection.updateOne(
    {
      _id: fromAccountId,
    },
    {
      $inc: {
        balance: -amount,
      },
    }
  );

  accountCollection.updateOne(
    {
      _id: toAccountId,
    },
    {
      $inc: {
        balance: amount,
      },
    }
  );

  const transactionCollection = session.getDatabase("bank").transaction;

  transactionCollection.insertOne({
    fromAccount: fromAccountId,
    toAccount: toAccountId,
    amount: amount,
    date: new Date(),
  });

  session.commitTransaction();
  print("Successfully Transaction!!!");
} catch (err) {
  session.abortTransaction();
  print("Transaction Failed: " + err);
}

db.sales_invent.insertMany([
  {
    customername: "Richard",
    gender: "M",
    purchased_product: "cereals",
    quantity: 6,
    price: 60,
  },
  {
    customername: "Williams",
    gender: "M",
    purchased_product: "Vegetables",
    quantity: 10,
    price: 150,
  },
  {
    customername: "Emma",
    gender: "F",
    purchased_product: "Fruits",
    quantity: 8,
    price: 200,
  },
  {
    customername: "John",
    gender: "M",
    purchased_product: "Baby Food",
    quantity: 3,
    price: 300,
  },
  {
    customername: "Smith",
    gender: "M",
    purchased_product: "Fruits",
    quantity: 5,
    price: 180,
  },
]);

db.sales_invent.aggregate([
  {
    $group: {
      _id: "$purchased_product",
      "Total sale": { $avg: { $price: {} } },
    },
  },
]);

sh.enableSharding("retail_store");
sh.shardCollection("retail.sales", { customer_id });

db.sales_invent.aggregate([
  { $group: { _id: "purchased_product", price: { $count: {} } } },
]);

db.sales_invent.aggregate([
  { $group: { _id: "$purchased_product", "Total sale": { $avg: "$price" } } },
 
]);


sử dụng $unset để loại bỏ các trường cụ thể: