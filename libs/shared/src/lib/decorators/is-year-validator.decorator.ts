import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

@ValidatorConstraint({ name: 'isYear', async: false })
export class IsYearConstraint implements ValidatorConstraintInterface {
  validate(year: any, args: ValidationArguments) {
    // Check if it's a number
    if (typeof year !== 'number') {
      return false;
    }
    // Check if it's an integer
    if (!Number.isInteger(year)) {
      return false;
    }
    // Check if it's within a valid year range (adjust as needed)
    const currentYear = new Date().getFullYear();
    return year >= 1000 && year <= currentYear;
  }

  defaultMessage(args: ValidationArguments) {
    // You can customize the error message here
    return 'Invalid year';
  }
}

export function IsYear(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsYearConstraint,
    });
  };
}
