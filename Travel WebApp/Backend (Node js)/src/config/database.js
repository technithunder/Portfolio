require('dotenv').config();
const fs = require('fs');
const path = require('path');
console.log(process.env.SSL_CA_CERT,process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME, process.env.DB_HOST, process.env.DB_DIALECT)
module.exports = {
    "development": {
        "username": process.env.DB_USER,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "dialect": process.env.DB_DIALECT,
        "dialectOptions": {
                        "ssl": {
                            "require": true,
                            "rejectUnauthorized": false,
			    "ca": fs.readFileSync(                 // load your CA bundle :contentReference[oaicite:11]{index=11}  
                        path.resolve(process.env.SSL_CA_CERT)
                      ).toString()  
                        }
                   }
    }
}
