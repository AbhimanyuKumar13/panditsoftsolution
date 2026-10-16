import { FiArrowUpRight, FiClock, FiMonitor, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "./CourseCard.module.css";

const CourseCard = ({ course }) => {
  const details = [
    { icon: <FiClock aria-hidden="true" />, label: "Duration", value: course.duration },
    { icon: <FiTrendingUp aria-hidden="true" />, label: "Level", value: course.level },
    { icon: <FiMonitor aria-hidden="true" />, label: "Learning mode", value: course.mode },
  ];

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.badges}>
          {course.trackGroup && (
            <span
              className={`${styles.badge} ${
                course.trackGroup === "45 Days" ? styles.badgeShort : styles.badgeLong
              }`}
            >
              {course.trackGroup}
            </span>
          )}
          {course.trackLabel && <span className={styles.softBadge}>{course.trackLabel}</span>}
        </div>
        <span className={styles.price}>{course.price}</span>
      </div>

      <h3>{course.title}</h3>
      <p className={styles.summary}>
        {course.summary || "Hands-on learning with project-based practice."}
      </p>

      {course.skillsPreview?.length > 0 && (
        <div className={styles.skills} aria-label="Skills covered">
          {course.skillsPreview.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      )}

      <dl className={styles.meta}>
        {details.map(({ icon, label, value }) => (
          <div className={styles.metaItem} key={label}>
            <dt>
              {icon}
              {label}
            </dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <Link to={`/skill-lab/${course.slug}`} className={styles.button}>
        View course details
        <FiArrowUpRight aria-hidden="true" />
      </Link>
    </article>
  );
};

export default CourseCard;
