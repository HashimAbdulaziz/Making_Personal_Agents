import "dotenv/config";
import {
  type ModelMessage,
  Output,
  streamText,
} from "ai";
import { openai } from "@ai-sdk/openai";
import * as readline from "node:readline/promises";

const terminal =
  readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

const conversation: ModelMessage[] = [];

async function runFunnyLLM() {
  while (true) {
    const userInput =
      await terminal.question("You: ");

    conversation.push({
      role: "user",
      content: userInput,
    });

    const result = streamText({
      model: openai("gpt-5.1-codex"),
      messages: conversation,
    });

    let fullResponse = "";
    process.stdout.write(
      "\nAssistant: ",
    );
    for await (const token of result.textStream) {
      fullResponse += token;
      process.stdout.write(token);
    }
    process.stdout.write("\n\n");

    conversation.push({
      role: "assistant",
      content: fullResponse,
    });
  }
}

runFunnyLLM().catch(console.error);
