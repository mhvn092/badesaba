import { IsIn, Matches } from 'class-validator';
import { URL_WITHOUT_TRAILING_SLASH } from '../constants';
import { CheckNumber } from '../decorators/custom-check-number.decorator';
import { registerConfig } from '../utils';
import { CheckString } from '../decorators/custom-check-string.decorator';

export enum UPLOAD_CONFIG {
  UPLOAD_MAX_LIMIT_MB = 'UPLOAD_MAX_LIMIT_MB',
  UPLOAD_SUPPORTED_FORMATS = 'UPLOAD_SUPPORTED_FORMATS',
  S3_ACCESS_KEY = 'S3_ACCESS_KEY',
  S3_SECRET_KEY = 'S3_SECRET_KEY',
  S3_REGION = 'S3_REGION',
  S3_ENDPOINT_URL = 'S3_ENDPOINT_URL',
  S3_BUCKET_NAME = 'S3_BUCKET_NAME',
  S3_BUCKET_TYPE = 'S3_BUCKET_TYPE',
}

export class UploadConfig {
  @CheckString(false,false)
  supportedFormats: string;

  @CheckString(false,false)
  accessKey: string;

  @CheckString(false,false)
  secretKey: string;

  @CheckString(false,false)
  region = 'default';

  @CheckString(false,false)
  @Matches(URL_WITHOUT_TRAILING_SLASH)
  endpointUrl: string;

  @CheckNumber(false,false)
  maxLimit: number;

  @CheckString(false,false)
  bucketName: string;

  @CheckString(false,false)
  @IsIn(['public-read', 'private'])
  bucketType = 'public-read';

  constructor(obj: Partial<UploadConfig>) {
    Object.assign(this, obj);
  }
}

export const uploadConfig = registerConfig(UploadConfig, () => {
  const formats = process.env[UPLOAD_CONFIG.UPLOAD_SUPPORTED_FORMATS];
  const maxLimit = +process.env[UPLOAD_CONFIG.UPLOAD_MAX_LIMIT_MB] * 1250000;
  const accessKey = process.env[UPLOAD_CONFIG.S3_ACCESS_KEY];
  const secretKey = process.env[UPLOAD_CONFIG.S3_SECRET_KEY];
  const endpointUrl = process.env[UPLOAD_CONFIG.S3_ENDPOINT_URL];
  const bucketName = process.env[UPLOAD_CONFIG.S3_BUCKET_NAME];
  const bucketType = process.env[UPLOAD_CONFIG.S3_BUCKET_TYPE];

  return new UploadConfig({
    accessKey: accessKey ? accessKey : undefined,
    supportedFormats: formats ? formats : undefined,
    secretKey: secretKey ? secretKey : undefined,
    region: process.env[UPLOAD_CONFIG.S3_REGION],
    endpointUrl: endpointUrl ? endpointUrl : undefined,
    bucketName: bucketName ? bucketName : undefined,
    bucketType: bucketType ? bucketType : undefined,
    maxLimit: maxLimit ? maxLimit : undefined,
  });
});

export const UPLOAD_MAX_LIMIT = +process.env[UPLOAD_CONFIG.UPLOAD_MAX_LIMIT_MB] * 1250000;
export const UPLOAD_SUPPORTED_FORMATS = new RegExp(
  process.env[UPLOAD_CONFIG.UPLOAD_SUPPORTED_FORMATS],
);
