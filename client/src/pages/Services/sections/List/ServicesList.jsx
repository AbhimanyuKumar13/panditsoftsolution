import React from "react";
import { motion } from "framer-motion";
import styles from "./ServicesList.module.css";
import { services } from "../../../../data/Services/List.data";

const ServicesList = () => {
  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        {services.map((item, i) => (
          <motion.article
            key={item.title}
            className={styles.block}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default ServicesList;
