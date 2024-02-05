import { applyDecorators, Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { getRouteWithPrefix, ModulesEnum, RouteTypeEnum } from '@lib/shared';
import { JwtAuthGuard, OptionalGuard } from '../guards';

export function AuthControllerInfo(
  module: ModulesEnum,
  controllerPath: string,
  routeType = RouteTypeEnum.NORMAL,
) {
  const routePath: string = getRouteWithPrefix(routeType, controllerPath);

  const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [
    ApiTags(module as string),
    Controller(routePath),
  ];

  /**
   * just only apply JwtAuthGuard and RolesGuard admin panel
   **/
  if (routeType !== RouteTypeEnum.PUBLIC) {
    decorators.push(ApiBearerAuth());
    if (routeType === RouteTypeEnum.BASE) {
      decorators.push(UseGuards(JwtAuthGuard));
    } else if (routeType === RouteTypeEnum.OPTIONAL) {
      decorators.push(UseGuards(OptionalGuard));
    } else {
      // @todo vahidnejad: add RolesGuard
      decorators.push(UseGuards(JwtAuthGuard));
    }
 }

  return applyDecorators(...decorators);
}


