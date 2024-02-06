import { DataSourceOptions } from 'typeorm';
import * as path from 'path';

export const PRODUCT_DATABASE_CONFIG: Pick<DataSourceOptions, 'entities' | 'migrations'> = {
  migrations: [`${path.join(__dirname, './')}migrations/*.{ts,js}`],
  entities: [`${path.join(__dirname, './')}entities/**/*.entity.{ts,js}`],
};
