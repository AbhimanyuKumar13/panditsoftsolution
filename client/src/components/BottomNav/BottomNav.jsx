import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiLayers, FiBriefcase, FiUser, FiTool } from "react-icons/fi"; 
import styles from "./BottomNav.module.css";

const BottomNav = () => {
  return (
    <motion.nav
      className={styles.bottomNav}
      initial={{ y: 60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <NavLink to="/" end>
        <FiHome />
        <span>Home</span>
      </NavLink>

      <NavLink to="/ourServices">
        <FiLayers />
        <span>Services</span>
      </NavLink>

      <NavLink to="/projects">
        <FiBriefcase />
        <span>Work</span>
      </NavLink>

      <NavLink to="/skill-lab">
        <FiTool />
        <span>Skill Lab</span>
      </NavLink>
      <NavLink to="/about">
        <FiUser />
        <span>About</span>
      </NavLink>
    </motion.nav>
  );
};

export default BottomNav;
