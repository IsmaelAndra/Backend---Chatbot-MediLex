import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ChatbotService } from '../chatbot/chatbot.service';
import { WhatsappService } from './whatsapp.service';

const mensajesProcesados = new Set();

@Controller('webhook')
export class WhatsappController {
  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly whatsappService: WhatsappService,
  ) { }

  @Get()
  verificarWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return challenge;
    }

    return 'Error de verificación';
  }

  @Post()
  async recibirMensaje(@Body() body: any) {
    console.log('📩 WEBHOOK');

    try {
      const value = body.entry?.[0]?.changes?.[0]?.value;

      if (value?.statuses) {
        console.log('📊 Estado ignorado');
        return { ok: true };
      }

      const mensaje = value?.messages?.[0];

      if (!mensaje) {
        console.log('⚠️ No es mensaje válido');
        return { ok: true };
      }

      const mensajeId = mensaje.id;

      if (mensajesProcesados.has(mensajeId)) {
        console.log('⚠️ Mensaje duplicado ignorado');
        return { ok: true };
      }

      mensajesProcesados.add(mensajeId);

      const texto = mensaje?.text?.body;
      const numero = mensaje?.from;

      console.log('📱 Número:', numero);
      console.log('📝 Texto:', texto);

      if (!texto) return { ok: true };

      const respuesta = await this.chatbotService.procesarMensaje(numero, texto);

      await this.whatsappService.enviarMensaje(numero, respuesta);

      console.log('✅ Respuesta enviada');

      return { ok: true };
    } catch (error) {
      console.error('❌ ERROR:', error);
      return { ok: false };
    }
  }
}