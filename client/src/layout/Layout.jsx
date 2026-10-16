import React, { useCallback, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Header from "../components/Header/Header.jsx";
import BottomNav from "../components/BottomNav/BottomNav.jsx";
import Footer from "../components/Footer/Footer.jsx";
import styles from "./Layout.module.css";
import FAQ from "../components/FAQ/FAQ.jsx"; 
import { useLiveContentRefresh } from "../utils/liveContent.js";

const apiBase = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, "");

const Layout = () => {
  const [serviceOffer, setServiceOffer] = useState(null);

  const refreshOffer = useCallback(async () => {
    const response = await fetch(`${apiBase || ""}/api/offers/current`, {
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Unable to load the service offer.");
    }
    setServiceOffer(data.offer);
  }, []);

  useLiveContentRefresh("offer", refreshOffer);

  const offerText = serviceOffer
    ? [serviceOffer.label, serviceOffer.title, serviceOffer.description]
        .filter(Boolean)
        .join(" · ")
    : "";

  return (
    <div className={styles.appShell}>
      <Header />
      {serviceOffer && (
        <aside className={styles.offerTicker} aria-label="Current offer">
          <div className={styles.offerTickerTrack}>
            <Link className={styles.offerTickerItem} to={serviceOffer.ctaLink}>
              {offerText}
              <strong>{serviceOffer.ctaText}</strong>
            </Link>
            <Link
              className={styles.offerTickerItem}
              to={serviceOffer.ctaLink}
              aria-hidden="true"
              tabIndex={-1}
            >
              {offerText}
              <strong>{serviceOffer.ctaText}</strong>
            </Link>
            <Link
              className={styles.offerTickerItem}
              to={serviceOffer.ctaLink}
              aria-hidden="true"
              tabIndex={-1}
            >
              {offerText}
              <strong>{serviceOffer.ctaText}</strong>
            </Link>
          </div>
        </aside>
      )}
      <main className={styles.mainContent}>
        <Outlet context={{ serviceOffer }} />
      </main>
      <FAQ/>
      <Footer />
      <BottomNav /> 
    </div>
  );
};

export default Layout;
