import { TestingModule, Test } from '@nestjs/testing';

// Update the path below if 'app.controller.ts' is not in the same folder as this spec file.
// For example, if it's in a 'controllers' folder, use '../controllers/app.controller'
import { AppController } from './app.controller';
import { AppService } from './app.service';
// If './app.service' is incorrect, update the path below to the correct location, e.g.:
// import { AppService } from '../services/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
