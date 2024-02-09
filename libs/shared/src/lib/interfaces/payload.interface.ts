import { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'typeorm';
import { BadgeEnum } from '../enums';

export interface Payload extends Pick<JwtPayload, 'iat' | 'exp'> {
  _id: ObjectId;
  email: string;
  isActive: boolean;
  clientId?: string;
  badge:BadgeEnum
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
