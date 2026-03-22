import { Injectable } from '@nestjs/common';
import { IaService } from '../ia/ia.service';
import { SYSTEM_PROMPT } from './prompt/system.prompt';
import * as fs from 'fs';
import * as path from 'path';

interface Mensaje {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface Conversacion {
    mensajes: Mensaje[];
}

@Injectable()
export class ChatbotService {
    private conversaciones: Map<string, Conversacion> = new Map();
    private baseContexto: string = '';

    constructor(private readonly iaService: IaService) {
        this.cargarBaseContexto();
    }

    private cargarBaseContexto() {
        try {
            const ruta = path.join(process.cwd(), 'src', 'chatbot', 'data', 'base.txt');
            this.baseContexto = fs.readFileSync(ruta, 'utf-8');
        } catch (error) {
            console.error('Error cargando base.txt:', error);
            this.baseContexto = '';
        }
    }

    async procesarMensaje(numero: string, mensaje: string): Promise<string> {
        if (!mensaje) {
            return 'Por favor, envía un mensaje válido.';
        }

        let conversacion = this.conversaciones.get(numero);
        if (!conversacion) {
            conversacion = { mensajes: [] };
            this.conversaciones.set(numero, conversacion);
        }

        conversacion.mensajes.push({
            role: 'user',
            content: mensaje,
            timestamp: new Date()
        });

        const historialParaIA = this.construirHistorialParaIA(conversacion.mensajes);

        const respuesta = await this.iaService.generarRespuesta({
            system: SYSTEM_PROMPT,
            user: historialParaIA,
            contexto: this.baseContexto,
        });

        conversacion.mensajes.push({
            role: 'assistant',
            content: respuesta,
            timestamp: new Date()
        });

        return respuesta;
    }

    private construirHistorialParaIA(mensajes: Mensaje[]): string {
        const ultimosMensajes = mensajes.slice(-10);

        let historial = '';

        for (const msg of ultimosMensajes) {
            const rol = msg.role === 'user' ? 'Usuario' : 'MediLex';
            historial += `${rol}: ${msg.content}\n`;
        }

        return historial;
    }

    limpiarConversacion(numero: string) {
        this.conversaciones.delete(numero);
    }
}