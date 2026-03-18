import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import {
  getFileContent,
  getPullRequest,
  getPullRequestDiff,
  getPullRequestFiles,
  parseGitHubPRUrl,
} from "../tools/github";

export const prSummaryAgent = new Agent({
  id: "pr-summary-agent",
  name: "PR Summary Agent",
  instructions: `You are a senior software expert summarizing a Pull Request. use the tools provided to you to get the PR title, description, diff, files and content.

      ## INPUT

      ### PR Title
      {{PR_TITLE}}

      ### PR Description
      {{PR_DESCRIPTION}}

      ### Code Diff (optional)
      {{PR_DIFF}}

      ## TASK

      Describe what has changed in the PR.

      Focus ONLY on implementation details.
      Do NOT infer intent or correctness.

      ## OUTPUT FORMAT (STRICT)

      ### 🔧 Change Summary
      <High-level description of changes>

      ### 📦 Functional Changes
      - User-visible or API-level changes

      ### 🏗️ Technical Changes
      - Key implementation details (services, APIs, DB, state, infra)

      ### 🔥 Breaking Changes (if any)
      - ...

      ### 📂 Key Areas Impacted
      - Files, modules, or systems affected

      ### 🧠 Complexity Level
      <LOW | MEDIUM | HIGH>

      ## RULES

      - Be concise and factual
      - Do NOT evaluate correctness
      - Do NOT infer business intent
      - Prefer bullet points over paragraphs`,
  model: "anthropic/claude-haiku-4-5",
  memory: new Memory(),
  defaultOptions: {
    maxSteps: 10,
  },
  tools: {
    parseGitHubPRUrl,
    getPullRequest,
    getPullRequestDiff,
    getPullRequestFiles,
    getFileContent,
  },
});
