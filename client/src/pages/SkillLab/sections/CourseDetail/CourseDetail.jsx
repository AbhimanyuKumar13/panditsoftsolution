import { useParams } from "react-router-dom";
import courses from "../../../../data/Training/trainingCourses.json";
import CourseSnapshot from "../../../../components/Training/CourseSnapshot/CourseSnapshot";
import CourseModules from "../../../../components/Training/CourseModules/CourseModules";
import CourseCTA from "../../../../components/Training/CourseCTA/CourseCTA";
import styles from "./CourseDetail.module.css";

const CourseDetail = () => {
  const { slug } = useParams();
  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    return <p>Course not found.</p>;
  }

  return (
    <article className={styles.course}>
      <CourseSnapshot course={course} />

      <section className={styles.section}>
        <h2>Who This Course Is For</h2>
        <ul>
          {course.audience.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Not Suitable For</h2>
        <ul>
          {course.notFor.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <CourseModules modules={course.modules} />

      <section className={styles.section}>
        <h2>What You Will Build</h2>
        <ul>
          {course.projects.map((project, i) => (
            <li key={i}>{project}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>How We Teach</h2>
        <ul>
          {course.teachingMethod.map((method, i) => (
            <li key={i}>{method}</li>
          ))}
        </ul>
      </section>

      <CourseCTA courseTitle={course.title} />
    </article>
  );
};

export default CourseDetail;
