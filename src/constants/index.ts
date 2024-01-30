import { Edge, Node } from "reactflow";
import { v4 as uuidv4 } from "uuid";

export const MODE: {
  SINGLE: Mode;
  BRANCH: Mode;
} = {
  SINGLE: "SINGLE",
  BRANCH: "BRANCH",
};
export const initialNodes: Node[] = [
  {
    id: uuidv4(),
    type: "custom",
    data: { mode: MODE.SINGLE, firstNode: true, label: "Text" },
    position: { x: 0, y: 0 },
    // type: "input",
  },
];

export const initialEdges: Edge[] = [
  //   { id: "1-2", source: "1", target: "2", label: "to the", type: "step" },
];
