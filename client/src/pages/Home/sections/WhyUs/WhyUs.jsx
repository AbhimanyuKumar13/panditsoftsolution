import React from "react";
import { motion } from "framer-motion";
import styles from "./WhyUs.module.css";
import { points } from "../../../../data/Home/Whyus.data";

const WhyUs = () => {
  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h2>Why Choose Us</h2> 
        </header>

        <div className={styles.timeline}>
          {points.map((item, i) => (
            <motion.div
              key={item.title}
              className={styles.item}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            > 

              {/* CARD */}
              <div className={styles.card}>
                <div className={styles.inner}>
                  <div className={styles.imageWrapper}>
                    <img src={item.image} alt={item.title} />
                  </div>

                  <div className={styles.content}> 

                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
