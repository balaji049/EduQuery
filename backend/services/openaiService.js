const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateAnswer(context, question) {
  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an educational assistant. Answer clearly and concisely."
      },
      {
        role: "user",
        content: `
Context:
${context}

Question:
${question}

Answer based only on the context.
`
      }
    ],
    temperature: 0.3,
    max_tokens: 300
  });

  return response.choices[0].message.content;
}

module.exports = { generateAnswer };
