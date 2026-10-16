import { useCallback, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import styles from "./FAQ.module.css";
import { faqs } from "../../data/FAQ/FAQ.data";
import { useLiveContentRefresh } from "../../utils/liveContent.js";

const apiBase = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, "");
const initialFAQs = faqs.map((item, index) => ({
  id: `faq-${index + 1}`,
  question: item.q,
  answer: Array.isArray(item.a) ? item.a : [item.a],
}));

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [items, setItems] = useState(initialFAQs);

  const refreshFAQs = useCallback(async () => {
    const response = await fetch(`${apiBase || ""}/api/faqs`, {
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Unable to load FAQs.");
    }
    if (!Array.isArray(data.faqs)) {
      throw new Error("The FAQ response was invalid.");
    }
    setItems(data.faqs);
  }, []);

  useLiveContentRefresh("faqs", refreshFAQs);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <h2>Frequently Asked Questions</h2>
          <p className={styles.subtext}>
            Common questions clients ask before starting a project.
          </p>
        </header>

        <div className={styles.list}>
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            const answer = Array.isArray(item.answer)
              ? item.answer
              : [item.answer];

            return (
              <div
                key={item.id}
                className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
              >
                <button
                  className={styles.question}
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  id={`faq-btn-${item.id}`}
                  aria-controls={`faq-${item.id}`}
                >
                  <span className={styles.index}>
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className={styles.qText}>{item.question || item.q}</span>

                  <span className={styles.iconWrap} aria-hidden>
                    <FiChevronDown
                      className={`${styles.icon} ${isOpen ? styles.open : ""}`}
                    />
                  </span>
                </button>

                <div
                  id={`faq-${item.id}`}
                  className={styles.answer}
                  role="region"
                  aria-labelledby={`faq-btn-${item.id}`}
                >
                  <div className={styles.answerInner}>
                    <div className={styles.answerContent}>
                      {answer.length > 1 ? (
                        <ul className={styles.answerList}>
                          {answer.map((point, index) => (
                            <li key={`${item.id}-${index}`}>{point}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{answer[0]}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
