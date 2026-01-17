import React from "react";
import { motion } from "framer-motion";
import styles from "./Process.module.css";
import { steps } from "../../../../data/Services/Process.data";


const Process = () => {
  return (
    <section className={styles.section}>
      <h2>How We Work</h2>

      <div className={styles.steps}>
        {steps.map((step, i) => (
          <motion.div
            key={step}
            className={styles.step}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <span>{i + 1}</span>
            <p>{step}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Process;
