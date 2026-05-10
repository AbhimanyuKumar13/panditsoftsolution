import { useState } from "react";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import styles from "./FAQ.module.css";
import { faqs } from "../../data/FAQ/FAQ.data";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <header className={styles.header}> 
          <h2>FAQ - Frequently asked questions.</h2>
          <p className={styles.subtext}>
            Clear answers about scope, timelines, pricing, and support.
          </p>
        </header>

        <div className={styles.list}>
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={item.q}
                className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <button
                  className={styles.question}
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                >
                  <span className={styles.index}>
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className={styles.qText}>{item.q}</span>

                  <span className={styles.iconWrap} aria-hidden>
                    <FiChevronDown
                      className={`${styles.icon} ${isOpen ? styles.open : ""}`}
                    />
                  </span>
                </button>

                <div
                  id={`faq-${i}`}
                  className={styles.answer}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                >
                  <div className={styles.answerInner}>
                    <div className={styles.answerContent}>
                      {Array.isArray(item.a) ? (
                        <ul className={styles.answerList}>
                          {item.a.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{item.a}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;