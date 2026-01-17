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

const App = () => {
  return (
    <BrowserRouter>
    
    <ScrollToTop/>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/ourServices" element={<Services />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/About" element={<About />} />
        <Route path="/skill-lab" element={<SkillLab />} />
      </Route>
    </Routes>  
    </BrowserRouter>
  );
};

export default App;
