import { OpenRouter } from "@openrouter/sdk";
import dotenv from "dotenv";
dotenv.config();

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

async function test() {
  try {
    console.log("Testing with model: z-ai/glm-5.1 (Fixed structure + max_tokens: 1000)");
    const stream = await openrouter.chat.send({
      chatRequest: {
        model: "z-ai/glm-5.1",
        messages: [
          {
            role: "user",
            content: "How many r's are in the word 'strawberry'?"
          }
        ],
        maxTokens: 1000,
        stream: true
      }
    });

    let response = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        response += content;
        process.stdout.write(content);
      }

      if (chunk.usage) {
        console.log("\nReasoning tokens:", chunk.usage.reasoningTokens);
      }
    }
    console.log("\nTest completed successfully.");
  } catch (error) {
    console.error("\nTest failed:", error);
  }
}

test();
