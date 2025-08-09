export default {
  async fetch(request) {
    const API_KEY = "sk-pIpTyWr9zjIvM65KSLqSFYmz35how6XSK8JKAnCmNcawVmhO"; // ← ضع مفتاحك هنا

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method === "POST") {
      try {
        const formData = await request.formData();
        const image = formData.get("image");
        const prompt = formData.get("prompt");

        if (!image || !prompt) {
          return new Response("Missing image or prompt", { status: 400 });
        }

        const stabilityRes = await fetch(
          "https://api.stability.ai/v2beta/image-to-image",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${API_KEY}`,
            },
            body: formData,
          }
        );

        if (!stabilityRes.ok) {
          const errText = await stabilityRes.text();
          return new Response(errText, { status: stabilityRes.status });
        }

        const blob = await stabilityRes.blob();
        return new Response(blob, {
          headers: {
            "Content-Type": "image/png",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (err) {
        return new Response("Server error: " + err.message, { status: 500 });
      }
    }

    return new Response("Method Not Allowed", { status: 405 });
  },
};
