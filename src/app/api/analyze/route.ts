import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { code, error } = await req.json();

  if (!error?.trim()) {
    return NextResponse.json({ error: "Nenhum erro fornecido." }, { status: 400 });
  }

  const prompt = `Você é um assistente especialista em depuração de código. Analise o erro abaixo e explique de forma clara e objetiva:

1. O que causou o erro
2. Como corrigir
3. Um exemplo corrigido, se aplicável

${code?.trim() ? `Código:\n\`\`\`\n${code}\n\`\`\`` : ""}

Erro:
\`\`\`
${error}
\`\`\`

Responda em português, de forma direta e sem enrolação.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 1024,
    });

    const response = completion.choices[0]?.message?.content ?? "Sem resposta.";
    return NextResponse.json({ response });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao chamar a API do Groq." }, { status: 500 });
  }
}