import React from "react";
import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import styles from "./ThemeToggle.module.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      whileTap={{ scale: 0.9 }}
    >
      {theme === "dark" ? <FiSun /> : <FiMoon />}
    </motion.button>
  );
};

export default ThemeToggle;
