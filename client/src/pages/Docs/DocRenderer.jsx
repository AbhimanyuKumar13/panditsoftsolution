import styles from "./DocRenderer.module.css";

const DocRenderer = ({ doc }) => {
  return (
    <article className={styles.doc}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1>{doc.title}</h1>
          <span className={styles.updated}>
            Last updated: {doc.updated}
          </span>
        </div>
      </header>

      {/* Body */}
      <div className={styles.body}>
        {doc.sections.map((section, index) => (
          <section key={index} className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.index}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2>{section.heading}</h2>
            </div>

            <div className={styles.content}>
              {section.content.map((item, i) => (
                <p key={i}>{item}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
};

export default DocRenderer;
