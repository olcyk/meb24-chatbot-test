
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { ChatCompletionRequestMessage } from 'openai-edge';
import { OpenAI } from 'openai-edge';
import products from '../../public/products.json';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req) {
  const { messages } = await req.json();

  const systemMessage = {
    role: 'system',
    content: `Jesteś doradcą klienta sklepu internetowego z meblami. Pomóż klientowi wybrać odpowiedni produkt spośród tych:
${products.map(p => `- ${p.name} (${p.price} zł, ${p.color}) – ${p.features}`).join('\n')}`,
  };

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [systemMessage, ...messages],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
