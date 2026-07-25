import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Public } from './auth/decorators/auth.decorators';

/** Root landing for the API host (e.g. Render URL `/`). */
@ApiExcludeController()
@Controller()
export class AppController {
  @Public()
  @Get()
  root(): {
    name: string;
    api: string;
    health: string;
    docs: string;
  } {
    return {
      name: 'YogiSpeaks API',
      api: '/api/v1',
      health: '/api/v1/health',
      docs: '/api/docs',
    };
  }
}
