import React from "react";
import styles from "./TechStack.module.css";
import { tech } from "../../../../data/Services/Tech.data";

const TechStack = () => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>Common Stack</h2>
        <p>Core technologies we regularly use for websites, web apps, and APIs.</p>
      </div>

      <div className={styles.list}>
        {tech.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
