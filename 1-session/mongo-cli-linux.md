# MongoDB Command Line in Linux

***use in arch linux***
- Check Status

```bash
sudo systemctl status mongodb
```

- Start MongoDB Service
```bash
sudo systemctl start mongodb
```

- Stop MongoDB Service

```bash
sudo systemctl stop mongodb
```

- Restart Mongo Service

```bash
sudo systemctl restart mongodb
```

- Auto Start 

```bash
sudo systemctl enable mongodb
```

- Disable Start 

```bash
system disable mongodb
```

- Connect Mongo-Shell

```bash
# old version
mongo
# new version
mongosh
# with port7: 27017
mongosh "mongodb://localhost:27017" 
```

- Check Mongo Version

```bash
mongod -version
```

- View Log

```bash
sudo journalctl -u mongodb
```

- Modify Mongo Config

```bash
sudo nano /etc/mongodb.conf
```