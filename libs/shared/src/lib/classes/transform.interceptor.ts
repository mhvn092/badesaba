import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { instanceToPlain } from 'class-transformer';
import { map } from 'rxjs/operators';
import { ServerResponse } from 'http';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  /**
   * Interceptors orders like exception filters are bottom up
   * i named this FPLC => FIRST PROVIDE LAST CALL
   * it means each interceptor provided first calls last
   **/
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // to serve images
        if (data instanceof ServerResponse) {
          return data;
        }

        return instanceToPlain(data, {
          enableCircularCheck: true,
          enableImplicitConversion: true,
        });
      }),
    );
  }
}
