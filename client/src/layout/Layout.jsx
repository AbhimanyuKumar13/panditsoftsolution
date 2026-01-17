import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header.jsx";
import BottomNav from "../components/BottomNav/BottomNav.jsx";
import Footer from "../components/Footer/Footer.jsx";
import styles from "./Layout.module.css";
import FAQ from "../components/FAQ/FAQ.jsx";
import Training from "../components/Training/Training.jsx";

const Layout = () => {
  return (
    <div className={styles.appShell}>
      <Header />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <FAQ/>
      <Footer />
      <BottomNav />
      <Training />
    </div>
  );
};

export default Layout;
