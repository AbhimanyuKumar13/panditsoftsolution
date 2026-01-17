import React from "react";
import { motion } from "framer-motion";
import styles from "./WhyUs.module.css";
import { points } from "../../../../data/Home/Whyus.data";

const WhyUs = () => {
  return (
    <section className={styles.section}>
      <h2>Why Choose Us</h2>

      <div className={styles.grid}>
        {points.map((item, i) => (
          <motion.div
            key={item.title}
            className={styles.item}
            initial={{ opacity: 0, y: 18 }}
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

export default WhyUs;
