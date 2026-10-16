import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiGlobe, FiLayout, FiTrendingUp } from "react-icons/fi";
import styles from "./Home.module.css";
import { points } from "../../data/Home/Whyus.data";
import { projects } from "../../data/Home/Work.data";
import { useLiveContentRefresh } from "../../utils/liveContent.js";

const apiBase = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, "");

const manualReviews = [
  {
    id: "vs-enterprises",
    name: "V S Enterprises",
    badge: "ENTERPRISES",
    meta: "1 review • 1 photo",
    rating: 5,
    timeAgo: "7 months ago",
    avatar: "V.S",
    text: "We had a great experience working with the Pandit soft solutions for the PREET DOORS website by VS Enterprises. The design is clean, professional, and perfectly represents our brand. The developer understood our requirements well and delivered the project on time. Highly recommended for business websites.",
  },
  {
    id: "veer-abhishek",
    name: "Veer Abhishek",
    badge: "Local Guide",
    meta: "9 reviews • 71 photos",
    rating: 5,
    timeAgo: "8 months ago",
    avatar: "V",
    text: "Congratulations to Pandit SoftSolution on the launch of your new startup! The creativity, professionalism, and dedication you bring to your work truly stand out. Wishing you great success and growth in the journey ahead.",
  },
  {
    id: "adiyogi-construction",
    name: "Adiyogi Construction",
    badge: "Owner",
    meta: "Labour & Painter Management",
    rating: 5,
    timeAgo: "Recently",
    avatar: "A",
    text: "Pandit Soft Solution built a highly practical system for our labour and painter management work. It made it much easier to assign tasks, track teams, and keep daily operations organized without confusion. The team was responsive, thoughtful, and understood our business needs from day one.",
  },
];

const initialMetrics = [
  { id: "experience", value: 4, label: "Years of Experience", suffix: "+" },
  { id: "clients", value: 20, label: "Clients Served", suffix: "+" },
  { id: "projects", value: 30, label: "Projects Delivered", suffix: "+" },
];

const iconMap = {
  "Business Websites": FiGlobe,
  "Admin Dashboard Web App": FiLayout,
  "Landing Page for Services": FiTrendingUp,
};

const StatItem = ({ value, label, suffix = "+" }) => {
  return (
    <div className={styles.homeStatsItem}>
      <span className={styles.homeStatsNumber}>
        {value}
        {suffix}
      </span>
      <span className={styles.homeStatsLabel}>{label}</span>
    </div>
  );
};

