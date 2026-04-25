import React from "react";
import { motion } from "framer-motion";
import styles from "./Process.module.css";
import { steps } from "../../../../data/Services/Process.data";

const Process = () => {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2>How We Deliver</h2>
        <p>
          Straight steps from scope to launch so the project stays clear and
          easy to track.
        </p>
      </header>

      <div className={styles.path}>
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
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
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Process;
