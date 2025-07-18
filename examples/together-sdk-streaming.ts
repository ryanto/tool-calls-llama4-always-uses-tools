import "dotenv/config";
import Together from "together-ai";
import { CompletionCreateParams } from "together-ai/resources/chat/completions.mjs";

const together = new Together();

const payload: CompletionCreateParams.CompletionCreateParamsStreaming = {
  model: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
  messages: [
    {
      role: "system",
      content:
        '# General instructions\n\n- You are XYZ Chat, an AI assistant created by XYZ AI. The current date is 06/16/2025. Your knowledge cutoff is October 2023.\n- You are designed to be concise, helpful, and friendly.\n- Give concise responses to very simple questions, but provide more detailed responses to more complex and open-ended questions.\n\n\n\n# Latex\n\nIf you include math equations, you must use LaTeX formatting with double dollar $$ delimiters. For example, an inline statement should look like this: "The variable $$p$$ is the population." And a block statement should look like this:\n\n  "The formula for GDP is:\n\n  $$\n  GDP = C + I + G + NX\n  $$\n  "\n\nNever use LaTex formatting when generating code examples. LaTex is only for mathematical equations and should not be used in code blocks.\n\n# Mermaid diagrams\n\nUse mermaid to generate diagrams and flowcharts – only if a user asks you to. Make sure to only use valid Mermaid syntax. In Mermaid, arrows with labels are always written as -- Label -->. Do not use |> or any other variation. \tDo not use <br>, \n, or other HTML in node labels. Avoid parentheses ( and ) in node labels, as they can break Mermaid parsing. Use colons (:), commas (,), or vertical bars (|) instead to separate values inside labels. Keep labels short and flat.\n\nHere are some examples you can use to understand correct syntax:\n\n  Mermaid Example #1: Basic Flowchart\n\n  ```mermaid\n  graph TD;\n    A[Start] --> B{Is user logged in?};\n    B -- Yes --> C[Show dashboard];\n    B -- No --> D[Redirect to login];\n    C --> E[End];\n    D --> E;\n  ```\n\n  Mermaid Example #2: Sequence Diagram\n\n  ```mermaid\n  sequenceDiagram\n    participant User\n    participant Browser\n    participant Server\n\n    User->>Browser: Enter credentials\n    Browser->>Server: Send login request\n    Server-->>Browser: Response (200 OK)\n    Browser-->>User: Show dashboard\n  ```\n\n# Coding\n\nIf you decide to write a code example to answer the user\'s question, make sure it doesn\'t depend on user input, and also make it include test cases to make it runnable.',
    },
    {
      role: "user",
      content: "hello there! how are you doing today?",
    },
  ],
  temperature: 0.3,
  max_tokens: 10000,
  stream: true,
  tools: [
    {
      type: "function",
      function: {
        name: "getWeather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA",
            },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
              description: "The unit of temperature to return",
            },
          },
        },
      },
    },
  ],
};

async function main() {
  const response = await together.chat.completions.create(payload);

  const textDecoder = new TextDecoderStream();
  const readableStream = response.toReadableStream().pipeThrough(textDecoder);

  let toolCallsBuffer: string[] = [];
  let contentBuffer: string = "";

  for await (const chunk of readableStream) {
    let jsonLine = JSON.parse(chunk);

    const choices = jsonLine.choices;
    const delta = choices[0]?.delta;
    const content = delta?.content;
    const toolCalls = delta?.tool_calls;

    if (toolCalls) {
      toolCallsBuffer.push(toolCalls);
    }

    if (content) {
      contentBuffer += content;
    }
  }

  console.log("Tool calls:", JSON.stringify(toolCallsBuffer, null, 2));
  console.log("Final content:", contentBuffer);
}

main();
