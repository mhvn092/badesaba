import { uuid } from '@spad/shared/common';
import { JwtPayload } from 'jsonwebtoken';

export interface Payload extends Pick<JwtPayload, 'iat' | 'exp'> {
  id: uuid | any;
  username?: string;
  email?: string;
  mobile?: string;
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
