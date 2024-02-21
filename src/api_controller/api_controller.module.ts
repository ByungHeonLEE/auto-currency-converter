import { Module } from '@nestjs/common';
import { ApiControllerController } from './api_controller.controller';

@Module({
  controllers: [ApiControllerController]
})
export class ApiControllerModule {}
