import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { ChatbotModule } from '../chatbot/chatbot.module';

@Module({
  imports: [ChatbotModule],
  controllers: [WhatsappController],
  providers: [WhatsappService],
})
export class WhatsappModule {}
