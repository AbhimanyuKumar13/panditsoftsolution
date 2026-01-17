import React from "react";
import { motion } from "framer-motion";
import styles from "./ProjectsList.module.css";
import { projects } from "../../../../data/Projects/List.data";


const ProjectsList = () => {
  return (
    <section className={styles.section}>
      <div className={styles.list}>
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

            <div className={styles.block}>
              <strong>Problem</strong>
              <p>{project.problem}</p>
            </div>

            <div className={styles.block}>
              <strong>Solution</strong>
              <p>{project.solution}</p>
            </div>

            <div className={styles.block}>
              <strong>Outcome</strong>
              <p>{project.result}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsList;
