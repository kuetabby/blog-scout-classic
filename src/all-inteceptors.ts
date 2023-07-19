import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, map } from 'rxjs';

export class AllResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const query = request.query;

    return next.handle().pipe(
      map((data) => {
        if ('totalRecord' in data) {
          return {
            status: 'SUCCESS',
            message: null,
            totalRecord: data.totalRecord,
            content: data.content,
            page: query?.page ? +query.page : 1,
            pageSize: query?.pageSize ? +query.pageSize : 10,
            error: false,
          };
        }
        return {
          status: 'SUCCESS',
          message: null,
          content: data,
          error: false,
        };
      }),
      catchError((error) => {
        throw new BadRequestException({
          status: 'ERROR',
          message: error.message || 'Internal Server Error',
          content: null,
          error: true,
        });
      }),
    );
  }
}
