import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./FAQ.module.css";
import { faqs } from "../../data/FAQ/FAQ.data";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2>Frequently Asked Questions</h2>
        <p className={styles.subtext}>
          Clear answers to common questions about our process, pricing, and support.
        </p>
      </header>

      <div className={styles.list}>
        {faqs.map((item, i) => (
          <div key={i} className={styles.item}>
            <button
              className={styles.question}
              onClick={() => toggle(i)}
              aria-expanded={openIndex === i}
              aria-controls={`faq-${i}`}
            >
              <span className={styles.qText}>{item.q}</span>
              <span
                className={`${styles.icon} ${
                  openIndex === i ? styles.open : ""
                }`}
                aria-hidden
              >
                +
              </span>
            </button>

            <AnimatePresence initial={false}>
              {openIndex === i && (
                <motion.div
                  id={`faq-${i}`}
                  className={styles.answer}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {Array.isArray(item.a) ? (
                    <ul>
                      {item.a.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{item.a}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
