import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import axios from "axios";
import {
  Rocket,
  Satellite,
  Radio,
  Orbit,
  Radar,
  AlertCircle,
  Wifi,
  X,
} from "lucide-react";
import ContainerDashboard from "./containerThing";

export default function SpaceZonesDashboard({ setActiveZone }) { // Changed prop to setActiveZone as per allThings.jsx
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null); // Used to trigger modal and pass data
  // const [selectedZoneData, setSelectedZoneData] = useState(null); // This seems unused
  const cardsRef = useRef(null);
  // const starsRef = useRef(null); // This ref is not assigned to any JSX element for main background stars

  // Static Zone Data with Image URLs
  const staticZones = [
    {
      name: "Life Support",
      imageUrl:
        "https://images.unsplash.com/photo-1702428903130-dda216ebd63f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      moduleId: "ISS-181",
      temperature: "21.6°C",
      pressure: "182.4 kPa",
      oxygenLevel: "21.8%",
      status: "Nominal",
    },
    {
      name: "Medical Bay",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1661855359165-99c68161d7dd?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      moduleId: "ISS-182",
      temperature: "22.7°C",
      pressure: "181.7 kPa",
      oxygenLevel: "29.1%",
      status: "Nominal",
    },
    {
      name: "Engine Bay",
      imageUrl:
        "https://images.unsplash.com/photo-1546817312-6636ff08b06d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      moduleId: "ISS-183",
      temperature: "24.8°C",
      pressure: "181.5 kPa",
      oxygenLevel: "28.4%",
      status: "Nominal",
    },
    {
      name: "Command Center",
      imageUrl:
        "https://images.unsplash.com/photo-1737502483514-010a36cf6b9b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      moduleId: "ISS-184",
      temperature: "20.3°C",
      pressure: "182.8 kPa",
      oxygenLevel: "29.3%",
      status: "Nominal",
    },
    {
      name: "Crew Quarters",
      imageUrl:
        "https://images.unsplash.com/photo-1578852799294-cf61faaec83c?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      moduleId: "ISS-185",
      temperature: "23.7°C",
      pressure: "181.9 kPa",
      oxygenLevel: "29.4%",
      status: "Nominal",
    },
    {
      name: "Maintenance Bay",
      imageUrl:
        "https://media.istockphoto.com/id/1373098211/photo/nasa-spaceship-interior.webp?a=1&b=1&s=612x612&w=0&k=20&c=i9p7kw_zLFxCPiUdaCnxrvWuxnxrLj5JEtdR7KZeXKQ=",
      moduleId: "ISS-186",
      temperature: "21.7°C",
      pressure: "181.7 kPa",
      oxygenLevel: "28.8%",
      status: "Nominal",
    },
    {
      name: "Cockpit",
      imageUrl:
        "https://images.unsplash.com/photo-1704964969482-628c5e29d09a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      moduleId: "ISS-187",
      temperature: "22.1°C",
      pressure: "181.0 kPa",
      oxygenLevel: "28.8%",
      status: "Nominal",
    },
    {
      name: "Engineering Bay",
      imageUrl:
        "https://images.unsplash.com/photo-1607083984559-c4c42e3cb0b3?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      moduleId: "ISS-188",
      temperature: "23.4°C",
      pressure: "183.9 kPa",
      oxygenLevel: "29.8%",
      status: "Nominal",
    },
    {
      name: "External Storage",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1661386266452-54ebeaf7339d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      moduleId: "ISS-189",
      temperature: "22.3°C",
      pressure: "183.1 kPa",
      oxygenLevel: "29.4%",
      status: "Nominal",
    },
    {
      name: "Sanitation Bay",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1680391379670-5907f52bb0d9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGludGVybmF0aW9uYWwlMjBzcGFjZSUyMHN0YXRpb24lMjBzYW5pdGF0aW9uJTIwYmF5fGVufDB8fDB8fHww",
      moduleId: "ISS-110",
      temperature: "23.8°C",
      pressure: "182.1 kPa",
      oxygenLevel: "29.3%",
      status: "Nominal",
    },
    {
      name: "Airlock",
      imageUrl:
        "https://media.istockphoto.com/id/1057913042/photo/earth-in-spaceship-international-space-station-window-porthole-elements-of-this-image.webp?a=1&b=1&s=612x612&w=0&k=20&c=u6NzWDA7-qQxYZMqMBld2osniaa0cFDWMLFSsyzwo9A=",
      moduleId: "ISS-111",
      temperature: "24.3°C",
      pressure: "183.0 kPa",
      oxygenLevel: "29.0%",
      status: "Nominal",
    },
    {
      name: "Storage Bay",
      imageUrl:
        "https://media.istockphoto.com/id/1373098216/photo/nasa-international-space-station-iss-interior.webp?a=1&b=1&s=612x612&w=0&k=20&c=bV_sB3Y3nJl3MEBJiqGOk7ouatKlSJ4mSwiQ-77ofkU=",
      moduleId: "ISS-112",
      temperature: "20.2°C",
      pressure: "181.4 kPa",
      oxygenLevel: "29.4%",
      status: "Nominal",
    },
    {
      name: "Lab",
      imageUrl:
        "https://images.unsplash.com/photo-1658607204160-af3d7391fa5e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGludGVybmF0aW9uYWwlMjBzcGFjZSUyMHN0YXRpb24lMjBsYWJ8ZW58MHx8MHx8fDA%3D",
      moduleId: "ISS-113",
      temperature: "21.5°C",
      pressure: "182.2 kPa",
      oxygenLevel: "28.1%",
      status: "Nominal",
    },
    {
      name: "Greenhouse",
      imageUrl:
        "https://images.unsplash.com/photo-1740915143999-76b9d630bcf9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aW50ZXJuYXRpb25hbCUyMHNwYWNlJTIwc3RhdGlvbiUyMGdyZWVuaG91c2V8ZW58MHx8MHx8fDA%3D",
      moduleId: "ISS-114",
      temperature: "24.7°C",
      pressure: "182.3 kPa",
      oxygenLevel: "28.4%",
      status: "Nominal",
    },
    {
      name: "Power Bay",
      imageUrl:
        "https://media.istockphoto.com/id/658913150/photo/international-space-station-and-sun-above-the-earth.webp?a=1&b=1&s=612x612&w=0&k=20&c=Z4Ra2HbWojs7CmRDcTjVPnNsIVt_W20D1EJR9NhXy_0=",
      moduleId: "ISS-115",
      temperature: "21.1°C",
      pressure: "184.0 kPa",
      oxygenLevel: "28.1%",
      status: "Nominal",
    },
    {
      name: "otherZone",
      imageUrl:
        "https://images.unsplash.com/photo-1565501280525-2e9a49ad4463?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW50ZXJuYXRpb25hbCUyMHNwYWNlJTIwc3RhdGlvbiUyMHBvd2VyJTIwYmF5fGVufDB8fDB8fHww",
      moduleId: "ISS-115",
      temperature: "21.1°C",
      pressure: "184.0 kPa",
      oxygenLevel: "28.1%",
      status: "Nominal",
    },
  ];

  // Function to get appropriate icon based on zone name
  const getZoneIcon = (zoneName) => {
    const iconProps = { className: "w-6 h-6", strokeWidth: 1.5 };

    if (zoneName.includes("Command") || zoneName.includes("Control"))
      return <Radar {...iconProps} />;
    if (zoneName.includes("Storage") || zoneName.includes("Cargo"))
      return <Satellite {...iconProps} />;
    if (zoneName.includes("External")) return <Orbit {...iconProps} />;
    if (zoneName.includes("Communication")) return <Radio {...iconProps} />;
    if (zoneName.includes("Alert") || zoneName.includes("Emergency"))
      return <AlertCircle {...iconProps} />;
    if (zoneName.includes("Signal") || zoneName.includes("Transmission"))
      return <Wifi {...iconProps} />;

    return <Rocket {...iconProps} />;
  };

  // Initialize zones with API data
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5173/api/get-zones",
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        const data = response.data;

        if (data.Response === "SUCCESS" && Array.isArray(data.zones)) {
          let matchedZones = data.zones.map((zoneName, index) => {
            if (index < 16 && staticZones[index]) {
              return staticZones[index];
            }
            return {
              name: zoneName,
              imageUrl: staticZones[15].imageUrl,
              moduleId: `ISS-${index + 1}`,
              temperature: "21.0°C",
              pressure: "182.0 kPa",
              oxygenLevel: "28.0%",
              status: "Nominal",
            };
          });

          setZones(matchedZones);
          // Removed call to onZonesDataFetched
        }
        setLoading(false);
      } catch (error) {
        console.warn("Error fetching zones, using default 16 zones:", error);
        const default16Zones = staticZones.slice(0, 16);
        setZones(default16Zones);
        // Removed call to onZonesDataFetched
        setLoading(false);
      }
    };

    fetchZones();
  }, []); // Removed onZonesDataFetched from dependency array

  // Animate cards when they load - This GSAP animation is removed as ZoneCard now handles its own animation with stagger via delay.
  // useEffect(() => {
  //   if (!loading && zones.length > 0 && cardsRef.current) {
  //     const cards = cardsRef.current.children;
  //     gsap.fromTo(
  //       cards,
  //       {
  //         y: 50,
  //         opacity: 0,
  //       },
  //       {
  //         y: 0,
  //         opacity: 1,
  //         stagger: 0.1,
  //         duration: 0.8,
  //         ease: "power3.out",
  //       }
  //     );
  //   }
  // }, [loading, zones]);

  return (
    <div className="h-full min-w-screen bg-transparent text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* ISS orbit path */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border border-[#f48599]/10 rounded-full opacity-20 z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-[#f8b4c0]/10 rounded-full opacity-20 z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="flex flex-col items-center justify-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center mb-4">
            <Rocket className="w-8 h-8 mr-3 text-[#f48599]" />
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-[#f05672] to-[#f8b4c0] text-transparent bg-clip-text">
                ISS Zones Monitor
              </span>
            </h1>
          </div>
          <div className="text-[#e6e6e6] text-center max-w-2xl">
            <p className="text-sm md:text-base">
              Real-time monitoring system for International Space Station
              modules and zones
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-xs">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse"></div>
                <span>Systems Online</span>
              </div>
              <div className="w-px h-4 bg-[#f48599]/30"></div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#f48599] mr-1"></div>
                <span>Orbit: LEO</span>
              </div>
              <div className="w-px h-4 bg-[#f48599]/30"></div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#f8b4c0] mr-1"></div>
                <span>Altitude: 408 km</span>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Loading and Error Handling */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
            {Array.from({ length: 8 }).map((_, index) => ( // Show 8 skeleton cards
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-500/20 text-red-200 p-6 rounded-lg text-center border border-red-500/30 max-w-md mx-auto">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <h3 className="text-lg font-semibold mb-1">Connection Error</h3>
            <p>{error}</p>
            <p className="text-xs mt-2 text-red-300">
              Try reestablishing connection to ISS systems
            </p>
          </div>
        ) : (
          <motion.div
            ref={cardsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
            layout
          >
            <AnimatePresence>
              {zones.map((zone, index) => (
                <ZoneCard
                  key={zone.name} // Ensure key is stable and unique
                  zone={zone}
                  icon={getZoneIcon(zone.name)}
                  index={index}
                  setSelectedZone={setSelectedZone} // Pass setSelectedZone to ZoneCard
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Modal using AnimatePresence and selectedZone state */}
      <AnimatePresence>
        {selectedZone && (
          <ModalContent
            zone={selectedZone}
            onClose={() => setSelectedZone(null)} // This uses the local selectedZone state
            // If setActiveZone from parent was intended to be called here, it would be:
            // onClose={() => { setSelectedZone(null); if (setActiveZone) setActiveZone(null); }}
            // But current logic is local modal closure.
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Note: setSelectedZone is now a prop for ZoneCard
function ZoneCard({ zone, icon, index, setSelectedZone }) {
  const {
    name,
    //imageUrl, // Part of zone object
    moduleId,
    temperature,
    pressure,
    oxygenLevel,
    status,
  } = zone;
  const statusColor =
    status === "Nominal" ? "text-green-400" : "text-yellow-400";
  // const [isModalOpen, setIsModalOpen] = useState(false); // Modal state managed by selectedZone in parent
  const modalStarsRef = useRef(null); // For stars inside the modal if ModalContent is part of ZoneCard

  // GSAP Star Animation for Modal (will be moved to ModalContent if it's separate)
  // For now, assuming ModalContent might be defined within ZoneCard or called differently.
  // If ModalContent is fully separate, this useEffect should go with it.
  useEffect(() => {
    // This effect is problematic if ModalContent is separate and relies on isModalOpen
    // It should be tied to selectedZone or ModalContent's own lifecycle.
    // For now, commenting out as it depends on ModalContent structure
    /*
    if (isModalOpen && modalStarsRef.current) { // isModalOpen is no longer defined here
      const stars = modalStarsRef.current.children;
      gsap.to(stars, {
        opacity: [0.1, 0.5, 0.1],
        stagger: 0.1,
        repeat: -1,
        yoyo: true,
        duration: 4,
        ease: "sine.inOut",
      });
    }
    */
  }, [selectedZone]); // Adjust dependency if needed

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 }, // Adjusted initial animation
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut", delay: index * 0.05 }, // Staggered entry
    },
    exit: { // Exit animation for card (might not be used if modal overlays)
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeIn" },
    },
    hover: { scale: 1.03, transition: { duration: 0.15 } }, // Slightly more subtle hover
  };

  return (
    <motion.div
      className="rounded-xl overflow-hidden shadow-lg cursor-pointer" // Added cursor-pointer
      variants={cardVariants}
      initial="initial" // Will be animated by parent AnimatePresence if direct child, or by its own on mount
      animate="animate"
      exit="exit"
      layoutId={`zone-card-${name}`} // Unique layoutId for shared animation
      onClick={() => setSelectedZone(zone)} // Set selected zone on click
      whileHover="hover"
    >
      <div className="bg-gradient-to-br from-[#f48599]/80 to-[#f05672]/80 p-0.5 rounded-xl h-full"> {/* Ensure h-full for gradient border */}
        <motion.div
          className="bg-[#15112b]/95 backdrop-blur-md rounded-xl h-full flex flex-col" // Ensure h-full
          // Removed explicit whileHover for background color to simplify
        >
          <img
            src={zone.imageUrl} // Use zone.imageUrl
            alt={name}
            className="w-full h-40 object-cover rounded-t-xl" // Adjusted height
          />

          <div className="p-4 flex-grow"> {/* Adjusted padding */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-semibold text-[#f8b4c0]"> {/* Adjusted size */}
                {name.replace(/_/g, " ")}
              </h3>
              <div className="text-[#f48599]">{icon}</div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-[#f05672]/40 to-[#f8b4c0]/40 rounded-full mb-3"></div> {/* Adjusted thickness and margin */}

            <div className="flex-1 space-y-2 text-xs"> {/* Adjusted spacing and text size */}
              <div className="flex justify-between items-center">
                <span className="text-[#e6e6e6]/60">Module ID:</span>
                <span className="font-mono text-[#f8b4c0]/90">{moduleId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#e6e6e6]/60">Temperature:</span>
                <span className="font-mono">{temperature}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#e6e6e6]/60">Pressure:</span>
                <span className="font-mono">{pressure}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#e6e6e6]/60">Oxygen Level:</span>
                <span className="font-mono">{oxygenLevel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#e6e6e6]/60">Status:</span>
                <span className={`font-mono ${statusColor}`}>{status}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-[#f48599]/15 flex justify-between items-center p-4"> {/* Ensure button is at bottom */}
            <div className="flex items-center">
              <div
                className={`w-1.5 h-1.5 rounded-full ${ // Adjusted size
                  status === "Nominal" ? "bg-green-400" : "bg-yellow-400"
                } mr-1.5`}
              ></div>
              <span className="text-xs">{status} Report</span>
            </div>
            {/* The card itself is clickable, so this button might be redundant if card click opens modal */}
            {/* If keeping button, it should also call setSelectedZone(zone) */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click event
                setSelectedZone(zone);
              }}
              className="bg-gradient-to-r from-[#f05672]/90 to-[#f8b4c0]/90 text-white text-xs font-semibold py-1.5 px-3 rounded-full transition-opacity"
              whileHover={{ scale: 1.05, filter: "brightness(1.15)" }}
              whileTap={{ scale: 0.95 }}
            >
              Details
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ModalContent component, separate for clarity and AnimatePresence usage
function ModalContent({ zone, onClose }) {
  const modalStarsRef = useRef(null);

  useEffect(() => {
    if (modalStarsRef.current) {
      const stars = modalStarsRef.current.children;
      gsap.to(stars, {
        opacity: [0.05, 0.3, 0.05], // Even more subtle opacity
        stagger: 0.2, // Slightly slower stagger for a calmer effect
        repeat: -1,
        yoyo: true,
        duration: 4, // Slightly faster overall cycle
        ease: "sine.inOut",
      });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose} // Close when clicking backdrop
    >
      <motion.div
        layoutId={`zone-card-${zone.name}`} // Match layoutId with ZoneCard
        initial={{ scale: 0.9, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-gradient-to-br from-[#18142f] to-[#2e285e] rounded-xl max-w-3xl w-full shadow-2xl" // Adjusted max-width
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click through
      >
        <div className="bg-[#15112b]/90 rounded-xl p-1 relative overflow-hidden"> {/* Added p-1 for gradient border effect */}
          <div className="p-5 backdrop-blur-lg"> {/* Inner padding */}
            {/* Animated Stars Background */}
            <div ref={modalStarsRef} className="absolute inset-0 z-0 opacity-70"> {/* Overall opacity for stars container */}
              {Array.from({ length: 25 }).map((_, i) => ( // Reduced number of stars
                <div
                  key={i}
                  className="absolute rounded-full bg-white/70" // Stars are slightly transparent
                  style={{
                    width: `${Math.random() * 1.5 + 0.5}px`, // Smaller stars
                    height: `${Math.random() * 1.5 + 0.5}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`
                    // Removed CSS twinkle animation, GSAP will handle opacity changes
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#f48599] to-[#f8b4c0] bg-clip-text text-transparent">
                  {zone.name}
                </h2>
                <motion.button
                  onClick={onClose}
                  className="text-[#f48599] hover:text-[#f8b4c0] transition-colors p-1.5 rounded-full hover:bg-white/10"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Scrollable Content Area */}
              {/* Ensure ContainerDashboard itself can be constrained in height or provides scroll */}
              <div className="flex-1 overflow-y-auto max-h-[calc(80vh-100px)] pr-2"> {/* Example max-height, adjust as needed */}
                <ContainerDashboard zoneName={zone.name} zoneImgUrl={zone.imageUrl} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Removed the global CSS keyframes for twinkle

const SkeletonCard = () => (
  <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-[#f48599]/80 to-[#f05672]/80 p-0.5">
    <div className="bg-[#15112b]/95 backdrop-blur-md rounded-xl h-full flex flex-col animate-pulse">
      <div className="w-full h-40 bg-[#f8b4c0]/10 rounded-t-xl"></div> {/* Image placeholder */}
      <div className="p-4 flex-grow">
        <div className="h-4 bg-[#f8b4c0]/20 rounded w-3/4 mb-3"></div> {/* Title placeholder */}
        <div className="w-full h-px bg-gradient-to-r from-[#f05672]/30 to-[#f8b4c0]/30 rounded-full mb-3"></div>
        <div className="space-y-2 text-xs">
          <div className="h-3 bg-[#f8b4c0]/10 rounded w-5/6"></div>
          <div className="h-3 bg-[#f8b4c0]/10 rounded w-4/6"></div>
          <div className="h-3 bg-[#f8b4c0]/10 rounded w-5/6"></div>
          <div className="h-3 bg-[#f8b4c0]/10 rounded w-3/6"></div>
          <div className="h-3 bg-[#f8b4c0]/10 rounded w-4/6"></div>
        </div>
      </div>
      <div className="mt-auto pt-3 border-t border-[#f48599]/10 flex justify-between items-center p-4">
        <div className="h-4 bg-[#f8b4c0]/20 rounded w-1/4"></div>
        <div className="h-8 bg-[#f05672]/50 rounded-full w-1/3"></div> {/* Button placeholder */}
      </div>
    </div>
  </div>
);
