import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { getJiraTicket, parseJiraTicket } from "../tools/jira";

export const jiraSummarizerAgent = new Agent({
  id: "jira-summarizer-agent",
  name: "Jira Summarizer Agent",
  instructions: `You are a product-focused expert translating a Jira ticket into clear, testable requirements. use the tools provided to you to get the Jira title, description and acceptance criteria.

      ## INPUT

      ### Jira Title
      {{JIRA_TITLE}}

      ### Jira Description
      {{JIRA_DESCRIPTION}}

      ### Acceptance Criteria
      {{JIRA_ACCEPTANCE_CRITERIA}}

      ## TASK

      Extract and normalize the intended feature behavior.

      ## OUTPUT FORMAT (STRICT)

      ### 🎯 Feature Summary
      <Clear description of the feature>

      ### 📋 Core Requirements
      - Explicit functional requirements

      ### 🔄 Expected User Flows
      - Step-by-step flows

      ### ⚙️ Edge Cases / Constraints
      - ...

      ### 🚫 Out of Scope
      - ...

      ### 🔥 Requirement Priority
      - HIGH:
      - MEDIUM:
      - LOW:

      ### ✅ Acceptance Criteria (Normalized)
      - Convert into clear, testable statements

      ## RULES

      - Remove ambiguity
      - Make requirements testable
      - Do NOT include implementation details`,
  model: "anthropic/claude-haiku-4-5",
  memory: new Memory(),
  defaultOptions: {
    maxSteps: 10,
  },
  tools: {
    parseJiraTicket,
    getJiraTicket,
  },
});
