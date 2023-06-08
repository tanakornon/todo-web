import dotenv from "dotenv";
import { PostgresConfig } from "../infrastructures/postgres";

export interface Config {
  port: number;
  postgres: PostgresConfig;
}

export function getConfig(): Config {
  dotenv.config();

  const postgres: PostgresConfig = {
    connectionString: process.env.POSTGRES_CONNECTION_STRING || "",
  };

  const port: number = parseInt(process.env.PORT || "3000");

  const config: Config = {
    port,
    postgres,
  };

  console.log("Configuration Info:");
  console.log(config);
  console.log();

  return config;
}
