import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  private token = process.env.WHATSAPP_API_TOKEN;
  private phoneNumberId = process.env.PHONE_NUMBER_ID;

  async enviarMensaje(numero: string, mensaje: string) {
    try {
      await axios.post(
        `https://graph.facebook.com/v22.0/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: numero,
          text: {
            body: mensaje,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.error(
        'Error enviando mensaje:',
        error.response?.data || error.message,
      );
    }
  }
}
