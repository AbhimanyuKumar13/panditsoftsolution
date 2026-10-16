import { useMemo, useState } from "react";
import {
  FiAward,
  FiBriefcase,
  FiCheckCircle,
  FiFileText,
  FiSearch,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import CourseCard from "../../../../components/Training/CourseCard/CourseCard";
import { useTrainingCourses } from "../../../../utils/useTrainingCourses.js";
import styles from "./Training.module.css";

const benefitItems = [
  {
    icon: <FiCheckCircle aria-hidden="true" />,
    title: "Build real projects",
    desc: "Turn lessons into practical work for your portfolio.",
  },
  {
    icon: <FiUsers aria-hidden="true" />,
    title: "Learn with mentors",
    desc: "Get guidance, feedback, and help when you get stuck.",
  },
  {
    icon: <FiAward aria-hidden="true" />,
    title: "Earn a certificate",
    desc: "Showcase your completed training and practical learning.",
  },
  {
    icon: <FiFileText aria-hidden="true" />,
    title: "Prepare for interviews",
    desc: "Present your projects and skills with more confidence.",
  },
  {
    icon: <FiBriefcase aria-hidden="true" />,
    title: "Practice industry workflows",
    desc: "Work through the steps used in real development projects.",
  },
  {
    icon: <FiTrendingUp aria-hidden="true" />,
    title: "Grow at your own pace",
    desc: "Choose a focused sprint or a deeper career track.",
  },
];

const groupMeta = [
  {
    key: "45 Days",
    title: "Focused Industrial Training",
    desc: "Build practical foundations and finish with guided project experience.",
    note: "Starts from INR 1,999",
  },
  {
    key: "6 Months",
    title: "Guided Career Tracks",
    desc: "Go deeper with structured learning, mentorship, and portfolio projects.",
    note: "Mentorship + live projects",
  },
];

const trackFilters = ["All programs", "45 Days", "6 Months"];

const Training = () => {
  const courses = useTrainingCourses();
  const [activeTrack, setActiveTrack] = useState("All programs");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesTrack =
        activeTrack === "All programs" || course.trackGroup === activeTrack;
      const searchableText = [
        course.title,
        course.summary,
        course.trackLabel,
        course.trackGroup,
        ...(course.skillsPreview || []),
      ]
        .join(" ")
        .toLowerCase();

      return matchesTrack && (!query || searchableText.includes(query));
    });
  }, [activeTrack, courses, searchTerm]);

  const groupedCourses = groupMeta
    .map((group) => ({
      ...group,
      courses: filteredCourses.filter((course) => course.trackGroup === group.key),
    }))
    .filter((group) => group.courses.length > 0);

  const getTrackCount = (track) =>
    track === "All programs"
      ? courses.length
      : courses.filter((course) => course.trackGroup === track).length;

  return (
    <section id="training-programs" className={styles.training}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.sectionEyebrow}>Find your learning path</div>
          <h2>Choose a program. Build something real.</h2>
          <p>
            Compare short, focused training with longer career tracks. Every
            program is designed around practical work, not just watching lessons.
          </p>
        </header>

        <div className={styles.catalogToolbar}>
          <div className={styles.filterGroup} role="group" aria-label="Filter programs by duration">
            {trackFilters.map((track) => (
              <button
                key={track}
                type="button"
                className={`${styles.filterButton} ${
                  activeTrack === track ? styles.filterButtonActive : ""
                }`}
                aria-pressed={activeTrack === track}
                onClick={() => setActiveTrack(track)}
              >
                {track}
                <span>{getTrackCount(track)}</span>
              </button>
            ))}
          </div>

          <label className={styles.searchBox}>
            <FiSearch aria-hidden="true" />
            <span className={styles.visuallyHidden}>Search programs and skills</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search a skill or program"
            />
            {searchTerm && (
              <button
                type="button"
                className={styles.clearSearch}
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </label>
        </div>

        <p className={styles.resultCount} aria-live="polite">
          Showing <strong>{filteredCourses.length}</strong>{" "}
          {filteredCourses.length === 1 ? "program" : "programs"}
          {searchTerm.trim() && <> for “{searchTerm.trim()}”</>}
        </p>

        {groupedCourses.length > 0 ? (
          groupedCourses.map((group) => (
            <section key={group.key} className={styles.groupSection}>
              <div className={styles.groupHeader}>
                <div className={styles.groupCopy}>
                  <span className={styles.groupBadge}>{group.key}</span>
                  <h3>{group.title}</h3>
                  <p>{group.desc}</p>
                </div>
                <div className={styles.groupAside}>
                  <span className={styles.courseCount}>
                    {group.courses.length}{" "}
                    {group.courses.length === 1 ? "program" : "programs"}
                  </span>
                  <strong>{group.note}</strong>
                </div>
              </div>

              <div className={styles.grid}>
                {group.courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>
              <FiSearch aria-hidden="true" />
            </span>
            <h3>No matching programs</h3>
            <p>Try another skill or clear your search to see all programs.</p>
            <button
              type="button"
              className={styles.resetButton}
              onClick={() => {
                setSearchTerm("");
                setActiveTrack("All programs");
              }}
            >
              Show all programs
            </button>
          </div>
        )}

        <section className={styles.whySection} aria-labelledby="why-skill-lab">
          <div className={styles.whyHeading}>
            <div className={styles.sectionEyebrow}>More than a certificate</div>
            <h2 id="why-skill-lab">Learn it. Build it. Be ready to show it.</h2>
          </div>
          <div className={styles.benefitsGrid}>
            {benefitItems.map(({ icon, title, desc }) => (
              <article key={title} className={styles.benefitCard}>
                <span className={styles.benefitIcon}>{icon}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default Training;
