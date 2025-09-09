import { Dialect, Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

const { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD, DB_DIALECT } = process.env;

export const sequelize: Sequelize = new Sequelize(
  DB_NAME as string,
  DB_USER as string,
  DB_PASSWORD,
  {
    host: DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      useUTC: false,
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false
      // }
    },
  }
);

export const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
