import { ClassConstructor, plainToInstance } from 'class-transformer';

/**
 * this function converts plain object to the instance of the class given
 * @param outPutClass
 * @param data
 * @param stripObject
 */
export function responseWrapper<ClassType, T>(
  outPutClass: ClassConstructor<ClassType>,
  data: T[],
  stripObject?: boolean,
): ClassType[];
export function responseWrapper<ClassType, T>(
  outPutClass: ClassConstructor<ClassType>,
  data: T,
  stripObject?: boolean,
): ClassType;
export function responseWrapper<ClassType, T>(
  outPutClass: ClassConstructor<ClassType>,
  data: T | T[],
  stripObject = false,
): ClassType[] | ClassType {
  return plainToInstance(outPutClass, data, {
    enableCircularCheck: true,
    enableImplicitConversion: true,
    ...(stripObject && { excludeExtraneousValues: true }),
  });
}
