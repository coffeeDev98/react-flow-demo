import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Node,
  Edge,
  applyEdgeChanges,
  applyNodeChanges,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  addEdge,
  Handle,
  Position,
  NodeTypes,
  NodeProps,
  MiniMap,
  useNodesState,
  useEdgesState,
  updateEdge,
  Connection,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  OnNodesDelete,
  useReactFlow,
} from "reactflow";
import { v4 as uuidv4 } from "uuid";
import "reactflow/dist/style.css";
import { MODE, initialEdges, initialNodes } from "../constants";
import CustomNode from "./CustomNode";
import CreatePanel from "./CreatePanel";

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const FlowPlayground = () => {
  const reactFlowWrapperRef = useRef<any>(null);
  const edgeUpdateSuccessful = useRef<boolean>(true);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // handle new edge connections between nodes
  const onConnect: OnConnect = useCallback(
    (params) =>
      setEdges((eds) => addEdge({ ...params, type: "smoothstep" }, eds)),
    [],
  );

  // delete edge on drop functionality
  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeUpdateSuccessful.current = true;
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    },
    [],
  );
  const onEdgeUpdateEnd = useCallback((_: any, edge: Edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  // handle edges rerouting when node is deleted
  const onNodesDelete: OnNodesDelete = useCallback(
    (deleted) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incoming = getIncomers(node, nodes, edges);
          const outgoing = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge: Edge) => !connectedEdges.includes(edge),
          );

          const createdEdges = incoming.flatMap(({ id: source }) =>
            outgoing.map(({ id: target }) => ({
              id: `e${source}-${target}`,
              source,
              target,
            })),
          );

          return [...remainingEdges, ...createdEdges];
        }, edges),
      );
    },
    [nodes, edges],
  );

  // handle drag and drop creation from createPanel
  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const transferData = JSON.parse(
        event.dataTransfer.getData("application/reactflow"),
      );
      const {
        type,
        data: { mode },
      } = transferData;
      // dropped element validity check
      if (typeof type === "undefined" || !type) {
        return;
      }

      if (reactFlowInstance) {
        const position = (reactFlowInstance as any).screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        const newNode: Node = {
          id: uuidv4(),
          type,
          position,
          data: { mode, label: "Text" },
        };

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance],
  );

  return (
    <div className="relative w-screen h-screen" ref={reactFlowWrapperRef}>
      <ReactFlow
        onInit={setReactFlowInstance as any}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        deleteKeyCode="46"
        fitView
        style={{
          background: "#0a1128",
        }}
      >
        <Background variant={BackgroundVariant.Dots} />
        <MiniMap className="bg-[#001f54]" />
        <Controls />
      </ReactFlow>
      <CreatePanel className="absolute top-5 left-5" />
    </div>
  );
};

export default FlowPlayground;
