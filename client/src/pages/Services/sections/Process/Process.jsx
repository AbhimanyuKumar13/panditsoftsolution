import React from "react";
import { motion } from "framer-motion";
import styles from "./Process.module.css";
import { steps } from "../../../../data/Services/Process.data";

const Process = () => {
  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <span className={styles.kicker}>Delivery Process</span>
          <h2>Clear milestones make the build easy to follow.</h2>
          <p>
            Simple steps help clients review progress and give feedback on time.
          </p>
        </header>

        <div className={styles.path}>
          {steps.map((step, i) => (
            <motion.article
              key={step.title}
              className={styles.node}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <div className={styles.marker}>
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className={styles.content}>
                <span className={styles.focus}>{step.focus}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
