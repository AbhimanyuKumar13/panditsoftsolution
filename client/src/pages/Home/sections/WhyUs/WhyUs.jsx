import React from "react";
import { motion } from "framer-motion";
import styles from "./WhyUs.module.css";
import { points } from "../../../../data/Home/Whyus.data";

const WhyUs = () => {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2>Why Choose Us</h2>
        <p>
          Principles that guide how we design, build, and deliver software.
        </p>
      </header>

      <div className={styles.scroller}>
        {points.map((item, i) => (
          <motion.article
            key={item.title}
            className={styles.card}
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <span className={styles.index}>
              {String(i + 1).padStart(2, "0")}
            </span>

            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default WhyUs;
