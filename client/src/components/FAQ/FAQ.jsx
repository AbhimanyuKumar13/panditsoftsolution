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
      <h2>Frequently Asked Questions</h2>

      <div className={styles.list}>
        {faqs.map((item, i) => (
          <div key={i} className={styles.item}>
            <button
              className={styles.question}
              onClick={() => toggle(i)}
              aria-expanded={openIndex === i}
            >
              <span>{item.q}</span>
              <span
                className={`${styles.icon} ${
                  openIndex === i ? styles.open : ""
                }`}
              >
                +
              </span>
            </button>

            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  className={styles.answer}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <p>{item.a}</p>
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
