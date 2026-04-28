import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiChevronDown,
  FiClock,
  FiMessageSquare,
  FiShield,
} from "react-icons/fi";
import styles from "./FAQ.module.css";
import { faqs } from "../../data/FAQ/FAQ.data";

const helperPoints = [
  {
    icon: FiClock,
    title: "Clear timelines",
    text: "Quick answers on scope, speed, and revisions.",
  },
  {
    icon: FiMessageSquare,
    title: "Clear communication",
    text: "Easy to understand, even if you are not technical.",
  },
  {
    icon: FiShield,
    title: "Support and trust",
    text: "Security, maintenance, and support are covered clearly.",
  },
];

const topicChips = [
  "Pricing clarity",
  "Responsive builds",
  "Support after launch",
  "Security practices",
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <div className={styles.layout}>
          <div className={styles.infoPanel}>
            <header className={styles.header}>
              <span className={styles.kicker}>FAQ</span>
              <h2>Quick answers before you start.</h2>
              <p className={styles.subtext}>
                Fast answers on pricing, timelines, support, and delivery.
              </p>
            </header>

            <div className={styles.topicRow}>
              {topicChips.map((item) => (
                <span key={item} className={styles.topicChip}>
                  {item}
                </span>
              ))}
            </div>

            <div className={styles.helperGrid}>
              {helperPoints.map(({ icon: Icon, title, text }) => (
                <div key={title} className={styles.helperCard}>
                  <span className={styles.helperIcon}>
                    <Icon aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.contactCard}>
              <span className={styles.contactLabel}>Need a direct answer?</span>
              <p>
                If your question is specific, we can review your scope and next steps.
              </p>
              <Link className={styles.contactLink} to="/Contact">
                Talk to us
                <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className={styles.list}>
            {faqs.map((item, i) => {
              const isOpen = openIndex === i;

              return (
                <motion.div
                  key={item.q}
                  className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.38, delay: i * 0.04 }}
                >
                  <button
                    className={styles.question}
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                  >
                    <div className={styles.questionLeft}>
                      <span className={styles.index}>
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <div className={styles.questionCopy}>
                        <span className={styles.tag}>{item.tag}</span>
                        <span className={styles.qText}>{item.q}</span>
                      </div>
                    </div>

                    <span className={styles.iconWrap} aria-hidden>
                      <FiChevronDown
                        className={`${styles.icon} ${isOpen ? styles.open : ""}`}
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-${i}`}
                        className={styles.answer}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        <div className={styles.answerInner}>
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
