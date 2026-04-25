import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ProjectsList.module.css";
import { projects } from "../../../../data/Projects/List.data";

const ExternalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ── Screenshots Carousel ─────────────────────────────────────
const ScreenshotsCarousel = ({ screenshots, title }) => {
  const [active, setActive] = useState(0);

  if (!screenshots || screenshots.length === 0) {
    return (
      <div className={styles.screenshotPlaceholder}>
        <span>Screenshots coming soon</span>
      </div>
    );
  }

  const prev = () => setActive((a) => (a - 1 + screenshots.length) % screenshots.length);
  const next = () => setActive((a) => (a + 1) % screenshots.length);

  return (
    <div className={styles.carousel}>
      <div className={styles.carouselTrack}>
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={screenshots[active]}
            alt={`${title} screenshot ${active + 1}`}
            className={styles.screenshot}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28 }}
          />
        </AnimatePresence>
      </div>

      {screenshots.length > 1 && (
        <div className={styles.carouselControls}>
          <button className={styles.navBtn} onClick={prev} aria-label="Previous screenshot">
            <ChevronLeft />
          </button>
          <span className={styles.counter}>{active + 1} / {screenshots.length}</span>
          <button className={styles.navBtn} onClick={next} aria-label="Next screenshot">
            <ChevronRight />
          </button>
        </div>
      )}

      {/* Dot indicators */}
      {screenshots.length > 1 && (
        <div className={styles.dots}>
          {screenshots.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Go to screenshot ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Category Filter ──────────────────────────────────────────
const FILTERS = ["All", "Client Project", "Company Product"];

// ── Main Component ───────────────────────────────────────────
const ProjectsList = () => {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section className={styles.section}>
      {/* Filter Tabs */}
      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.map((project, i) => (
          <motion.div
            key={project.id}
            className={styles.card}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            {/* Card Header */}
            <div className={styles.cardHeader}>
              <div className={styles.meta}>
                <span className={styles.categoryBadge}>{project.category}</span>
                <span className={styles.tagBadge}>{project.tag}</span>
              </div>
              <span className={`${styles.status} ${project.status === "Live" ? styles.statusLive : styles.statusRunning}`}>
                <span className={styles.statusDot} />
                {project.status}
              </span>
            </div>

            <h3 className={styles.title}>{project.title}</h3>

            {/* Screenshots */}
            <ScreenshotsCarousel screenshots={project.screenshots} title={project.title} />

            {/* Details */}
            <div className={styles.details}>
              <div className={styles.block}>
                <strong>Problem</strong>
                <p>{project.problem}</p>
              </div>
              <div className={styles.block}>
                <strong>Solution</strong>
                <p>{project.solution}</p>
              </div>
              <div className={styles.block}>
                <strong>Outcome</strong>
                <p>{project.result}</p>
              </div>
              <div className={styles.block}>
                <strong>Client / Origin</strong>
                <p>{project.location}</p>
              </div>
            </div>

            {/* Footer */}
            {project.link && (
              <div className={styles.cardFooter}>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.visitLink}
                >
                  Visit Project <ExternalIcon />
                </a>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsList;