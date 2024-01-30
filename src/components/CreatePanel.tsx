import React from "react";
import { MODE } from "../constants";

export default ({ className }: { className?: string }) => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
    mode: Mode,
  ) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: nodeType, data: { mode } }),
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside
      className={`bg-[#001f54] p-2 border border-[#001f54] text-white rounded-lg ${className}`}
    >
      <div className="mb-5">Drag and drop to create Node.</div>
      {/* <div
        className=""
        onDragStart={(event) => onDragStart(event, "input")}
        draggable
      >
        Input Node
      </div>
      <div
        className=""
        onDragStart={(event) => onDragStart(event, "default")}
        draggable
      >
        Default Node
      </div>
      <div
        className=" "
        onDragStart={(event) => onDragStart(event, "output")}
        draggable
      >
        Output Node
      </div> */}
      <div className="flex gap-2">
        <div
          className="bg-[#034078] border border-[#001f54] rounded-md w-max p-2 text-white cursor-pointer hover:bg-accent"
          onDragStart={(event) => onDragStart(event, "custom", MODE.SINGLE)}
          draggable
        >
          Single Node
        </div>
        <div
          className="bg-[#034078] border border-[#001f54] rounded-md w-max p-2 text-white cursor-pointer hover:bg-accent"
          onDragStart={(event) => onDragStart(event, "custom", MODE.BRANCH)}
          draggable
        >
          Branch Node
        </div>
      </div>
    </aside>
  );
};
