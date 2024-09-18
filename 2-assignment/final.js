// 1.
use hospital

db.createCollection("patients")
db.createCollection("doctors")
db.createCollection("appointments")

db.patients.insertMany(
    [
        {
            "patientID": 1,
            "name": "Alice",
            "age": 25,
            "gender": "Female",
            "conditions": "Diabetes",
        },
        {
            "patientID": 2,
            "name": "Bob",
            "age": 32,
            "gender": "Male",
            "conditions": "Hypertension"
        },
        {
            "patientID": 3,
            "name": "Carol",
            "age": 45,
            "gender": "Female",
            "conditions": "Arthritis"
        },
        {
            "patientID": 4,
            "name": "David",
            "age": 28,
            "gender": "Male",
            "conditions": "Asthma"
        },
        {
            "patientID": 5,
            "name": "Eve",
            "age": 60,
            "gender": "Female",
            "conditions": "Heart Disease"
        }
    ]
)

db.doctors.insertMany(
    [
        {
            "doctorID": 1,
            "name": "Dr. Smith",
            "specialty": "Cardiology"
        },
        
            {
              "doctorID": 2,
              "name": "Dr. Jones",
              "specialty": "Oncology"
            },
            {
              "doctorID": 3,
              "name": "Dr. Patel",
              "specialty": "Neurology"
            },
            {
              "doctorID": 4,
              "name": "Dr. Chen",
              "specialty": "Pediatrics"
            },
            {
              "doctorID": 5,
              "name": "Dr. Garcia",
              "specialty": "Dermatology"
            }
          
    ]
)

db.appointments.insertMany(
    [
        {
            "appointmentID": 1,
            "patientID": 1,
            "doctorID": 2,
            "date": "2024-07-01",
            "status": "Completed"
        },
        {
            "appointmentID": 2,
            "patientID": 2,
            "doctorID": 3,
            "date": "2024-07-08",
            "status": "Scheduled"
          },
          {
            "appointmentID": 3,
            "patientID": 3,
            "doctorID": 1,
            "date": "2024-07-15",
            "status": "Cancelled"
          },
          {
            "appointmentID": 4,
            "patientID": 4,
            "doctorID": 5,
            "date": "2024-07-22",
            "status": "Completed"
          },
          {
            "appointmentID": 5,
            "patientID": 5,
            "doctorID": 4,
            "date": "2024-07-29",
            "status": "Rescheduled"
          },
          {
            "appointmentID": 6,
            "patientID": 1,
            "doctorID": 1,
            "date": "2024-07-25",
            "status": "Scheduled"
          }

    ]
)

// 2.
db.patients.aggregate(
    [
        {
            $lookup: {
                from: "appointments",
                localField: "patientID",
                foreignField: "patientID",
                as: "app_info"
            }
        },
        {
            $unwind: "$app_info"
        },
        {
            $lookup: {
                from: "doctors",
                localField: "app_info.doctorID",
                foreignField: "doctorID",
                as: "doctor_info"
            }
        },
        {
            $unwind: "$doctor_info"
        },
        {
            $match: {
                "doctor_info.name": "Dr. Smith"
            }
        },
        {
            $project: {
                _id: 0,
                name: 1
            }
        }
    ]
)

// 3.
db.doctors.aggregate([
    {
        $lookup: {
            from: "appointments",
            localField: "doctorID",
            foreignField: "doctorID",
            as: "app_info"
        }
    },
    {
        $unwind: "$app_info"
    },
    {
        $group:{
            _id: "$doctorID",
            "name": { $first: "$name" } ,
            "app_count": {
                $count: {
                
                }
            }
        }
    },
    {
        $match: {
            "app_count": {
                $gt: 1
                // $gt: 0

            }
        }
    },
    {
        $project: {
            _id: 0,
            name: 1,
            "app_count": 1
        }
    }

    
])

// 4.
db.appointments.updateOne(
    {
        "appointmentID": 3
    },
    {
        $set: {
            "status" : "Completed"
        }
        
    }
)

// 5.
db.appointments.deleteMany(
    {
        "status": "Cancelled"
    }
)

// 6.
db.appointments.updateMany(
    {},
    [
        {
            $set:
            {
                "note": ""
            }
        }
    ]
)

// 7. 
db.doctors.createIndex(
    {
        "name": 1,
        "specialty": 1
    },
    {
        name: "name_spec_index"
    }

)

// 8.
db.doctors.aggregate(
    [
        {
            $lookup: {
                from: "appointments",
                localField: "doctorID",
                foreignField: "doctorID",
                as: "app_info"
            }
        },
        {
            $unwind: "$app_info"
        },
        {
            $group:{
                _id: "$doctorID",
                "name": { $first: "$name" } ,
                "app_count": {
                    $count: {
                    
                    }
                }
            }
        },
        {
            $project:
            {
                _id : 0,
                name: 1,
                "app_count":1
            }
        }
    ]
)

//9.
db.createView("activeAppointments","appointments", 
    [
        {
            $match: {
                "status": "Scheduled"
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

// 10.
const session = db.getMongo().startSession();
session.startTransaction();

const new_patients = {
        "patientID": 10,
        "name": "Hung",
        "age": 20,
        "gender": "Female",
        "conditions": "CSS",

}

try {
    const patientCollection = session.getDatabase("hospital").patients;
    
    // insert a new patient
    patientCollection.insertOne(new_patients);

    // update patientID = 1 to Cancelled
    const appointmentCollection = session.getDatabase("hospital").appointments;

    appointmentCollection.updateOne(
        {
            "appointmentID": 1,
        },
        {
            $set:{
            "status": "Cancelled"
            }
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

