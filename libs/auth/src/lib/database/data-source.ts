import 'dotenv/config';
import { DataSource } from 'typeorm';
import { AUTH_DATABASE_CONFIG } from "./auth-database.config";

export const AuthDataSource = new DataSource({
  type: 'mongodb',
  synchronize: false,
  host: process.env['TYPEORM_HOST'],
  port: +process.env['TYPEORM_PORT'],
  username: process.env['TYPEORM_USERNAME'],
  password: process.env['TYPEORM_PASSWORD'],
  database: process.env['TYPEORM_DATABASE'],
  migrations: AUTH_DATABASE_CONFIG.migrations,
  entities: AUTH_DATABASE_CONFIG.entities,
  migrationsTableName: 'migrations',
});
