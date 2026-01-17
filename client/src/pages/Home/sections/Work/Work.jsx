import React from "react";
import { motion } from "framer-motion";
import styles from "./Work.module.css";
import {projects} from "../../../../data/Home/Work.data"

const Work = () => {
  return (
    <section className={styles.section}>
      <h2>Featured Work</h2>

      <div className={styles.grid}>
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            className={styles.card}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <h3>{project.title}</h3>
            <p>{project.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Work;
