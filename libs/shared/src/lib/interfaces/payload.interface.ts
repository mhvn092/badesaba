import { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'typeorm';

export interface Payload extends Pick<JwtPayload, 'iat' | 'exp'> {
  _id: ObjectId;
  email: string;
  isActive: boolean;
  clientId?: string;
}

export interface AccessToken {
  accessToken: string;
}

export interface RefreshToken {
  refreshToken: string;
}

export interface AccessMenu {
  accessMenu?: string;
}

export interface Tokens extends AccessToken, RefreshToken, AccessMenu {}
