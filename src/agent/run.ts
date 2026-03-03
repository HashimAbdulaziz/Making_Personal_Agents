import "dotenv/config";
import {
  generateText,
  type ModelMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { SYSTEM_PROMPT } from "./system/prompt";
import type { AgentCallbacks } from "../types.ts";
import { use } from "react";
import { text } from "stream/consumers";

const MODEL_NAME = "gpt-5.2";

export const runAgent = async (
  userMessage: string,
  conversationHistory: ModelMessage[],
  callbacks: AgentCallbacks,
) => {
  const { text } = await generateText({
    model: openai(MODEL_NAME),
    prompt: userMessage,
    system: SYSTEM_PROMPT,
  });

  console.log(text);
};

runAgent("Hey are you there?");
