import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { weatherTool, getTransactionsTool } from "../tools";
import { ToneConsistencyMetric } from "@mastra/evals/nlp";
import { PromptAlignmentMetric } from "@mastra/evals/llm";
import { AnswerRelevancyMetric } from "@mastra/evals/llm";

// Configure the model for evaluation
const model = openai("gpt-4o-mini");

const instructions = [
  "Be concise and direct in your responses while maintaining a professional and friendly tone.",
  "When providing weather information, include temperature, conditions, and any relevant weather alerts.",
  "For transaction analysis, focus on patterns, unusual spending, and actionable insights.",
  "Always prioritize user privacy and security - never share sensitive information.",
  "Use natural, conversational language while maintaining professionalism.",
  "Provide specific, actionable recommendations when appropriate.",
  "Acknowledge uncertainty when present and avoid making assumptions.",
  "Break down complex information into digestible parts.",
  "Ask clarifying questions when user intent is unclear.",
  "Maintain consistent formatting in responses for better readability.",
];

const promptAlignment = new PromptAlignmentMetric(model, {
  instructions,
  scale: 1,
});

const answerRelevancy = new AnswerRelevancyMetric(model, {
  uncertaintyWeight: 0.3,
  scale: 1,
});

export const personalAssistant = new Agent({
  name: "Personal Assistant",
  instructions: `
      You are a helpful personal assistant that provides both weather information and transaction analysis.

      You can help users with:
      1. Weather Information:
         - Get weather details for specific locations
         - Always ask for a location if none is provided
         - Include relevant details like humidity and wind conditions
      
      2. Transaction Analysis:
         - Provide clear summaries of transaction data
         - Calculate totals by category when requested
         - Help identify spending patterns
         - Format currency values appropriately

      Keep all responses concise but informative.
      Use the weatherTool for weather data and getTransactionsTool for transaction data.
`,
  model: openai("gpt-4o"),
  tools: { weatherTool, getTransactionsTool },
  metrics: {
    tone: new ToneConsistencyMetric(),
    promptAlignment,
    answerRelevancy,
  },
});
