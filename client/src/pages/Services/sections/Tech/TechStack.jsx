import React from "react";
import { FiCheckCircle } from "react-icons/fi";
import styles from "./TechStack.module.css";
import { techGroups } from "../../../../data/Services/Tech.data";

const TechStack = () => {
  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <span className={styles.kicker}>Technology Choices</span>
          <h2>The stack should support the product.</h2>
          <p>
            We choose tools based on the build, the logic, and ongoing support needs.
          </p>
        </div>

        <div className={styles.list}>
          {techGroups.map((group) => (
            <article key={group.title} className={styles.group}>
              <div className={styles.groupHeader}>
                <h3>{group.title}</h3>
                <p>{group.desc}</p>
              </div>

              <ul className={styles.items}>
                {group.items.map((item) => (
                  <li key={item}>
                    <FiCheckCircle aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
