const axios = require("axios");

const ACCOUNT = process.env.CF_ACCOUNT_ID;
const TOKEN = process.env.CF_AI_TOKEN;

module.exports = async function askCloudflare(prompt) {
  if (!ACCOUNT || !TOKEN) {
    throw new Error("Cloudflare ENV missing");
  }

  const res = await axios.post(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/ai/run/@cf/meta/llama-3-8b-instruct`,
    {
      messages: [
        { 
  role: "system", 
  content: `
You are an AI assistant that answers ONLY using the provided document context.

Rules:
- Do NOT add external knowledge
- Do NOT hallucinate
- If information is missing, say so clearly

Answer Format:
- Start with a short summary (2–3 lines)
- Use bullet points for explanations
- Use headings where useful
- Keep answers clear, concise, and structured
` 
}
,
        { role: "user", content: prompt }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

  return res.data.result.response;
};
