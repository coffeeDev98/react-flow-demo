import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Handle, Node, NodeProps, Position, useReactFlow } from "reactflow";
import { generateNewNode } from "../utils/utils";
import { Plus, Split, Trash } from "lucide-react";
import { MODE } from "../constants";

const CustomNode = ({ id, data, xPos, yPos }: NodeProps) => {
  const { getNodes, addNodes, deleteElements, addEdges } = useReactFlow();
  const [label, setLabel] = useState<string>(data.label); //text data inside a node
  const [editMode, setEditMode] = useState<boolean>(false); //handle edit state of label in node

  // handle delete node case
  const onDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
  }, [id, deleteElements]);

  // handle SINGLE & BRANCH node addition cases
  const onAddNode = (mode: Mode) =>
    useCallback(() => {
      if (mode === MODE.SINGLE) {
        const newNode: Node = generateNewNode(xPos, yPos + 100, MODE.SINGLE);
        addNodes([newNode]);
        // console.log(getNodes());
        addEdges([
          {
            id: `e${id}-${newNode.id}`,
            source: id,
            target: newNode.id,
            type: "smoothstep",
            sourceHandle: "b",
          },
        ]);
      } else {
        const brNode: Node = generateNewNode(xPos, yPos + 100, MODE.BRANCH);
        const newNode1: Node = generateNewNode(
          xPos - 100,
          yPos + 200,
          MODE.SINGLE,
        );
        const newNode2: Node = generateNewNode(
          xPos + 100,
          yPos + 200,
          MODE.SINGLE,
        );
        addNodes([brNode, newNode1, newNode2]);
        addEdges([
          {
            id: `e${id}-${brNode.id}`,
            source: id,
            target: brNode.id,
            type: "smoothstep",
            sourceHandle: "b",
          },
          {
            id: `e${id}-${newNode1.id}`,
            source: brNode.id,
            target: newNode1.id,
            type: "smoothstep",
            sourceHandle: "l",
            label: "true",
          },
          {
            id: `e${id}-${newNode2.id}`,
            source: brNode.id,
            target: newNode2.id,
            type: "smoothstep",
            sourceHandle: "r",
            label: "false",
          },
        ]);
      }
    }, []);

  const toggleEditMode = (force?: boolean) => {
    setEditMode((prev) => (typeof force === "boolean" ? force : !prev));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.keyCode === 13) {
      setLabel((e.target as any).value);
      toggleEditMode(false);
    }
    if (e.keyCode === 27) {
      toggleEditMode(false);
    }
  };

  return (
    <div className="relative w-32 h-14 border border-white text-white rounded-md flex justify-center items-center">
      <div
        className="flex justify-center w-4/5 min-h-[40px] h-min text-sm"
        onDoubleClick={() => {
          setEditMode(true);
        }}
      >
        {editMode ? (
          <input
            className="bg-transparent w-full h-full outline-none text-center"
            type="text"
            value={label}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
          />
        ) : (
          <span className="w-full h-full text-center">{label}</span>
        )}
      </div>
      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-2 text-[8px]">
        {data.mode === MODE.SINGLE && (
          <>
            <button onClick={onAddNode(MODE.SINGLE)}>
              <Plus width={12} height={12} />
            </button>
            <button onClick={onAddNode(MODE.BRANCH)}>
              <Split width={12} height={12} className="rotate-180" />
            </button>
          </>
        )}
        <button onClick={onDelete}>
          <Trash width={12} height={12} />
        </button>
      </div>
      {!data.firstNode && <Handle type="target" position={Position.Top} />}
      {data.mode === MODE.SINGLE ? (
        <Handle id="b" type="source" position={Position.Bottom} />
      ) : (
        <>
          <Handle id="l" type="source" position={Position.Left} />
          <Handle id="r" type="source" position={Position.Right} />
        </>
      )}
    </div>
  );
};

export default memo(CustomNode);
