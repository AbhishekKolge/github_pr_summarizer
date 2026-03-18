import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { extractAdfText, jiraFetch } from "../lib/jira";

export const parseJiraTicket = createTool({
  id: "parse-jira-ticket",
  description: "Parse a Jira ticket ID or URL into its ticket ID.",
  inputSchema: z.object({
    ticketId: z
      .string()
      .optional()
      .describe("A Jira ticket ID, e.g. PROJECT-1234"),
    ticketUrl: z
      .string()
      .optional()
      .describe(
        "A Jira ticket URL, e.g. https://jira.example.com/browse/1234567890"
      ),
  }),
  outputSchema: z.object({
    ticketId: z.string(),
  }),
  // biome-ignore lint/suspicious/useAwait: we need to use await here because executing a tool is an async operation
  execute: async (inputData) => {
    if (inputData.ticketId) {
      // biome-ignore lint/performance/useTopLevelRegex: we need to use a top level regex here because the regex is not defined in the top level scope
      const match = inputData.ticketId.match(/^[A-Z][A-Z0-9_]+-\d+$/);
      if (!match) {
        throw new Error(`Invalid Jira ticket ID: "${inputData.ticketId}".`);
      }
      return {
        ticketId: match[0],
      };
    }
    if (inputData.ticketUrl) {
      const match = inputData.ticketUrl.match(
        // biome-ignore lint/performance/useTopLevelRegex: we need to use a top level regex here because the regex is not defined in the top level scope
        /^https?:\/\/[^/]+\/browse\/([A-Z][A-Z0-9_]+-\d+)$/
      );
      if (!match) {
        throw new Error(`Invalid Jira ticket URL: "${inputData.ticketUrl}".`);
      }
      return {
        ticketId: match[1],
      };
    }

    throw new Error("Either ticketId or ticketUrl must be provided");
  },
});

export const getJiraTicket = createTool({
  id: "get-jira-ticket",
  description:
    "Fetch metadata for a Jira ticket including summary, description, acceptance criteria and issuetype.",
  inputSchema: z.object({
    ticketId: z.string(),
  }),
  outputSchema: z.object({
    summary: z.string(),
    description: z.string(),
    issuetype: z.string(),
  }),
  execute: async (inputData) => {
    const { ticketId } = inputData;
    const response = await jiraFetch(ticketId);
    const data = await response.json();
    const { fields: f } = data;
    console.log({ f });

    const description = f.description
      ? extractAdfText(f.description).trim()
      : "";

    return {
      summary: f.summary,
      description,
      issuetype: f.issuetype.name,
    };
  },
});
