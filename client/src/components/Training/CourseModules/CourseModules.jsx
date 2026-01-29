import styles from "./CourseModules.module.css";

const CourseModules = ({ modules }) => {
  return (
    <section className={styles.modules}>
      <h2>What You Will Learn</h2>

      {modules.map((module, index) => (
        <div key={index} className={styles.module}>
          <h3>{module.title}</h3>
          <ul>
            {module.topics.map((topic, i) => (
              <li key={i}>{topic}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default CourseModules;
