import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export abstract class RequesterService {
  abstract get(url: string, headers?: any);
  abstract post(url: string, headers?: any);

  getDefaultHeaders(): any {
    return {
      'Content-Type': 'application/json',
    };
  }

  log(url: string, message: string): void {
    console.log(`the request for address: ${url} is justified by error: ${message}`);
  }

  info(method: string , url: string): void {
    console.log(`${method} request was sent to address: ${url}`);
  }
}
