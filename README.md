# LLama4 always calls tools

When sending a chat completion request to Together AI using Llama 4, the tool is always invoked, regardless of if it's is needed or not.

This happens with both streaming and non-streaming requests.

However, with `streaming` requests, the LLM also returns `<|python_end|>` as content, which is unexpected.

## Example

```text
pnpm tsx examples/together-fetch-streaming.ts

Tool calls: [
  [
    {
      "index": 0,
      "id": "call_rdhielxkn3tpkfyn3j8il9iq",
      "type": "function",
      "function": {
        "name": "getWeather",
        "arguments": ""
      }
    }
  ],
  [
    {
      "index": 0,
      "function": {
        "arguments": "{\"location\":\"San Francisco, CA\","
      }
    }
  ],
  [
    {
      "index": 0,
      "function": {
        "arguments": "\"unit\":\"celsius\"}"
      }
    }
  ]
]

Final content: <|python_end|>
```

## Setup

Create a `.env` file in the root directory with the following variables:

```env
# .env
TOGETHER_API_KEY=
FIREWORKS_API_KEY=
OPENAI_API_KEY=
```

Install dependencies:

```text
pnpm install
```

## Usage

Run each of the following scripts to see the tool call output from the services:

| Command                                              | Description                                                  | Unnecessary tool call    |
| ---------------------------------------------------- | ------------------------------------------------------------ | ------------------------ |
| `pnpm tsx examples/together-fetch-non-streaming.ts`  | Fetch a non-streaming response from Together AI              | ❌ Unnecessary tool call |
| `pnpm tsx examples/together-fetch-streaming.ts`      | Fetch a streaming response from Together AI                  | ❌ Unnecessary tool call |
| `pnpm tsx examples/together-sdk-non-streaming.ts`    | Use the SDK to get a non-streaming response from Together AI | ❌ Unnecessary tool call |
| `pnpm tsx examples/together-sdk-streaming.ts`        | Use the SDK to get a streaming response from Together AI     | ❌ Unnecessary tool call |
| `pnpm tsx examples/fireworks-fetch-non-streaming.ts` | Fetch a non-streaming response from Fireworks AI             | ✅                       |
| `pnpm tsx examples/fireworks-fetch-streaming.ts`     | Fetch a streaming response from Fireworks AI                 | ✅                       |
