import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatbotModule } from './chatbot/chatbot.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { IaModule } from './ia/ia.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ChatbotModule,
    WhatsappModule,
    IaModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
