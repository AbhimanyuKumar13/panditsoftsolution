import React from "react";
import { motion } from "framer-motion";
import styles from "./ProjectsHero.module.css";

const ProjectsHero = () => {
  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <h1>Our Projects</h1>
        <p>
          A selection of work that reflects our focus on quality, performance,
          and real business needs.
        </p>
      </motion.div>
    </section>
  );
};

export default ProjectsHero;
