import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './server.controller';
import { AppService } from './server.service';

describe('ServerController', () => {
  let serverController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    serverController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(serverController.getHello()).toBe('Hello World!');
    });
  });
});
