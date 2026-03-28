import { generateProjectFiles } from "./src/generator.js";
import type { Endpoint } from "./src/parser.js";

const dummyEndpoints: Endpoint[] = [
  {
    toolName: "test_tool",
    method: "POST",
    path: "/api/v1/test",
    toonHeader: "test.tool()",
    params: [
      { name: "userId", type: "string()", required: true },
      { name: "count", type: "number()", required: false },
      { name: "tags", type: "array(z.any())", required: false }
    ]
  }
];

generateProjectFiles("c:/GSoC/rc-test-bot", "rc-test-bot", dummyEndpoints)
  .then(console.log)
  .catch(console.error);
