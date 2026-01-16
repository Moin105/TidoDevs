"use client";

import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import WorkflowParticleBackground from "./WorkflowParticleBackground";
import {
  BarChart3,
  Blocks,
  Bot,
  Cloud,
  Code2,
  Cog,
  GitBranch,
  Megaphone,
  Palette,
  PlugZap,
  ShieldCheck,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Configuration ---
// Grid constants
const GRID_COLS = 8;
const GRID_ROWS = 6;
const CELL_SIZE = 100; // Size of each grid cell in pixels
const GAP = 24; // Gap between cells
const NODE_SIZE = CELL_SIZE;
const COL_OFFSET = 1;

type NodeConfig = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  pos: [number, number];
  color: string;
  bg: string;
  borderColor: string;
};

type NodePosition = { x: number; y: number };

// Positions are 0-indexed [col, row]
const NODES: NodeConfig[] = [
  { id: "automation", label: "Automation", icon: Cog, pos: [1, 0], color: "text-emerald-500", bg: "bg-emerald-500/10", borderColor: "rgba(16, 185, 129, 0.3)" },
  { id: "digital-marketing", label: "Digital Marketing", icon: Megaphone, pos: [3, 0], color: "text-pink-500", bg: "bg-pink-500/10", borderColor: "rgba(236, 72, 153, 0.3)" },

  { id: "web-development", label: "Web Development", icon: Code2, pos: [0, 2], color: "text-blue-500", bg: "bg-blue-500/10", borderColor: "rgba(59, 130, 246, 0.3)" },
  { id: "ai-solutions", label: "AI Solutions", icon: Bot, pos: [2, 2], color: "text-amber-500", bg: "bg-amber-500/10", borderColor: "rgba(245, 158, 11, 0.3)" },
  { id: "web3", label: "Web3 & Blockchain", icon: Blocks, pos: [4, 2], color: "text-purple-500", bg: "bg-purple-500/10", borderColor: "rgba(168, 85, 247, 0.3)" },

  { id: "cloud", label: "Cloud Infrastructure", icon: Cloud, pos: [5, 3], color: "text-cyan-500", bg: "bg-cyan-500/10", borderColor: "rgba(6, 182, 212, 0.3)" },

  { id: "devops", label: "DevOps Pipelines", icon: GitBranch, pos: [1, 4], color: "text-emerald-500", bg: "bg-emerald-500/10", borderColor: "rgba(16, 185, 129, 0.3)" },
  { id: "analytics", label: "Growth Analytics", icon: BarChart3, pos: [3, 4], color: "text-amber-500", bg: "bg-amber-500/10", borderColor: "rgba(245, 158, 11, 0.3)" },

  { id: "ux-ui", label: "UX/UI Design", icon: Palette, pos: [0, 5], color: "text-pink-500", bg: "bg-pink-500/10", borderColor: "rgba(236, 72, 153, 0.3)" },
  { id: "integrations", label: "API Integrations", icon: PlugZap, pos: [2, 5], color: "text-sky-500", bg: "bg-sky-500/10", borderColor: "rgba(14, 165, 233, 0.3)" },
  { id: "security", label: "Security & Compliance", icon: ShieldCheck, pos: [4, 5], color: "text-purple-500", bg: "bg-purple-500/10", borderColor: "rgba(168, 85, 247, 0.3)" },
];

// Connections between nodes
const CONNECTIONS = [
  { from: "automation", to: "devops", color: "#10b981" },
  { from: "automation", to: "integrations", color: "#0ea5e9" },
  { from: "automation", to: "ai-solutions", color: "#f59e0b" },

  { from: "web-development", to: "ux-ui", color: "#3b82f6" },
  { from: "web-development", to: "integrations", color: "#0ea5e9" },
  { from: "web-development", to: "devops", color: "#10b981" },

  { from: "ai-solutions", to: "analytics", color: "#f59e0b" },
  { from: "ai-solutions", to: "automation", color: "#10b981" },

  { from: "digital-marketing", to: "analytics", color: "#ec4899" },
  { from: "digital-marketing", to: "ux-ui", color: "#ec4899" },

  { from: "web3", to: "security", color: "#a855f7" },
  { from: "web3", to: "integrations", color: "#0ea5e9" },

  { from: "integrations", to: "cloud", color: "#06b6d4" },
  { from: "cloud", to: "security", color: "#06b6d4" },
  { from: "devops", to: "cloud", color: "#10b981" },
];

