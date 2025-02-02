import React, { useState, useEffect } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateCursorPosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    window.addEventListener("mousemove", updateCursorPosition);
    window.addEventListener("resize", handleResize);

    handleResize(); // Set initial mobile state

    return () => {
      window.removeEventListener("mousemove", updateCursorPosition);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const cursorStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
    zIndex: 9999,
    transition:
      "transform 0.1s ease, width 0.1s ease, height 0.1s ease, background-color 0.1s ease",
  };

  // Render cursor only if not on a mobile device
  if (isMobile) {
    return null;
  }

  return (
    <div style={{ ...cursorStyle, left: position.x, top: position.y }}></div>
  );
};

export default CustomCursor;
