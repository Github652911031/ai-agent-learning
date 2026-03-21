"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";

export interface FlowNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type?: "start" | "process" | "decision" | "end" | "tool";
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}

export interface FlowDefinition {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

interface ExecutionFlowProps {
  flow: FlowDefinition;
}

const NODE_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
  start: { fill: "#DCFCE7", stroke: "#22C55E", text: "#166534" },
  process: { fill: "#DBEAFE", stroke: "#3B82F6", text: "#1E40AF" },
  decision: { fill: "#FEF3C7", stroke: "#F59E0B", text: "#92400E" },
  end: { fill: "#FEE2E2", stroke: "#EF4444", text: "#991B1B" },
  tool: { fill: "#F3E8FF", stroke: "#8B5CF6", text: "#5B21B6" },
};

export function ExecutionFlow({ flow }: ExecutionFlowProps) {
  const totalSteps = flow.edges.length + 1; // nodes first, then edges
  const viz = useSteppedVisualization(totalSteps, 800);

  const nodeMap = useMemo(() => {
    const map = new Map<string, FlowNode>();
    flow.nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [flow]);

  // Calculate SVG dimensions
  const maxX = Math.max(...flow.nodes.map((n) => n.x)) + 180;
  const maxY = Math.max(...flow.nodes.map((n) => n.y)) + 60;

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center gap-2">
        <button onClick={viz.prev} disabled={viz.currentStep <= 0} className="rounded px-2 py-1 text-xs bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 dark:bg-zinc-800 dark:hover:bg-zinc-700">
          ←
        </button>
        <button onClick={viz.isPlaying ? viz.pause : viz.play} className="rounded px-3 py-1 text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
          {viz.isPlaying ? "⏸" : "▶"}
        </button>
        <button onClick={viz.next} disabled={viz.isComplete} className="rounded px-2 py-1 text-xs bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 dark:bg-zinc-800 dark:hover:bg-zinc-700">
          →
        </button>
        <button onClick={viz.reset} className="rounded px-2 py-1 text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
          ↺
        </button>
        <span className="text-xs text-zinc-400">{viz.currentStep + 1} / {totalSteps}</span>
      </div>

      {/* SVG */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <svg width={maxX} height={maxY} viewBox={`0 0 ${maxX} ${maxY}`}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
              <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
            </marker>
          </defs>

          {/* Edges */}
          {flow.edges.map((edge, i) => {
            const fromNode = nodeMap.get(edge.from);
            const toNode = nodeMap.get(edge.to);
            if (!fromNode || !toNode) return null;
            const visible = i < viz.currentStep;
            return (
              <g key={`${edge.from}-${edge.to}`} opacity={visible ? 1 : 0.15}>
                <line
                  x1={fromNode.x + 70}
                  y1={fromNode.y + 20}
                  x2={toNode.x + 70}
                  y2={toNode.y + 20}
                  stroke="#94A3B8"
                  strokeWidth={visible ? 2 : 1}
                  markerEnd="url(#arrow)"
                />
                {edge.label && (
                  <text
                    x={(fromNode.x + toNode.x) / 2 + 70}
                    y={(fromNode.y + toNode.y) / 2 + 16}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#94A3B8"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {flow.nodes.map((node, i) => {
            const colors = NODE_COLORS[node.type ?? "process"];
            const visible = i <= viz.currentStep;
            return (
              <g key={node.id} opacity={visible ? 1 : 0.2}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={140}
                  height={40}
                  rx={node.type === "decision" ? 0 : 8}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={visible ? 2 : 1}
                  transform={node.type === "decision" ? `rotate(0 ${node.x + 70} ${node.y + 20})` : undefined}
                />
                <text
                  x={node.x + 70}
                  y={node.y + 24}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={500}
                  fill={colors.text}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
