import { Dialect, Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const {
  DB_NAME,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_DIALECT,
} = process.env;
console.log("config",process.env.SSL_CA_CERT)
export const sequelize:Sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port:parseInt(process.env.DB_PORT),
  dialect: DB_DIALECT as Dialect ,
  logging: false,
  dialectOptions: {
    useUTC: false,
    ssl: {
            require: true,
            rejectUnauthorized: false,
     ca: fs.readFileSync(
        path.resolve(process.env.SSL_CA_CERT!)
      ).toString()

        }
  },
 });

export const connection = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
