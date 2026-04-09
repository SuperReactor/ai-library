export default {
  async fetch(request, env) {

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
      });
    }

    if (request.method !== "POST") {
      return new Response("Send a POST request", {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    try {
      const { prompt, model } = await request.json();

      const MODEL_MAP = {
        gemma: "@cf/google/gemma-4-26b-a4b-it",
        qwen: "@cf/qwen/qwen1.5-14b-chat",
        nemotron: "@cf/nvidia/nemotron-4-340b-instruct"
      };

      const selectedModel = MODEL_MAP[model] || MODEL_MAP.gemma;

      const aiRes = await env.AI.run(selectedModel, {
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 512
      });

      let text =
        aiRes?.response ||
        aiRes?.result?.response ||
        aiRes?.choices?.[0]?.message?.content ||
        aiRes?.choices?.[0]?.text ||
        "No response";

      return new Response(JSON.stringify({ response: text }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }
  }
};
