import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const stream = await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: 'search for the current weather in tokyo and execute python to print hello world',
    config: {
      tools: [{ googleSearch: {} }, { codeExecution: {} }]
    }
  });
  for await (const chunk of stream) {
    console.log(JSON.stringify(chunk, null, 2));
  }
}
run();
