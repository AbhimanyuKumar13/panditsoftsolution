import React from "react";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiGlobe,
  FiLayout,
  FiMonitor,
  FiServer,
  FiShoppingBag,
} from "react-icons/fi";
import styles from "./ServicesList.module.css";
import { services } from "../../../../data/Services/List.data";

const iconMap = {
  "Business Websites": FiGlobe,
  "Custom Web Applications": FiMonitor,
  "E-commerce Stores": FiShoppingBag,
  "Frontend Development": FiLayout,
  "Backend & API Development": FiServer,
  "Maintenance & Feature Support": FiActivity,
};

const ServicesList = () => {
  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <span className={styles.kicker}>Service Areas</span>
          <h2>Choose the right build for your business.</h2>
          <p>
            From websites to dashboards and support, each service is built around
            clear deliverables.
          </p>
        </header>

        <div className={styles.grid}>
          {services.map((item, i) => (
            <motion.div
              key={item.title}
              className={styles.cardShell}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.06, duration: 0.42 }}
            >
              <article className={styles.block}>
                <div className={styles.top}>
                  <div className={styles.meta}>
                    <span className={styles.iconWrap}>
                      {React.createElement(iconMap[item.title], { "aria-hidden": true })}
                    </span>
                    <span className={styles.tag}>{item.tag}</span>
                  </div>

                  <div className={styles.copy}>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>

                <ul className={styles.points}>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>

                <div className={styles.bottom}>
                  <div className={styles.detail}>
                    <span>Best for</span>
                    <strong>{item.bestFor}</strong>
                  </div>
                  <div className={styles.detail}>
                    <span>Outcome</span>
                    <strong>{item.result}</strong>
                  </div>
                </div>
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesList;
