import { useCallback, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  FiActivity,
  FiArrowDown,
  FiArrowRight,
  FiCheckCircle,
  FiGlobe,
  FiLayout,
  FiMonitor,
  FiServer,
  FiShoppingBag,
} from "react-icons/fi";
import styles from "./Services.module.css";
import { useLiveContentRefresh } from "../../utils/liveContent.js";

const iconMap = {
  FiGlobe,
  FiMonitor,
  FiShoppingBag,
  FiLayout,
  FiServer,
  FiActivity,
};

const apiBase = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, "");

const Services = () => {
  const { serviceOffer } = useOutletContext();
  const [services, setServices] = useState([]);
  const [packageCategories, setPackageCategories] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const catalogLoaded = useRef(false);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [activeTierId, setActiveTierId] = useState("");

  const refreshCatalog = useCallback(async () => {
    try {
      const response = await fetch(`${apiBase || ""}/api/service-catalog`, {
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to load services and packages.");
      }
      if (!Array.isArray(data.services) || !Array.isArray(data.packageCategories)) {
        throw new Error("The services catalog response was invalid.");
      }
      setServices(data.services);
      setPackageCategories(data.packageCategories);
      setCatalogError("");
      catalogLoaded.current = true;
    } catch (requestError) {
      if (!catalogLoaded.current) setCatalogError(requestError.message);
      throw requestError;
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  useLiveContentRefresh("service-catalog", refreshCatalog);

  const activeCategory =
    packageCategories.find((category) => category.id === activeCategoryId) ??
    packageCategories[0];
  const activeTier =
    activeCategory?.tiers.find((tier) => tier.id === activeTierId) ??
    activeCategory?.tiers[0];

  const selectCategory = (category) => {
    setActiveCategoryId(category.id);
    setActiveTierId(category.tiers[0].id);
  };

  return (
    <main className={styles.servicesPage}>
      {serviceOffer && (
        <section className={styles.offerBanner} aria-label="Current offer">
          <div className={styles.offerBannerContent}>
            <div>
              {serviceOffer.label && (
                <span className={styles.offerLabel}>{serviceOffer.label}</span>
              )}
              <h2>{serviceOffer.title}</h2>
              <p>{serviceOffer.description}</p>
            </div>
            <Link to={serviceOffer.ctaLink} className={styles.offerButton}>
              {serviceOffer.ctaText}
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}
      <section className={styles.servicesHero}>
        <div className={styles.servicesHeroContent}>
          <span className={styles.servicesHeroEyebrow}>Our Services</span>
          <h1>
            Digital services shaped around <span>your business.</span>
          </h1>
          <p>
            Explore what we build, compare package levels, and see what is
            included before you get in touch.
          </p>
          <div className={styles.servicesHeroActions}>
            <a href="#services" className={styles.servicesHeroPrimaryAction}>
              Explore services
              <FiArrowDown aria-hidden="true" />
            </a>
            <a href="#packages" className={styles.servicesHeroSecondaryAction}>
              Compare packages
            </a>
          </div>
        </div>
      </section>

      <section
        className={styles.servicesSection}
        id="services"
        aria-labelledby="services-title"
      >
        <div className={styles.servicesSectionInner}>
          <header className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Services</span>
            <h2 id="services-title">What we can help you build</h2>
          </header>

          {catalogLoading && (
            <p className={styles.catalogMessage}>Loading services…</p>
          )}
          {catalogError && (
            <p className={styles.catalogError} role="alert">{catalogError}</p>
          )}
          {!catalogLoading && !catalogError && services.length === 0 && (
            <p className={styles.catalogMessage}>
              Services are being updated. Please check back soon.
            </p>
          )}
          <div className={styles.servicesGrid}>
            {services.map((item) => {
              const Icon = iconMap[item.icon] || FiLayout;
              const category = packageCategories.find(
                (packageCategory) =>
                  packageCategory.id === item.packageCategory,
              );
              if (!category) return null;

              return (
                <article key={item.id} className={styles.serviceCard}>
                  <div className={styles.serviceCardTop}>
                    <span className={styles.serviceIcon}>
                      <Icon aria-hidden="true" />
                    </span>
                    <h3>{item.title}</h3>
                  </div>
                  <p>{item.desc}</p>
                  <ul className={styles.servicePoints}>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <a
                    href="#packages"
                    className={styles.servicePackageLink}
                    onClick={() => selectCategory(category)}
                  >
                    View {category.label} packages
                    <FiArrowRight aria-hidden="true" />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className={styles.packagesSection}
        id="packages"
        aria-labelledby="packages-title"
      >
        <div className={styles.packagesInner}>
          <header className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Packages & Pricing</span>
            <h2 id="packages-title">Choose a package level</h2>
            <p>
              Select a service, then choose a package to see its full
              inclusions.
            </p>
          </header>

          {packageCategories.length > 0 && (
            <>
              <div className={styles.categoryTabs} aria-label="Package categories">
                {packageCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={`${styles.categoryTab} ${
                      activeCategory?.id === category.id
                        ? styles.categoryTabActive
                        : ""
                    }`}
                    aria-pressed={activeCategory?.id === category.id}
                    onClick={() => selectCategory(category)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {activeCategory && activeTier && (
                <>
                  <div className={styles.packagesGrid}>
                    {activeCategory.tiers.map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        className={`${styles.packageCard} ${
                          activeTier.id === tier.id
                            ? styles.packageCardActive
                            : ""
                        }`}
                        aria-pressed={activeTier.id === tier.id}
                        aria-controls="package-details"
                        onClick={() => setActiveTierId(tier.id)}
                      >
                        <span className={styles.packageName}>{tier.name}</span>
                        <span className={styles.packagePriceLabel}>
                          Indicative price range
                        </span>
                        <span className={styles.packagePrice}>{tier.price}</span>
                        <span className={styles.packageSummary}>{tier.summary}</span>
                        <span className={styles.packageSelect}>
                          {activeTier.id === tier.id ? "Selected" : "View inclusions"}
                          <FiArrowDown aria-hidden="true" />
                        </span>
                      </button>
                    ))}
                  </div>

                  <section
                    className={styles.packageDetails}
                    id="package-details"
                    aria-labelledby="package-details-title"
                    aria-live="polite"
                  >
                    <div className={styles.packageDetailsIntro}>
                      <span className={styles.sectionEyebrow}>
                        {activeCategory.label}
                      </span>
                      <h3 id="package-details-title">{activeTier.name} Package</h3>
                      <p>{activeTier.summary}</p>
                      <div className={styles.packageDetailsPrice}>
                        {activeTier.price}
                        <small> indicative</small>
                      </div>
                      <p className={styles.packageMeta}>
                        Typical timeline: {activeTier.timeline}
                      </p>
                    </div>

                    <div className={styles.packageDetailsContent}>
                      <h4>What&apos;s included</h4>
                      <ul className={styles.packageFeatures}>
                        {activeTier.features.map((feature) => (
                          <li key={feature}>
                            <FiCheckCircle aria-hidden="true" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link to="/Contact" className={styles.packageLink}>
                        Get a quote for this package
                        <FiArrowRight aria-hidden="true" />
                      </Link>
                    </div>
                  </section>
                </>
              )}
            </>
          )}

          <p className={styles.pricingNote}>
            Prices are indicative estimates in INR, not a fixed quote. Final
            pricing depends on project scope, content, integrations, and
            requirements. Domain, hosting, paid third-party services, gateway
            charges, and applicable taxes may be additional.
          </p>
        </div>
      </section>

      <section className={styles.servicesCtaSection}>
        <div className={styles.servicesCtaInner}>
          <div>
            <h2>Need a package tailored to your requirements?</h2>
            <p>Tell us what you need and get a clear scope and quote.</p>
          </div>
          <Link to="/Contact" className={styles.servicesCtaButton}>
            Get a project quote
            <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Services;
