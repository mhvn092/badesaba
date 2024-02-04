import { applyDecorators, Controller, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, OptionalGuard } from '../guards';
import { ModulesEnum, RouteTypeEnum } from '../enums';

export function ControllerInfo(
  module: ModulesEnum,
  controllerPath: string,
  routeType = RouteTypeEnum.NORMAL,
  onlyJwtGuardApply?: boolean,
) {
  const routePath: string = _getRouteWithPrefix(routeType, controllerPath);

  const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [
    ApiTags(module as string),
    Controller(routePath),
  ];
  
  if (onlyJwtGuardApply && routeType === RouteTypeEnum.NORMAL) {
    decorators.push(UseGuards(JwtAuthGuard));
  }

  if (routeType === RouteTypeEnum.OPTIONAL) {
    decorators.push(UseGuards(OptionalGuard));
  }

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
      // add RolesGuard
      decorators.push(UseGuards(JwtAuthGuard));
    }
  }

  return applyDecorators(...decorators);
}

export function _getRouteWithPrefix(routeType: RouteTypeEnum, controllerPath: string): string {
  let routePath: string;

  switch (routeType) {
    case RouteTypeEnum.PUBLIC:
      routePath = 'public/' + controllerPath;
      break;
    case RouteTypeEnum.ADMIN:
      routePath = 'admin/' + controllerPath;
      break;
    case RouteTypeEnum.GUEST:
      routePath = 'guest/' + controllerPath;
      break;
    case RouteTypeEnum.OPTIONAL:
      routePath = 'optional/' + controllerPath;
      break;
    case RouteTypeEnum.BASE:
      routePath = 'base/' + controllerPath;
      break;
    case RouteTypeEnum.NORMAL:
    default:
      routePath = controllerPath;
      break;
  }
  return routePath;
}
