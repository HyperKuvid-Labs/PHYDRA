"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "./navBar";
import SpaceZonesDashboard from "./zoneThing";
import ContainerDashboard from "./containerThing";

const SpaceStationLayout = () => {
  const [activeZone, setActiveZone] = useState(null);
  // const [zoneData, setZoneData] = useState(""); // zoneData seems unused if activeZone holds the object

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  // Item animation
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    },
    hover: {
      scale: 1.05,
      y: -8,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
      },
    },
    tap: {
      scale: 0.98,
      rotateX: "5deg",
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
      },
    },
  };

  // Glow pulse animation
  const glowPulse = {
    initial: { opacity: 0.4 }, // Reduced initial and max opacity
    animate: {
      opacity: [0.4, 0.7, 0.4], // Reduced opacity range
      transition: {
        duration: 2.5, // Slightly slower pulse
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  };

  // Blueprint grid pattern
  const blueprintPattern = {
    backgroundImage: `
      linear-gradient(rgba(0, 149, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 149, 255, 0.05) 1px, transparent 1px)
    `,
    backgroundSize: "20px 20px",
  };

  return (
    <div
      className="bg-[#050A14] min-h-screen p-6 md:p-10 flex items-center justify-center overflow-hidden relative w-full" // Removed min-w-screen, added w-full
      style={blueprintPattern}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="absolute top-2/3 right-1/4 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
        </div>
      </div>

      {/* Navbar */}
      <div
        className="absolute top-0 left-0 w-full p-4 z-50 bg-#15112b bg-opacity-50 rounded-lg shadow-lg"
        style={{
          transform: "translateZ(100px)",
          perspective: "1000px",
        }}
      >
        <Navbar />
      </div>
      {/* Animated glow effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full bg-cyan-500/15 blur-2xl" // Reduced size, opacity, and blur
        variants={glowPulse}
        initial="initial"
        animate="animate"
        style={{
          transform: "translate(-50%, -50%)",
        }}
      ></motion.div>

      {/* Main content */}
      <motion.div
        className="flex flex-col items-center justify-center w-full h-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {activeZone ? (
            <motion.div
              key="container-dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center" // Ensure div takes space
            >
              <ContainerDashboard
                zoneName={activeZone.name} // Assuming activeZone is an object with name and imageUrl
                zoneImg={activeZone.imageUrl}
              />
            </motion.div>
          ) : (
            <motion.div
              key="space-zones-dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center" // Ensure div takes space
            >
              <SpaceZonesDashboard setActiveZone={setActiveZone} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SpaceStationLayout;
