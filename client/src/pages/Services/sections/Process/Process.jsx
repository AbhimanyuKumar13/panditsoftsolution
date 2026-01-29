import React from "react";
import { motion } from "framer-motion";
import styles from "./Process.module.css";
import { steps } from "../../../../data/Services/Process.data";

const Process = () => {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2>How We Work</h2>
        <p>
          A structured, repeatable process that keeps projects predictable and
          transparent.
        </p>
      </header>

      <div className={styles.path}>
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className={styles.node}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <div className={styles.marker}>
              {String(i + 1).padStart(2, "0")}
            </div>

            <div className={styles.content}>
              <p>{step}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Process;
