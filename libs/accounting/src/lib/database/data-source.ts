import 'dotenv/config';
import { DataSource } from 'typeorm';
import { ACCOUNTING_DATABASE_CONFIG } from "./product-database.config";

export const AccountingDataSource = new DataSource({
  type: 'mongodb',
  synchronize: false,
  host: process.env['TYPEORM_HOST'],
  port: +process.env['TYPEORM_PORT'],
  username: process.env['TYPEORM_USERNAME'],
  password: process.env['TYPEORM_PASSWORD'],
  database: process.env['TYPEORM_DATABASE'],
  migrations: ACCOUNTING_DATABASE_CONFIG.migrations,
  entities: ACCOUNTING_DATABASE_CONFIG.entities,
  migrationsTableName: 'migrations',
});
