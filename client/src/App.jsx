import { Route, Routes } from "react-router";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Home from "./pages/Home/Home.jsx";
import Services from "./pages/Services/Services.jsx";
import Projects from "./pages/Projects/Projects.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import About from "./pages/About/About.jsx";
import { BrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import SkillLab from "./pages/SkillLab/SkillLab.jsx";
import PrivacyPolicypage from "./pages/Docs/pages/legal/PrivacyPolicy.jsx";
import Refundpage from "./pages/Docs/pages/legal/Refund.jsx";
import Termspage from "./pages/Docs/pages/legal/Terms.jsx";
import DataProtectionpage from "./pages/Docs/pages/security/DataProtection.jsx";
import Esoppage from "./pages/Docs/pages/security/Esop.jsx";
import IncidentResponsepage from "./pages/Docs/pages/security/IncidentResponse.jsx";
import CodeOfConductpage from "./pages/Docs/pages/hr/CodeOfConduct.jsx";
import Internshippage from "./pages/Docs/pages/hr/Internship.jsx";
import Msapage from "./pages/Docs/pages/business/Msa.jsx";
import Ndapage from "./pages/Docs/pages/business/Nda.jsx"; 
import CourseDetail from "./pages/SkillLab/sections/CourseDetail/CourseDetail.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/ourServices" element={<Services />} />
          <Route path="/Projects" element={<Projects />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/About" element={<About />} />
          <Route path="/skill-lab" element={<SkillLab />} />
          <Route path="/skill-lab/:slug" element={<CourseDetail />} />

          <Route path="/privacy-policy" element={<PrivacyPolicypage />} />
          <Route path="/refund-policy" element={<Refundpage />} />
          <Route path="/terms-condition-policy" element={<Termspage />} />
          <Route
            path="/data-protection-policy"
            element={<DataProtectionpage />}
          />
          <Route
            path="/incident-response-policy"
            element={<IncidentResponsepage />}
          />
          <Route path="/esop-policy" element={<Esoppage />} />
          <Route
            path="/code-of-conduct-policy"
            element={<CodeOfConductpage />}
          />
          <Route path="/internship-policy" element={<Internshippage />} />
          <Route path="/Msa-policy" element={<Msapage />} />
          <Route path="/Nda-policy" element={<Ndapage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
