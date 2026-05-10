import {
  FiAward,
  FiBriefcase,
  FiCheckCircle,
  FiFileText,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import courses from "../../../../data/Training/trainingCourses.json";
import CourseCard from "../../../../components/Training/CourseCard/CourseCard";
import styles from "./Training.module.css";

const benefitItems = [
  {
    icon: FiCheckCircle,
    title: "Live projects & practical training",
    desc: "Hands-on sessions designed around real implementation work.",
  },
  {
    icon: FiUsers,
    title: "Expert mentor guidance",
    desc: "Regular feedback, review, and doubt support from working mentors.",
  },
  {
    icon: FiAward,
    title: "Certificate of completion",
    desc: "Useful for training records, resumes, and internship submissions.",
  },
  {
    icon: FiFileText,
    title: "Resume & interview prep",
    desc: "Better presentation of projects, skills, and placement readiness.",
  },
  {
    icon: FiBriefcase,
    title: "Industry-focused approach",
    desc: "Job-oriented learning instead of only theory or passive watching.",
  },
  {
    icon: FiTrendingUp,
    title: "Career growth support",
    desc: "Build stronger confidence for internships, placements, and projects.",
  },
];

const groupMeta = [
  {
    key: "45 Days",
    title: "45 Days Industrial Training",
    desc: "Summer-focused practical batches for college students who want faster learning, guided projects, and industry-style exposure.",
    note: "Starts from INR 1,999",
  },
  {
    key: "6 Months",
    title: "6 Months Career Tracks",
    desc: "Longer guided programs for students who want deeper learning, better portfolio depth, and stronger placement preparation.",
    note: "Mentorship + live projects",
  },
];

const Training = () => {
  const groupedCourses = groupMeta
    .map((group) => ({
      ...group,
      courses: courses.filter((course) => course.trackGroup === group.key),
    }))
    .filter((group) => group.courses.length > 0);

  return (
    <section id="training-programs" className={styles.training}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <span className={styles.kicker}>Training Programs</span>
          <h2>Choose the pace that fits your goal.</h2>
          <p>
            Start with 45-day summer industrial training or go deeper with
            6-month guided career tracks built for stronger outcomes.
          </p>
        </header>

        <div className={styles.benefitsGrid}>
          {benefitItems.map(({ icon: Icon, title, desc }) => (
            <article key={title} className={styles.benefitCard}>
              <span className={styles.benefitIcon}>
                <Icon size={18} aria-hidden="true" />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </article>
          ))}
        </div>

        {groupedCourses.map((group) => (
          <section key={group.key} className={styles.groupSection}>
            <div className={styles.groupHeader}>
              <div>
                <span className={styles.groupBadge}>{group.key}</span>
                <h3>{group.title}</h3>
                <p>{group.desc}</p>
              </div>

              <div className={styles.groupNote}>
                <span>{group.note}</span>
              </div>
            </div>

            <div className={styles.grid}>
              {group.courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
};

export default Training;
