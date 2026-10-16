import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Home from "./pages/Home/Home.jsx";
import Layout from "./layout/Layout.jsx";

const CertificateVerification = lazy(
  () => import("./components/CertificateVerification/CertificateVerification.jsx"),
);
const Services = lazy(() => import("./pages/Services/Services.jsx"));
const Projects = lazy(() => import("./pages/Projects/Projects.jsx"));
const Contact = lazy(() => import("./pages/Contact/Contact.jsx"));
const About = lazy(() => import("./pages/About/About.jsx"));
const SkillLab = lazy(() => import("./pages/SkillLab/SkillLab.jsx"));
const PrivacyPolicypage = lazy(
  () => import("./pages/Docs/pages/legal/PrivacyPolicy.jsx"),
);
const Refundpage = lazy(() => import("./pages/Docs/pages/legal/Refund.jsx"));
const Termspage = lazy(() => import("./pages/Docs/pages/legal/Terms.jsx"));
const DataProtectionpage = lazy(
  () => import("./pages/Docs/pages/security/DataProtection.jsx"),
);
const CourseDetail = lazy(
  () => import("./pages/SkillLab/sections/CourseDetail/CourseDetail.jsx"),
);
const Admin = lazy(() => import("./pages/Admin/Admin.jsx"));

export const AppRoutes = () => {
  useEffect(() => {
    let frameId = null;

    const updatePointerGlow = (event) => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          "--pointer-x",
          `${event.clientX}px`,
        );
        document.documentElement.style.setProperty(
          "--pointer-y",
          `${event.clientY}px`,
        );
        frameId = null;
      });
    };

    window.addEventListener("pointermove", updatePointerGlow, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", updatePointerGlow);
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <>
      <ScrollToTop />

      <Suspense fallback={<div role="status">Loading page...</div>}>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/ourServices" element={<Services />} />
            <Route path="/Projects" element={<Projects />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/About" element={<About />} />

            <Route path="/skill-lab" element={<SkillLab />} />
            <Route
              path="/skill-lab/certificateVerification"
              element={<CertificateVerification />}
            />
            <Route path="/skill-lab/:slug" element={<CourseDetail />} />

            <Route path="/privacy-policy" element={<PrivacyPolicypage />} />
            <Route path="/refund-policy" element={<Refundpage />} />
            <Route path="/terms-condition-policy" element={<Termspage />} />
            <Route
              path="/data-protection-policy"
              element={<DataProtectionpage />}
            />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
