import { Node } from "reactflow";
import { v4 as uuidv4 } from "uuid";

export const generateNewNode: (x: number, y: number, mode: Mode) => Node = (
  x,
  y,
  mode,
) => ({
  id: uuidv4(),
  type: "custom",
  data: { mode, label: "Text" },
  position: { x, y },
});
