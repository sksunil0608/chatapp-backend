import { config } from "dotenv";
import { Sequelize } from "sequelize";
config(); //load the env variables
const dbName = process.env.DB_NAME!;
const dbUser = process.env.DB_USER!;
const dbPassword = process.env.DB_PASSWORD!;
const dbHost = process.env.DB_HOST!;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: "mysql",
});

export default sequelize;
