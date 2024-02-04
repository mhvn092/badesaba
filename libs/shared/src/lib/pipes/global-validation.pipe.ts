import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  ValidationPipe,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GlobalValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype, type }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const instance = plainToInstance(metatype, value, {
      enableImplicitConversion: false,
      enableCircularCheck: true,
    });

    if (type === 'custom' || typeof instance !== 'object') {
      return value;
    }
    const errors = await validate(instance);
    if (errors.length > 0) {
      throw new BadRequestException(
        errors
          .map((error) => {
            let message = '';
            if (error?.children) {
              error.children.forEach((item) => {
                if (item.constraints) {
                  message += Object.values(item.constraints).join(', ');
                }
                if (item.children) {
                  item.children.forEach((subItem) => {
                    if (subItem.constraints) {
                      message += ', ' + Object.values(subItem.constraints).join(', ');
                    }
                  });
                }
              });
            }
            if (error.constraints) {
              if (message.length > 1) {
                message += ', ';
              }
              message += Object.values(error.constraints).join(', ');
            }
            return message;
          })
          .join(', '),
      );
    }
    const validationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
    });
    return validationPipe.transform(value, { metatype, type });
  }

  private toValidate(metatype: any): boolean {
    const types: Array<any> = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
