import React from "react";
import { motion } from "framer-motion";
import styles from "./Approach.module.css";
import { points } from "../../../../data/Projects/Approach.data";

const Approach = () => {
  return (
    <section className={styles.section}>
      <h2>Our Approach</h2>

      <div className={styles.points}>
        {points.map((text, i) => (
          <motion.div
            key={text}
            className={styles.point}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            {text}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Approach;
