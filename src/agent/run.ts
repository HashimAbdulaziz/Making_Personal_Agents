import "dotenv/config";
import { generateText, type ModelMessage, streamText } from "ai";
//import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from "./system/prompt";
import type { AgentCallbacks } from "../types.ts";
import { executeTools } from "./executeTools.ts";

// IMPORT YOUR TOOLS HERE (Update the path to wherever your tools are defined)
import { tools } from "./tools/index.ts";
// Limnar for Tracing Evals
import { Laminar, getTracer } from "@lmnr-ai/lmnr";

//const MODEL_NAME = "gpt-5.2";
const MODEL_NAME = "gemini-2.5-flash";

Laminar.initialize({
  projectApiKey: process.env.LMNR_PROJECT_API_KEY,
});

export const runAgent = async (
  userMessage: string,
  conversationHistory: ModelMessage[],
  callbacks: AgentCallbacks,
) => {
  const { textStream, toolCalls } = await streamText({
    //model: openai(MODEL_NAME),
    model: google(MODEL_NAME),
    prompt: userMessage,
    system: SYSTEM_PROMPT,
    tools: tools,
    experimental_telemetry: {
      isEnabled: true,
      tracer: getTracer(),
    },
  });

  // Stream the text response (if the AI decides to talk before using a tool)
  for await (const textPart of textStream) {
    process.stdout.write(textPart);
  }

  console.log();

  // Wait for the stream to finish and grab the array of tools the AI wants to run
  const calls = await toolCalls;

  if (calls.length > 0) {
    console.log("AI is calling tools:", calls);
  }

  // Use a for...of loop to execute the tools sequentially
  for (const tc of calls) {
    const toolResult = await executeTools(tc.toolName, tc.input);
    console.log(`Result from ${tc.toolName}:`, toolResult);
  }

  console.log("Waiting for Laminar to upload traces...");
  // Add a 2-second pause before letting Node.js exit
  await Laminar.flush();

  console.log("Tracing Done! ");
};

runAgent("What time is it?");
