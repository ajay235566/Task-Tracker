import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function chatWithAI(messages: Message[], tasks: any[]) {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are a helpful task management assistant. 
  The user is currently viewing their task dashboard. 
  Current tasks: ${JSON.stringify(tasks)}.
  Help the user manage their tasks, provide productivity tips, and answer questions about their schedule.
  Keep responses concise and helpful.`;

  const response = await ai.models.generateContent({
    model,
    contents: messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    })),
    config: {
      systemInstruction,
    }
  });

  return response.text || "I'm sorry, I couldn't process that request.";
}
