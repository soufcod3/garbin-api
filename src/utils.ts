import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Garment } from "./entities/Garment";
import { Outfit } from "./entities/Outfit";
import { OutfitPlan } from "./entities/OutfitPlan";

console.log('POSTGRES HOST', process.env.POSTGRES_HOST)

const datasource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  entities: [User, Garment, Outfit, OutfitPlan],
  logging: ["query", "error"],
});

export default datasource;