import React from "react";
import { motion } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";
import "./ThemeToggle.css";

const ThemeToggle = ({ theme, toggleTheme }) => {
  const isDark = theme === "dark";

  return (
    <div className="toggle-switch" data-theme={theme} onClick={toggleTheme}>
      <motion.div
        className="toggle-handle"
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
      >
        {isDark ? <FaMoon /> : <FaSun />}
      </motion.div>
    </div>
  );
};

export default ThemeToggle;