const Home = () => {
  const [reviews, setReviews] = useState(manualReviews);
  const [metrics, setMetrics] = useState(initialMetrics);

  const refreshReviews = useCallback(async () => {
    const response = await fetch(`${apiBase || ""}/api/home-reviews`, {
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Unable to load homepage reviews.");
    }
    setReviews(data.reviews);
  }, []);

  useLiveContentRefresh("home-reviews", refreshReviews);

  const refreshMetrics = useCallback(async () => {
    const response = await fetch(`${apiBase || ""}/api/home-stats`, {
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Unable to load homepage statistics.");
    }
    if (!Array.isArray(data.stats)) {
      throw new Error("The homepage statistics response was invalid.");
    }
    setMetrics(data.stats);
  }, []);

  useLiveContentRefresh("home-stats", refreshMetrics);

  return (
    <>
      <section className={styles.homeHero}>
        <div className={styles.homeHeroContent}>
          <h1>
            Professional <span>websites</span> and <br />
            <span>web apps</span> for growing businesses.
          </h1>

          <p>
            We design and build reliable digital products for service
            businesses, startups, and teams.
          </p>

          <div className={styles.homeHeroActions}>
            <Link to="/Contact" className={styles.homeHeroPrimary}>
              Start Your Project
            </Link>
            <Link to="/Projects" className={styles.homeHeroSecondary}>
              View Projects
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.homeWhySection}>
        <div className={styles.homeWhyWrapper}>
          <header className={styles.homeWhyHeader}>
            <h2>Why Choose Us</h2>
          </header>

          <div className={styles.homeWhyTimeline}>
            {points.map((item) => (
              <div key={item.title} className={styles.homeWhyItem}>
                <div className={styles.homeWhyCard}>
                  <div className={styles.homeWhyInner}>
                    <div className={styles.homeWhyImageWrapper}>
                      <img
                        src={item.image}
                        alt={item.title}
                        width="150"
                        height="150"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className={styles.homeWhyContent}>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.homeOfferSection}>
        <div className={styles.homeOfferShell}>
          <header className={styles.homeOfferHeader}>
            <span className={styles.homeOfferKicker}>What We Build</span>
            <h2>Practical digital products for real business needs.</h2>
            <p>
              We build websites, dashboards, and landing pages with clear
              structure and reliable delivery.
            </p>
          </header>

          <div className={styles.homeOfferList}>
            {projects.map((project) => {
              const Icon = iconMap[project.title] || FiLayout;

              return (
                <article
                  key={project.title}
                  className={styles.homeOfferCard}
                >
                  <div className={styles.homeOfferTop}>
                    <div className={styles.homeOfferTopMeta}>
                      <span className={styles.homeOfferIconWrap}>
                        <Icon aria-hidden="true" />
                      </span>
                      <span className={styles.homeOfferType}>
                        {project.type}
                      </span>
                    </div>
                    <h3>{project.title}</h3>
                  </div>

                  <p>{project.desc}</p>

                  <ul className={styles.homeOfferPoints}>
                    {project.deliverables.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          <div className={styles.homeOfferCtaWrap}>
            <Link to="/ourServices" className={styles.homeOfferCta}>
              View All Services
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.homeStatsSection}>
        <div className={styles.homeStatsWrapper}>
          <div className={styles.homeStatsMetricGrid}>
            {metrics.map((metric) => (
              <article
                key={metric.label}
                className={styles.homeStatsMetricCard}
              >
                <StatItem
                  value={metric.value}
                  label={metric.label}
                  suffix={metric.suffix}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
      <section className={styles.homeReviewsSection}>
        <div className={styles.homeReviewsWrapper}>
          <div className={styles.homeReviewsToolbar}>
            <h2>Client Feedback</h2>
          </div>

          <div className={styles.homeReviewsList}>
            {reviews.map((review, index) => (
              <article
                key={`${review.name}-${index}`}
                className={styles.homeReviewCard}
              >
                <div className={styles.homeReviewHeader}>
                  <div className={styles.homeReviewProfile}>
                    <div className={styles.homeReviewAvatar}>
                      {review.avatar}
                    </div>
                    <div className={styles.homeReviewIdentity}>
                      <div className={styles.homeReviewNameRow}>
                        <strong>{review.name}</strong>
                      </div>
                      <span>
                        {review.badge} • {review.meta}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.homeReviewMenu}
                    aria-label="More review actions"
                  >
                    ⋮
                  </button>
                </div>

                <div
                  className={styles.homeReviewStars}
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {Array.from({ length: review.rating }).map((_, starIndex) => (
                    <span key={`${review.name}-star-${starIndex}`}>★</span>
                  ))}
                  <span className={styles.homeReviewTime}>
                    {review.timeAgo}
                  </span>
                </div>

                <p className={styles.homeReviewText}>{review.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      )}

      <section className={styles.homeCtaSection}>
        <div
          className={styles.homeCtaInner}
        >
          <div className={styles.homeCtaCopy}>
            <span className={styles.homeCtaKicker}>Ready To Talk</span>
            <h2>Have a project in mind?</h2>
            <p>
              Tell us what you need and we will help you plan the right build.
            </p>
          </div>

          <div className={styles.homeCtaActions}>
            <Link to="/Contact" className={styles.homeCtaButton}>
              Contact Us
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
