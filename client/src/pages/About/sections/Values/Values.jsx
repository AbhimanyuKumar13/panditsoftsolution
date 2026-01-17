import React from "react";
import { motion } from "framer-motion";
import styles from "./Values.module.css";
import { values } from "../../../../data/About/Values.data";


const Values = () => {
  return (
    <section className={styles.section}>
      <h2>Our Values</h2>

      <div className={styles.grid}>
        {values.map((item, i) => (
          <motion.div
            key={item.title}
            className={styles.card}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Values;
