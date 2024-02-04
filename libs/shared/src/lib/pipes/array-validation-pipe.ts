import { ArgumentMetadata, mixin, PipeTransform, Type } from '@nestjs/common';
import { memoize } from 'lodash';
import { responseWrapper } from '../utils';

export const ArrayValidationPipe: <T>(itemType: Type<T>) => Type<PipeTransform> =
  memoize(createArrayValidationPipe);

function createArrayValidationPipe<T>(itemType: Type<T>): Type<PipeTransform> {
  class MixinArrayValidationPipe implements PipeTransform {
    transform(values: T[], metadata: ArgumentMetadata): any[] {
      if (!Array.isArray(values)) {
        return values;
      }

      return responseWrapper(itemType, values);
    }
  }

  return mixin(MixinArrayValidationPipe);
}
