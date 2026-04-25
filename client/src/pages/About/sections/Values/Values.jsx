import React from "react";
import { motion } from "framer-motion";
import styles from "./Values.module.css";
import { values } from "../../../../data/About/Values.data";

const Values = () => {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2>What We Stand For</h2>
        <p>
          The principles that shape every decision we make — from architecture
          choices to client conversations.
        </p>
      </header>

      <div className={styles.stack}>
        {values.map((item, i) => (
          <motion.article
            key={item.title}
            className={styles.block}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <span className={styles.index}>
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className={styles.content}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default Values;