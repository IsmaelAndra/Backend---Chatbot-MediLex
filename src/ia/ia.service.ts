import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class IaService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async generarRespuesta(data: {
        system: string;
        user: string;
        contexto?: string;
    }): Promise<string> {
        try {
            const messages: any[] = [
                {
                    role: 'system',
                    content: data.system,
                },
            ];

            if (data.contexto) {
                messages.push({
                    role: 'system',
                    content: `Contexto adicional:\n${data.contexto}`,
                });
            }

            messages.push({
                role: 'user',
                content: data.user,
            });

            const response = await this.openai.chat.completions.create({
                model: 'gpt-5-nano',
                messages,
                store: true,
            });

            return (
                response.choices[0].message.content || 'No se pudo generar respuesta'
            );
        } catch (error) {
            console.error('Error IA:', error);
            return 'Ocurrió un error procesando la solicitud.';
        }
    }
}
