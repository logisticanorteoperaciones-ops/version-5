import { GoogleGenAI } from "@google/genai";
import { api } from './mockApi';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = ai.models;

export const askAIAssistant = async (userQuery: string): Promise<string> => {
  if (!API_KEY) {
    return "El servicio de IA no está disponible. Por favor, configure la clave de API.";
  }
  
  try {
    const contextData = await api.getAllDataForAI();

    const systemInstruction = `Eres 'FleetAI', un asistente experto en gestión de flotas de logística. Tu propósito es ayudar a los Gestores de Flota a obtener información y perspectivas sobre sus vehículos de forma rápida y precisa. Utiliza los datos de contexto proporcionados para responder a las preguntas del usuario. Sé conciso, profesional y responde en español.

    Aquí tienes los datos actuales del sistema:
    - Vehículos: ${JSON.stringify(contextData.vehicles, null, 2)}
    - Historial de Mantenimiento: ${JSON.stringify(contextData.maintenanceHistory, null, 2)}
    - Mantenimientos Programados: ${JSON.stringify(contextData.scheduledMaintenances, null, 2)}
    - Notificaciones Activas: ${JSON.stringify(contextData.notifications, null, 2)}
    - Reportes de Conductores: ${JSON.stringify(contextData.maintenanceRequests, null, 2)}
    `;

    const response = await model.generateContent({
      model: "gemini-2.5-flash",
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Lo siento, ocurrió un error al procesar tu solicitud: ${error.message}`;
    }
    return "Lo siento, ocurrió un error inesperado al contactar al asistente de IA.";
  }
};