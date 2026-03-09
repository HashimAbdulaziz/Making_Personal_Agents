import { tools } from "./tools/index";
export type ToolName =
  keyof typeof tools;

export const executeTools = async (
  name: string,
  args: any,
) => {
  const tool = tools[name as ToolName];
  if (!tool) {
    return "Unkown tool this not exist!";
  }

  const execute = tool.execute;
  if (!execute) {
    return "This is not a registed tool!";
  }
  const result = await execute(args, {
    toolCallId: "",
    messages: [],
  });

  return String(result);
};
