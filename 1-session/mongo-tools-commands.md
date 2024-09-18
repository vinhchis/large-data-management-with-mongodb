# Mongo Tools

## 1. Mongo Dump

> `mongodump` - Exports and creates a binary backup of the contents of a database

```bash
mongodump --host localhost --port 27017 --db my_database --out backup
```

## 2. Mongo Restore

> `mognorestore` - Restores backup data from mongodump into a database and loads standard input data into a mongod or mongos instance

## 3. Mongo Export

> `mongoexport` - Exports and creates a JavaScript Object Notation(JSON) or Comma-Separated Values (CSV) backup of the contents stored in a MongoDB instance

```bash
mongoexport --db <database_name> --collection <collection_name> --out <output_file.json> --jsonArray
```

## 4. Mongo Import

> `mongoimport` - Imports data from CSV, JSON, and Tab-Separated Values (TSV) files into a MongoDB instance

## 5. Mongo BSON Dump

> `bsondump` - Converts BSON(Binary JavaScript Object Notation) files into JSON files

## 6. Mongo Top

> `mongotop` - Provides data on the amount of time spent by a MongoDB instance on reading and writing

## 7. Mongo Files

> `mongofiles` - Facilitates the manipulation of files stored in a MongoDB instance

## 8. Mongo Stat

> `mongostat` -  Provides statistics such as the number of inserts, deletes,
and update queries executed per second and the amount of virtual memory used by the process