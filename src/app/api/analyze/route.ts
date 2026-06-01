import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { code, error, locale } = await req.json();

  if (!error?.trim()) {
    return NextResponse.json({ error: "Nenhum erro fornecido." }, { status: 400 });
  }

  const isEn = locale === "en";

  const prompt = isEn
    ? `You are an expert debugging assistant. Analyze the error below and explain clearly:
1. What caused the error
2. How to fix it
3. A corrected example, if applicable
${code?.trim() ? `Code:\n\`\`\`\n${code}\n\`\`\`` : ""}
Error:
\`\`\`
${error}
\`\`\`
Reply in English, directly and without unnecessary filler.`
    : `Você é um assistente especialista em depuração de código. Analise o erro abaixo e explique de forma clara e objetiva:
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

    const response = completion.choices[0]?.message?.content ?? (isEn ? "No response." : "Sem resposta.");
    return NextResponse.json({ response });
  } catch (err) {
    console.error(err);
    const message = isEn ? "Error calling Groq API." : "Erro ao chamar a API do Groq.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}