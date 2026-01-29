import styles from "./CourseSnapshot.module.css";

const CourseSnapshot = ({ course }) => {
  return (
    <section className={styles.snapshot}>
      <h1>{course.title}</h1>

      <ul>
        <li><strong>Duration:</strong> {course.duration}</li>
        <li><strong>Level:</strong> {course.level}</li>
        <li><strong>Mode:</strong> {course.mode}</li>
        <li><strong>Commitment:</strong> {course.commitment}</li>
        <li><strong>Price:</strong> {course.price}</li>
      </ul>
    </section>
  );
};

export default CourseSnapshot;
