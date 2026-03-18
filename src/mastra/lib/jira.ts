import { BLOCK_TYPES, MAX_ADF_DEPTH } from "./const";

export async function jiraFetch(issueId: string): Promise<Response> {
  const jiraUserEmail = process.env.JIRA_USER_EMAIL;
  const jiraApiToken = process.env.JIRA_API_TOKEN;

  // biome-ignore lint/complexity/useSimplifiedLogicExpression: we need to use a simplified logic expression here because the jiraUserEmail and jiraApiToken can be undefined
  if (!jiraUserEmail || !jiraApiToken) {
    throw new Error(
      "JIRA_USER_EMAIL and JIRA_API_TOKEN environment variables are not set"
    );
  }

  const auth = Buffer.from(`${jiraUserEmail}:${jiraApiToken}`).toString(
    "base64"
  );

  const fields = "summary,description,issuetype";
  const url = `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${issueId}?fields=${fields}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Jira API error ${response.status}: ${body}`);
  }

  return response;
}

export function extractAdfText(
  node: string | { type: string; content: string[]; text?: string },
  depth = 0
) {
  if (!node || depth > MAX_ADF_DEPTH) {
    return "";
  }
  if (typeof node === "string") {
    return node;
  }
  if (node.type === "text") {
    return node.text || "";
  }

  let text = "";
  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      text += extractAdfText(child, depth + 1);
    }
  }

  if (BLOCK_TYPES.includes(node.type)) {
    text += "\n";
  }

  return text;
}
