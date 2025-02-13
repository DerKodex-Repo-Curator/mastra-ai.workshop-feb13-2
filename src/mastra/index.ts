import { Mastra } from "@mastra/core/mastra";
import { createLogger } from "@mastra/core/logger";
import { weatherWorkflow } from "./workflows";
import { personalAssistant } from "./agents";

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { personalAssistant },
  logger: createLogger({
    name: "Mastra",
    level: "info",
  }),
});
