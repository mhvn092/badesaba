import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UPLOAD_MAX_LIMIT, UPLOAD_SUPPORTED_FORMATS } from '../config/upload.config';

export function ApiCustomFile(required = false) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('file', {
        limits: { fileSize: UPLOAD_MAX_LIMIT },
        fileFilter(req, file, callback) {
          if (!file.mimetype.match(new RegExp(UPLOAD_SUPPORTED_FORMATS)))
            callback(new Error('file format is not allowed'), false);
          callback(null, true);
        },
      }),
    ),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? ['file'] : [],
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}
