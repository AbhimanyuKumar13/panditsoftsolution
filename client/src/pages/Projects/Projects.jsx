import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Projects.module.css";
import { points } from "../../data/Projects/Approach.data";
import { projects } from "../../data/Projects/List.data";

const ExternalIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const ChevronLeft = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ScreenshotsCarousel = ({ screenshots, title }) => {
  const [active, setActive] = useState(0);

  if (!screenshots || screenshots.length === 0) {
    return (
      <div className={styles.projectsListScreenshotPlaceholder}>
        <span>Screenshots coming soon</span>
      </div>
    );
  }

  const prev = () =>
    setActive((a) => (a - 1 + screenshots.length) % screenshots.length);
  const next = () => setActive((a) => (a + 1) % screenshots.length);

  return (
    <div className={styles.projectsListCarousel}>
      <div className={styles.projectsListCarouselTrack}>
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={screenshots[active]}
            alt={`${title} screenshot ${active + 1}`}
            className={styles.projectsListScreenshot}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28 }}
          />
        </AnimatePresence>
      </div>

      {screenshots.length > 1 && (
        <div className={styles.projectsListCarouselControls}>
          <button
            className={styles.projectsListNavBtn}
            onClick={prev}
            aria-label="Previous screenshot"
          >
            <ChevronLeft />
          </button>
          <span className={styles.projectsListCounter}>
            {active + 1} / {screenshots.length}
          </span>
          <button
            className={styles.projectsListNavBtn}
            onClick={next}
            aria-label="Next screenshot"
          >
            <ChevronRight />
          </button>
        </div>
      )}

      {screenshots.length > 1 && (
        <div className={styles.projectsListDots}>
          {screenshots.map((_, i) => (
            <button
              key={i}
              className={`${styles.projectsListDot} ${
                i === active ? styles.projectsListDotActive : ""
              }`}
              onClick={() => setActive(i)}
              aria-label={`Go to screenshot ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FILTERS = ["All", "Client Project", "Company Product"];

const Projects = () => {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <section className={styles.projectsHero}>
        <motion.div
          className={styles.projectsHeroContent}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <h1>Our Projects</h1>
          <p>
            A selection of work that reflects our focus on quality,
            performance, and real business needs.
          </p>
        </motion.div>
      </section>

      <section className={styles.projectsListSection}>
        <div className={styles.projectsListFilters}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`${styles.projectsListFilterBtn} ${
                filter === f ? styles.projectsListFilterActive : ""
              }`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className={styles.projectsListList}>
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              className={styles.projectsListCard}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className={styles.projectsListCardHeader}>
                <div className={styles.projectsListMeta}>
                  <span className={styles.projectsListCategoryBadge}>
                    {project.category}
                  </span>
                  <span className={styles.projectsListTagBadge}>
                    {project.tag}
                  </span>
                </div>
                <span
                  className={`${styles.projectsListStatus} ${
                    project.status === "Live"
                      ? styles.projectsListStatusLive
                      : styles.projectsListStatusRunning
                  }`}
                >
                  <span className={styles.projectsListStatusDot} />
                  {project.status}
                </span>
              </div>

              <h3 className={styles.projectsListTitle}>{project.title}</h3>

              <ScreenshotsCarousel
                screenshots={project.screenshots}
                title={project.title}
              />

              <div className={styles.projectsListDetails}>
                <div className={styles.projectsListBlock}>
                  <strong>Problem</strong>
                  <p>{project.problem}</p>
                </div>
                <div className={styles.projectsListBlock}>
                  <strong>Solution</strong>
                  <p>{project.solution}</p>
                </div>
                <div className={styles.projectsListBlock}>
                  <strong>Outcome</strong>
                  <p>{project.result}</p>
                </div>
                <div className={styles.projectsListBlock}>
                  <strong>Client / Origin</strong>
                  <p>{project.location}</p>
                </div>
              </div>

              {project.link && (
                <div className={styles.projectsListCardFooter}>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.projectsListVisitLink}
                  >
                    Visit Project <ExternalIcon />
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.projectsApproachSection}>
        <header className={styles.projectsApproachHeader}>
          <h2>Our Approach</h2>
          <p>
            A clear, structured process we follow to deliver reliable results.
          </p>
        </header>

        <div className={styles.projectsApproachFlow}>
          {points.map((text, i) => (
            <motion.div
              key={i}
              className={styles.projectsApproachStep}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <div className={styles.projectsApproachMarker}>
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className={styles.projectsApproachContent}>
                <p>{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.projectsCtaSection}>
        <motion.div
          className={styles.projectsCtaInner}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2>Want to see your project here?</h2>
          <p>
            Let&apos;s discuss how we can turn your idea into a reliable
            product.
          </p>
          <Link to="/contact" className={styles.projectsCtaButton}>
            Start a Project
          </Link>
        </motion.div>
      </section>
    </>
  );
};

export default Projects;
