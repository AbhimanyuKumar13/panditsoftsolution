import styles from "./CourseSnapshot.module.css";

const CourseSnapshot = ({ course }) => {
  return (
    <section className={styles.snapshot}>
      <div className={styles.top}>
        <div className={styles.badges}>
          {course.trackGroup && <span className={styles.badge}>{course.trackGroup}</span>}
          {course.trackLabel && <span className={styles.softBadge}>{course.trackLabel}</span>}
        </div>

        <h1>{course.title}</h1>

        {course.summary && <p className={styles.summary}>{course.summary}</p>}
      </div>

      <ul>
        <li>
          <strong>Duration:</strong> {course.duration}
        </li>
        <li>
          <strong>Level:</strong> {course.level}
        </li>
        <li>
          <strong>Mode:</strong> {course.mode}
        </li>
        <li>
          <strong>Commitment:</strong> {course.commitment}
        </li>
        <li>
          <strong>Price:</strong> {course.price}
        </li>
      </ul>
    </section>
  );
};

export default CourseSnapshot;
