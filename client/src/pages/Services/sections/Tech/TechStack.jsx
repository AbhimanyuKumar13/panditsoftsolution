import React from "react";
import styles from "./TechStack.module.css";
import { tech } from "../../../../data/Services/Tech.data";

const TechStack = () => {
  return (
    <section className={styles.section}>
      <h2>Technology Stack</h2>
      <div className={styles.list}>
        {tech.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
