import { RouteTypeEnum } from "../enums/route-type.enum";

export function getRouteWithPrefix(routeType: RouteTypeEnum, controllerPath: string): string {
    let routePath: string;
  
    switch (routeType) {
      case RouteTypeEnum.PUBLIC:
        routePath = 'public/' + controllerPath;
        break;
      case RouteTypeEnum.ADMIN:
        routePath = 'admin/' + controllerPath;
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