import { Link } from "react-router-dom";
import styles from "./CourseCard.module.css";

const CourseCard = ({ course }) => {
  return (
    <div className={styles.card}>
      <h3>{course.title}</h3>
      <p><strong>Duration:</strong> {course.duration}</p>
      <p><strong>Level:</strong> {course.level}</p>
      <p className={styles.outcome}>
        Build real-world, production-ready applications
      </p>

      <Link to={`/skill-lab/${course.slug}`} className={styles.button}>
        View Details
      </Link>
    </div>
  );
};

export default CourseCard;
