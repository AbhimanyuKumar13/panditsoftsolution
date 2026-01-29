import React from "react";
import { motion } from "framer-motion";
import styles from "./Approach.module.css";
import { points } from "../../../../data/Projects/Approach.data";

const Approach = () => {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2>Our Approach</h2>
        <p>
          A clear, structured process we follow to deliver reliable results.
        </p>
      </header>

      <div className={styles.flow}>
        {points.map((text, i) => (
          <motion.div
            key={i}
            className={styles.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <div className={styles.marker}>
              {String(i + 1).padStart(2, "0")}
            </div>

            <div className={styles.content}>
              <p>{text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Approach;
