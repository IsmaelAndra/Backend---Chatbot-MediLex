import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('mensaje')
  async enviarMensaje(numero: string, @Body() body: { mensaje: string }) {
    const respuesta = await this.chatbotService.procesarMensaje(numero, body.mensaje);

    return {
      ok: true,
      respuesta,
    };
  }
}
