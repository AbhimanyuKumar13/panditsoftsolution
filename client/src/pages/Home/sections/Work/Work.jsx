import React from "react";
import { motion } from "framer-motion";
import styles from "./Work.module.css";
import { projects } from "../../../../data/Home/Work.data";

const Work = () => {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2>Featured Work</h2>
        <p>
          A glimpse into the kind of digital products we build for real
          businesses.
        </p>
      </header>

      <div className={styles.scroller}>
        {projects.map((project, i) => (
          <motion.article
            key={project.title}
            className={styles.card}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <span className={styles.type}>{project.type}</span>

            <h3>{project.title}</h3>
            <p>{project.desc}</p>

            <div className={styles.tags}>
              <span>{project.stack}</span>
              <span>{project.audience}</span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default Work;
