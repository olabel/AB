import React, { useState } from "react";
import { decisionMap } from "../content/data.ts";

export const DecisionMap: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("accounts");

  const selectedNode = decisionMap.nodes.find((n) => n.id === selectedNodeId);

  // Find all edges connected to the selected node
  const connectedEdges = decisionMap.edges.filter(
    (e) => e.a === selectedNodeId || e.b === selectedNodeId
  );

  // Map of connected node IDs
  const connectedNodeIds = new Set<string>();
  connectedEdges.forEach((e) => {
    connectedNodeIds.add(e.a);
    connectedNodeIds.add(e.b);
  });

  // Lookup node by id
  const getNode = (id: string) => decisionMap.nodes.find((n) => n.id === id);

  return (
    <div className="bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] p-6 lg:p-10 shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* SVG Diagram Column */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[560px] aspect-[560/420] relative">
            <svg
              viewBox="0 0 560 420"
              className="w-full h-full select-none"
              role="img"
              aria-label="Interactive financial decisions connection diagram"
            >
              <title>Connected Financial Decisions Diagram</title>

              {/* Background ring guide */}
              <circle
                cx="280"
                cy="210"
                r="165"
                fill="none"
                stroke="#ece6da"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Connecting Edges */}
              {decisionMap.edges.map((edge, idx) => {
                const nodeA = getNode(edge.a);
                const nodeB = getNode(edge.b);
                if (!nodeA || !nodeB) return null;

                const isConnected =
                  edge.a === selectedNodeId || edge.b === selectedNodeId;

                return (
                  <line
                    key={`edge-${idx}`}
                    x1={nodeA.x}
                    y1={nodeA.y}
                    x2={nodeB.x}
                    y2={nodeB.y}
                    stroke={isConnected ? "#2e4a3b" : "#d6cebd"}
                    strokeWidth={isConnected ? "2.5" : "1"}
                    strokeOpacity={isConnected ? "1" : "0.5"}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Nodes */}
              {decisionMap.nodes.map((node) => {
                const isSelected = node.id === selectedNodeId;
                const isConnected = connectedNodeIds.has(node.id);

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedNodeId(node.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedNodeId(node.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    aria-label={`${node.label}${isSelected ? " (Selected)" : ""}`}
                  >
                    {/* Hit area */}
                    <circle cx={node.x} cy={node.y} r="28" fill="transparent" />

                    {/* Outer pulse/selection ring */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="18"
                        fill="none"
                        stroke="#75581f"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="12"
                      fill={isSelected ? "#2e4a3b" : isConnected ? "#ece6da" : "#fcfaf5"}
                      stroke={isSelected ? "#2e4a3b" : isConnected ? "#2e4a3b" : "#8d8677"}
                      strokeWidth={isSelected ? "3" : isConnected ? "2" : "1.5"}
                      className="transition-colors duration-200 group-hover:stroke-[#2e4a3b]"
                    />

                    {/* Center Brass Accent Dot */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="4"
                      fill={isSelected ? "#fbe7a1" : isConnected ? "#75581f" : "#d6cebd"}
                      className="transition-colors duration-200"
                    />

                    {/* Text Label */}
                    <text
                      x={node.x + node.label_dx}
                      y={node.y + (node.label_dy > 0 ? 32 : -22)}
                      textAnchor={node.anchor as "middle" | "start" | "end"}
                      className={`text-[13px] font-sans transition-colors duration-200 pointer-events-none ${
                        isSelected
                          ? "font-semibold fill-[#1c1b18]"
                          : isConnected
                          ? "font-medium fill-[#2e4a3b]"
                          : "fill-[#46423a] group-hover:fill-[#1c1b18]"
                      }`}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <p className="text-xs text-[#625d52] text-center mt-2 italic">
            Select any node on the ring or choose from the list to see how decisions pull on each other.
          </p>
        </div>

        {/* Explanations & Node Buttons Column */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="mb-4">
            <span className="eyebrow text-xs">Interactive Decision Map</span>
            <h3 className="h3 text-[#1c1b18] mt-1">
              Choose a decision to see what it touches
            </h3>
          </div>

          {/* Accessible buttons list */}
          <div
            role="tablist"
            aria-label="Financial decisions"
            className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6"
          >
            {decisionMap.nodes.map((node, index) => {
              const isSelected = node.id === selectedNodeId;
              return (
                <button
                  key={node.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`text-left p-2.5 text-xs font-medium rounded-[2px] border transition-all ${
                    isSelected
                      ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] shadow-xs"
                      : "bg-[#f7f3eb] text-[#1c1b18] border-[#d6cebd] hover:border-[#8d8677]"
                  }`}
                >
                  <span className="block text-[0.68rem] opacity-75 font-mono mb-0.5">
                    0{index + 1}
                  </span>
                  <span className="line-clamp-2 leading-tight">{node.label}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Connections Explanations */}
          <div className="border-t border-[#d6cebd] pt-5">
            <div className="flex items-baseline justify-between mb-3">
              <h4 className="font-serif text-lg font-medium text-[#1c1b18]">
                {selectedNode?.label} <span className="font-sans text-xs text-[#625d52] font-normal">connects to:</span>
              </h4>
              <span className="text-xs font-mono text-[#75581f]">
                {connectedEdges.length} connections
              </span>
            </div>

            <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-2">
              {connectedEdges.map((edge, idx) => {
                const otherId = edge.a === selectedNodeId ? edge.b : edge.a;
                const otherNode = getNode(otherId);
                return (
                  <div
                    key={`conn-${idx}`}
                    className="p-3 bg-[#f7f3eb] border-l-2 border-[#2e4a3b] rounded-r-[2px] text-xs leading-relaxed"
                  >
                    <strong className="block text-[#2e4a3b] font-semibold text-xs mb-1">
                      {otherNode?.label}
                    </strong>
                    <p className="text-[#46423a]">{edge.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
