import courses from "../../../../data/Training/trainingCourses.json"; 
import CourseCard from "../../../../components/Training/CourseCard/CourseCard";
import styles from "./Training.module.css";

const Training = () => {
  return (
    <section className={styles.training}>
      <header className={styles.header}>
        <h1>PSS Training Programs</h1>
        <p>
          Industry-focused training built by developers who work on real
          systems.
        </p>
      </header>

      <div className={styles.grid}>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
};

export default Training;
