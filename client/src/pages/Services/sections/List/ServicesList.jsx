import React from "react";
import { motion } from "framer-motion";
import styles from "./ServicesList.module.css";
import { services } from "../../../../data/Services/List.data";

const ServicesList = () => {
  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h2>What We Build</h2>
          <p>
            Clear service areas for businesses that need a website, web app,
            dashboard, or backend system.
          </p>
        </header>

        <div className={styles.grid}>
          {services.map((item, i) => (
            <motion.article
              key={item.title}
              className={styles.block}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <div className={styles.top}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>

              <ul className={styles.points}>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesList;
