import { Link } from "react-router-dom";
import styles from "./CourseCard.module.css";

const CourseCard = ({ course }) => {
  return (
    <div className={styles.card}>
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
        {course.trackLabel && (
          <span className={styles.softBadge}>{course.trackLabel}</span>
        )}
      </div>

      <h3>{course.title}</h3>

      <p className={styles.summary}>
        {course.summary || "Hands-on learning with project-based practice"}
      </p>

      <div className={styles.meta}>
        <div>
          <span>Duration</span>
          <strong>{course.duration}</strong>
        </div>
        <div>
          <span>Level</span>
          <strong>{course.level}</strong>
        </div>
        <div>
          <span>Mode</span>
          <strong>{course.mode}</strong>
        </div>
        <div>
          <span>Fees</span>
          <strong>{course.price}</strong>
        </div>
      </div>

      {course.skillsPreview?.length > 0 && (
        <div className={styles.skills}>
          {course.skillsPreview.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      )}

      <p className={styles.outcome}>Hands-on learning with project-based practice</p>

      <Link to={`/skill-lab/${course.slug}`} className={styles.button}>
        View Details
      </Link>
    </div>
  );
};

export default CourseCard;