// --- Components ---

export default function WorkflowAnimation() {
  // Calculate total SVG dimensions
  const width = GRID_COLS * CELL_SIZE + (GRID_COLS - 1) * GAP;
  const height = GRID_ROWS * CELL_SIZE + (GRID_ROWS - 1) * GAP;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const initialPositions = useMemo(() => {
    return Object.fromEntries(
      NODES.map((node) => [
        node.id,
        {
          x: (node.pos[0] + COL_OFFSET) * (CELL_SIZE + GAP),
          y: node.pos[1] * (CELL_SIZE + GAP),
        },
      ])
    ) as Record<string, NodePosition>;
  }, []);

  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>(
    initialPositions
  );

  const updateNodePosition = (id: string, clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const nextX = clientX - rect.left - NODE_SIZE / 2;
    const nextY = clientY - rect.top - NODE_SIZE / 2;

    setNodePositions((prev) => ({
      ...prev,
      [id]: {
        x: Math.min(Math.max(0, nextX), width - NODE_SIZE),
        y: Math.min(Math.max(0, nextY), height - NODE_SIZE),
      },
    }));
  };

  return (
    <section className="py-32 bg-transparent relative overflow-hidden">
      <WorkflowParticleBackground />
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 w-full relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 200,
            duration: 0.8,
          }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Workflow & Integration
          </h2>
          <p className="text-xl text-gray-400">
            Seamless connections between services
          </p>
        </motion.div>

        <div className="flex items-center justify-center">
          <div
            ref={containerRef}
            className="relative"
            style={{ width, height }}
          >
            {/* 1. The SVG Layer for Lines */}
            <svg 
              className="absolute inset-0 pointer-events-none z-0"
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              fill="none"
            >
                <Defs />
                {CONNECTIONS.map((conn, i) => (
                  <AnimatedConnection
                    key={i}
                    connection={conn}
                    nodes={NODES}
                    nodePositions={nodePositions}
                    index={i}
                  />
                ))}
            </svg>

            {/* 2. The Grid of Nodes */}
            <div className="absolute inset-0 z-10">
              {/* Render Actual Nodes */}
              {NODES.map((node, index) => (
                <NodeItem
                  key={node.id}
                  node={node}
                  index={index}
                  position={nodePositions[node.id]}
                  onDragUpdate={updateNodePosition}
                  dragConstraintsRef={containerRef}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Sub-Components ---

// Reusable SVG Gradients
function Defs() {
  return (
    <defs>
      <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#84cc16" />
        <stop offset="100%" stopColor="#22c55e" />
      </linearGradient>
      <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
  );
}

// The Line Renderer
function AnimatedConnection({
  connection,
  nodes,
  nodePositions,
  index,
}: {
  connection: { from: string; to: string; color: string };
  nodes: NodeConfig[];
  nodePositions: Record<string, NodePosition>;
  index: number;
}) {
  const fromNode = nodes.find((n: any) => n.id === connection.from);
  const toNode = nodes.find((n: any) => n.id === connection.to);

  // Helper to get center coordinates of a grid cell
  const getCoord = (id: string, fallbackPos: [number, number]) => {
    const fallback = {
      x: (fallbackPos[0] + COL_OFFSET) * (CELL_SIZE + GAP),
      y: fallbackPos[1] * (CELL_SIZE + GAP),
    };
    const pos = nodePositions[id] ?? fallback;
    return { x: pos.x + NODE_SIZE / 2, y: pos.y + NODE_SIZE / 2 };
  };

  if (!fromNode || !toNode) {
    return null;
  }

  const start = getCoord(fromNode.id, fromNode.pos);
  const end = getCoord(toNode.id, toNode.pos);

  // Path logic: Move to start -> Curve logic
  // Simple curved connector logic (Horizontal -> Curve -> Vertical)
  const pathData = generateCurvedPath(start, end);

  // Find the index of the source node to determine when this path should activate
  const fromNodeIndex = nodes.findIndex((n: any) => n.id === connection.from);
  
  // Box activation time: fromNodeIndex * 1.5 (each box takes ~1.5s to activate)
  // Path activates 0.8s after its source box starts activating
  const boxActivationDelay = fromNodeIndex * 1.5;
  const pathActivationDelay = boxActivationDelay + 0.8;
  
  // Total cycle time: all boxes activate + stay active + reset
  const totalCycleTime = (nodes.length * 1.5) + 1.0 + 0.5 + 1; // boxes + active + reset + buffer
  const resetDelay = totalCycleTime;

  return (
    <>
      {/* Inactive Path - always visible in gray, fades out when active, fades back in BEFORE box resets */}
      <motion.path
        d={pathData}
        fill="none"
        stroke="#6b7280" // Gray color for inactive state
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ opacity: 0.6, pathLength: 1 }}
        animate={{ 
          opacity: [0.6, 0.6, 0, 0, 0.6],
        }}
        transition={{ 
          times: [0, pathActivationDelay / resetDelay, (pathActivationDelay + 0.1) / resetDelay, (pathActivationDelay + 0.6) / resetDelay, 1],
          duration: resetDelay,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      {/* Active Path - animates after source box activates, then resets to gray BEFORE box resets */}
      <motion.path
        d={pathData}
        fill="none"
        stroke={connection.color} // Active color
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: [0, 1, 1, 0],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ 
          times: [0, 0.15, 0.7, 0.75], // 15% draw, 55% visible, 5% fade (fades before box resets)
          duration: resetDelay,
          delay: pathActivationDelay, 
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </>
  );
}

// Helper to generate a nice curved path between two points
function generateCurvedPath(start: {x:number, y:number}, end: {x:number, y:number}) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const controlX = start.x + dx * 0.5;
    
    // Cubic Bezier for smooth S-curve
    return `M ${start.x} ${start.y} C ${controlX} ${start.y}, ${controlX} ${end.y}, ${end.x} ${end.y}`;
}

// The Card Component
function NodeItem({
  node,
  index,
  position,
  onDragUpdate,
  dragConstraintsRef,
}: {
  node: NodeConfig;
  index: number;
  position: NodePosition;
  onDragUpdate: (id: string, clientX: number, clientY: number) => void;
  dragConstraintsRef: React.RefObject<HTMLDivElement>;
}) {
  if (!position) {
    return null;
  }

  // Sequential activation: each box activates after the previous one
  const activationDelay = index * 1.5; // Each box takes ~1.5s to activate
  const boxActiveDuration = 1.0; // How long box stays active
  const boxResetDuration = 0.5; // How long to reset to inactive
  
  // Total cycle time: all boxes activate + stay active + reset
  const totalCycleTime = (NODES.length * 1.5) + boxActiveDuration + boxResetDuration + 1; // Extra buffer
  const resetDelay = totalCycleTime;

  return (
    <motion.div
      style={{
        left: position.x,
        top: position.y,
        width: NODE_SIZE,
        height: NODE_SIZE,
      }}
      className="absolute flex flex-col items-center justify-center rounded-xl bg-[#1A1A1A] shadow-lg z-20 cursor-grab active:cursor-grabbing"
      drag
      dragConstraints={dragConstraintsRef}
      dragElastic={0.12}
      dragMomentum={false}
      onDrag={(event) => {
        if ("clientX" in event && "clientY" in event) {
          onDragUpdate(node.id, event.clientX, event.clientY);
        }
      }}
      onDragEnd={(event) => {
        if ("clientX" in event && "clientY" in event) {
          onDragUpdate(node.id, event.clientX, event.clientY);
        }
      }}
      initial={{ 
        scale: 0.7, 
        opacity: 0.6,
      }}
      animate={{ 
        scale: [0.7, 1, 1, 0.7],
        opacity: [0.6, 1, 1, 0.6],
      }}
      transition={{ 
        times: [0, 0.2, 0.75, 1], // 20% activate, 55% stay active, 25% reset (resets AFTER path)
        duration: resetDelay,
        delay: activationDelay,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      <motion.div
        className="relative w-full h-full flex flex-col items-center justify-center"
        animate={{
          x: [0, 2, -2, 0],
          y: [0, -2, 2, 0],
        }}
        transition={{
          duration: 6 + index * 0.3,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        {/* Grayscale overlay - fades out when active, fades back in when inactive */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none z-30"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            mixBlendMode: "multiply",
          }}
          initial={{ opacity: 1 }}
          animate={{ 
            opacity: [1, 0, 0, 1],
          }}
          transition={{ 
            times: [0, 0.2, 0.75, 1], // Fades back in AFTER path goes gray
            duration: resetDelay,
            delay: activationDelay,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        {/* Inactive border - gray (always visible initially) */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-slate-500/60"
          initial={{ opacity: 1 }}
          animate={{ 
            opacity: [1, 0, 0, 1],
          }}
          transition={{
            times: [0, 0.2, 0.75, 1], // Resets AFTER path goes gray
            duration: resetDelay,
            delay: activationDelay,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        {/* Active border - colored (appears when box activates) */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2"
          style={{ borderColor: node.borderColor }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            times: [0, 0.2, 0.75, 1], // Resets AFTER path goes gray
            duration: resetDelay,
            delay: activationDelay,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        
        {/* Icon container - starts gray, transitions to colored */}
        <motion.div 
          className="p-3 rounded-full mb-2 relative"
          initial={{ 
            scale: 0.7,
            opacity: 0.6,
          }}
          animate={{ 
            scale: [0.7, 1, 1, 0.7],
            opacity: [0.6, 1, 1, 0.6],
          }}
          transition={{ 
            times: [0, 0.2, 0.8, 1],
            duration: resetDelay,
            delay: activationDelay,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          {/* Gray background - fades out and back in */}
          <motion.div
            className="absolute inset-0 rounded-full bg-slate-700/30"
            initial={{ opacity: 1 }}
            animate={{ 
              opacity: [1, 0, 0, 1],
            }}
            transition={{ 
              times: [0, 0.2, 0.8, 1],
              duration: resetDelay,
              delay: activationDelay,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
          {/* Colored background - fades in and back out */}
          <motion.div
            className={cn("absolute inset-0 rounded-full", node.bg)}
            initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            times: [0, 0.2, 0.75, 1], // Fades out AFTER path goes gray
            duration: resetDelay,
            delay: activationDelay,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          />
          {/* Gray icon - fades out and back in */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 1 }}
            animate={{ 
              opacity: [1, 0, 0, 1],
            }}
            transition={{ 
              times: [0, 0.2, 0.8, 1],
              duration: resetDelay,
              delay: activationDelay,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            <node.icon className="w-6 h-6 text-gray-500" />
          </motion.div>
          {/* Colored icon - fades in and back out */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10"
            initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            times: [0, 0.2, 0.75, 1], // Fades out AFTER path goes gray
            duration: resetDelay,
            delay: activationDelay,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          >
            <node.icon className={cn("w-6 h-6", node.color)} />
          </motion.div>
        </motion.div>
        
        {/* Label - transitions from gray to white and back */}
        <motion.span 
          className="text-xs font-semibold text-center px-2"
          style={{
            opacity: 0.5,
            color: "#9ca3af", // Gray - initial state
          }}
          animate={{ 
            opacity: [0.5, 1, 1, 0.5],
            color: ["#9ca3af", "#d1d5db", "#d1d5db", "#9ca3af"], // Gray to white and back
          }}
          transition={{ 
            times: [0, 0.2, 0.75, 1], // Resets AFTER path goes gray
            duration: resetDelay,
            delay: activationDelay,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          {node.label}
        </motion.span>
        
        {/* Active Pulse Effect - only appears after activation, then disappears */}
        <motion.div 
          className={cn("absolute inset-0 rounded-xl opacity-20", node.bg)}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.2, 0.2, 0],
          }}
          transition={{ 
            times: [0, 0.2, 0.75, 1], // Disappears AFTER path goes gray
            duration: resetDelay,
            delay: activationDelay,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
