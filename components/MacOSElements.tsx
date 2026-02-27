"use client";
import { motion } from "framer-motion";

/**
 * macOS-style window traffic lights (red, yellow, green dots)
 */
export function TrafficLights({ 
  className = "", 
  size = "small",
  interactive = false 
}: { 
  className?: string; 
  size?: "small" | "medium";
  interactive?: boolean;
}) {
  const dotSize = size === "small" ? "w-2 h-2" : "w-3 h-3";
  const gap = size === "small" ? "gap-1.5" : "gap-2";

  return (
    <div className={`flex items-center ${gap} ${className}`}>
      <motion.div
        whileHover={interactive ? { scale: 1.2 } : {}}
        className={`${dotSize} rounded-full bg-red-500/80 dark:bg-red-500/60`}
        title="Close"
      />
      <motion.div
        whileHover={interactive ? { scale: 1.2 } : {}}
        className={`${dotSize} rounded-full bg-yellow-500/80 dark:bg-yellow-500/60`}
        title="Minimize"
      />
      <motion.div
        whileHover={interactive ? { scale: 1.2 } : {}}
        className={`${dotSize} rounded-full bg-green-500/80 dark:bg-green-500/60`}
        title="Maximize"
      />
    </div>
  );
}

/**
 * macOS-style window chrome header
 */
export function WindowChrome({ 
  title, 
  children,
  className = "" 
}: { 
  title?: string; 
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between px-4 py-2.5 border-b border-slate-200/50 dark:border-slate-700/30 ${className}`}>
      <TrafficLights size="small" />
      {title && (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 absolute left-1/2 transform -translate-x-1/2">
          {title}
        </span>
      )}
      {children}
    </div>
  );
}

/**
 * macOS-style window container
 */
export function MacOSWindow({
  title,
  children,
  className = "",
  showTrafficLights = true,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  showTrafficLights?: boolean;
}) {
  return (
    <div className={`rounded-xl overflow-hidden bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/40 shadow-lg shadow-black/5 dark:shadow-black/20 ${className}`}>
      {showTrafficLights && (
        <div className="relative bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200/50 dark:border-slate-700/30 px-4 py-2.5">
          <TrafficLights size="small" />
          {title && (
            <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-slate-600 dark:text-slate-400">
              {title}
            </span>
          )}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

/**
 * Reusable macOS-style card wrapper
 * Perfect for wrapping any card content with window chrome and traffic lights
 */
export function MacOSCard({
  children,
  className = "",
  title,
  hoverEffect = true,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  hoverEffect?: boolean;
}) {
  return (
    <div
      className={`rounded-xl overflow-hidden bg-white/60 dark:bg-slate-800/40 backdrop-blur-lg border border-slate-200/60 dark:border-slate-700/40 macos-shadow ${
        hoverEffect ? "hover:border-blue-400/60 dark:hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300" : "transition-all"
      } ${className}`}
    >
      {/* macOS Window Chrome */}
      <div className="bg-slate-50/50 dark:bg-slate-900/30 px-4 py-2.5 border-b border-slate-200/50 dark:border-slate-700/30 flex items-center">
        <TrafficLights size="small" />
        {title && (
          <span className="ml-auto mr-auto text-xs font-medium text-slate-600 dark:text-slate-400">
            {title}
          </span>
        )}
      </div>

      {/* Card Content */}
      {children}
    </div>
  );
}
