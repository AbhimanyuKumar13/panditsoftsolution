import React from "react";
import { motion } from "framer-motion";
import styles from "./Services.module.css";
import { data } from "../../../../data/Home/Services.data";

const Services = () => {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2>What We Do</h2>
        <p>
          Focused services designed to help businesses build reliable digital
          products.
        </p>
      </header>

      <div className={styles.rail}>
        {data.map((item, i) => (
          <motion.div
            key={item.title}
            className={styles.row}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <div className={styles.marker}>
              <span>{String(i + 1).padStart(2, "0")}</span>
            </div>

            <div className={styles.content}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Services;
