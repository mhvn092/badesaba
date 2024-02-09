import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BadgeEnum, RouteTypeEnum } from '../enums';
import { ROUTE_METADATA } from '../constants';
import { Payload } from '../interfaces';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const routeType: RouteTypeEnum = this._reflector.get<RouteTypeEnum>(
      ROUTE_METADATA,
      context.getClass(),
    );

    if (routeType === RouteTypeEnum.PUBLIC) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user }: { user: Payload } = request;

    if (!user) return false;

    // we should check if the user's group have the permission to enter this route

    if (
      ![
        RouteTypeEnum.NORMAL,
        RouteTypeEnum.BASE,
        RouteTypeEnum.OPTIONAL,
      ].includes(routeType)
    ) {
      /**
       * the user requesting route must have the desired role
       **/
      if (!this._validateRolesWithScopes(user.badge, routeType)) {
        return false;
      }
    }
    return true;
  }

  private _validateRolesWithScopes(userType: BadgeEnum, routeType: RouteTypeEnum): boolean {
    let hasPermission = false;

    switch (userType) {
      case BadgeEnum.Admin:
        hasPermission = true;
        break;
      case BadgeEnum.Customer:
        hasPermission = routeType === RouteTypeEnum.NORMAL;
        break;
    }
    return hasPermission;
  }
}
