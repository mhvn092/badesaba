import { applyDecorators, Controller, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { getRouteWithPrefix } from '../utils';
import { ModulesEnum, RouteTypeEnum } from '../enums';
import { AuthAccessGuard, AuthOptionalGuard } from '../guards';
import { ROUTE_METADATA } from '../constants';


export function SharedControllerInfo(
  module: ModulesEnum,
  controllerPath: string,
  routeType = RouteTypeEnum.NORMAL,
) {
  const routePath: string = getRouteWithPrefix(routeType, controllerPath);

  const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [
    ApiTags(module as string),
    Controller(routePath),
    SetMetadata(ROUTE_METADATA, routeType),
  ];

  /**
   * just only apply JwtAuthGuard and RolesGuard admin panel
   **/
  if (routeType !== RouteTypeEnum.PUBLIC) {
    decorators.push(ApiBearerAuth());
    if (routeType === RouteTypeEnum.BASE) {
      decorators.push(UseGuards(AuthAccessGuard));
    } else if (routeType === RouteTypeEnum.OPTIONAL) {
      decorators.push(UseGuards(AuthOptionalGuard));
    } else {
      // @todo vahidnejad: add RolesGuard
      decorators.push(UseGuards(AuthAccessGuard));
    }
 }

  return applyDecorators(...decorators);
}


