import { Injectable } from '@nestjs/common';
import { RequesterService } from './requester.service';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios';

@Injectable()
export class AxiosService extends RequesterService {
  private readonly _axios: AxiosStatic = axios;
  private readonly _defaultConfig: AxiosInstance;
  private _response: AxiosResponse<any>;

  constructor() {
    super();
    this._defaultConfig = this._axios.create({
      timeout: 1000,
      headers: this.getDefaultHeaders(),
    });
  }

  async request(
    method: 'POST' | 'GET',
    url: string,
    body: any,
    { headers }: AxiosRequestConfig = {},
  ): Promise<AxiosResponse> {
    this._response = await this._axios.request({
      url,
      method,
      headers,
      data: body,
      responseType: 'json',
      ...this._defaultConfig,
    });
    return this._response.data();
  }

  async get(url: string, { headers }: AxiosRequestConfig = {}): Promise<AxiosResponse> {
    try {
      this._response = await this._axios.get(url, { headers });
      return this._response.data;
    } catch (exception) {
      console.log(url, exception.message);
    }
  }

  async post(
    url: string,
    body?: any,
    { headers }: AxiosRequestConfig = {},
  ): Promise<AxiosResponse> {
    this._response = await this._axios.post(url, body, { headers });
    return this._response.data();
  }

}
