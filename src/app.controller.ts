import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
/**
 * AppController is the main controller for the application.
 * It handles incoming requests and returns responses.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
