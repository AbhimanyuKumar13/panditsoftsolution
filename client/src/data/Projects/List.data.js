import ss1 from "../../assets/images/ProjectSS/preetdoors/SS1.png";
import ss2 from "../../assets/images/ProjectSS/preetdoors/SS2.png";
import ss3 from "../../assets/images/ProjectSS/preetdoors/SS3.png";
import ss4 from "../../assets/images/ProjectSS/preetdoors/SS4.png";


import pc1 from "../../assets/images/ProjectSS/panditC/PC1.png";
import pc2 from "../../assets/images/ProjectSS/panditC/PC2.png";
import pc3 from "../../assets/images/ProjectSS/panditC/PC3.png";
import pc4 from "../../assets/images/ProjectSS/panditC/PC4.png";


import pss1 from "../../assets/images/ProjectSS/Portfolio/PSS1.png";
import pss2 from "../../assets/images/ProjectSS/Portfolio/PSS2.png";
import pss3 from "../../assets/images/ProjectSS/Portfolio/PSS3.png";
import pss4 from "../../assets/images/ProjectSS/Portfolio/PSS4.png";
import pss5 from "../../assets/images/ProjectSS/Portfolio/PSS5.png";

import i1 from "../../assets/images/ProjectSS/Imagifai/I1.png";
import i2 from "../../assets/images/ProjectSS/Imagifai/I2.png";
import i3 from "../../assets/images/ProjectSS/Imagifai/I3.png";
import i4 from "../../assets/images/ProjectSS/Imagifai/I4.png";
import i5 from "../../assets/images/ProjectSS/Imagifai/I5.png";
import i6 from "../../assets/images/ProjectSS/Imagifai/I6.png";
import i7 from "../../assets/images/ProjectSS/Imagifai/I7.png";
import i8 from "../../assets/images/ProjectSS/Imagifai/I8.png";
import i9 from "../../assets/images/ProjectSS/Imagifai/I9.png";
import i10 from "../../assets/images/ProjectSS/Imagifai/I10.png"; 


import bt1 from "../../assets/images/ProjectSS/bittutelecom/BT1.png";
import bt2 from "../../assets/images/ProjectSS/bittutelecom/BT2.png";
import bt3 from "../../assets/images/ProjectSS/bittutelecom/BT3.png";
import bt4 from "../../assets/images/ProjectSS/bittutelecom/BT4.png";
import bt5 from "../../assets/images/ProjectSS/bittutelecom/BT5.png";
import bt6 from "../../assets/images/ProjectSS/bittutelecom/BT6.png";
import bt7 from "../../assets/images/ProjectSS/bittutelecom/BT7.png";
import bt8 from "../../assets/images/ProjectSS/bittutelecom/BT8.png";
import bt9 from "../../assets/images/ProjectSS/bittutelecom/BT9.png";
import bt10 from "../../assets/images/ProjectSS/bittutelecom/BT10.png";
import bt11 from "../../assets/images/ProjectSS/bittutelecom/BT11.png";
import bt12 from "../../assets/images/ProjectSS/bittutelecom/BT12.png";
import bt13 from "../../assets/images/ProjectSS/bittutelecom/BT13.png";


export const projects = [
  // ── Client Projects ──────────────────────────────────────────
  {
    id: "bittutelecom",
    category: "Client Project",
    tag: "E-Commerce + Admin Panel",
    title: "Bittu Telecom – E-Commerce with Admin Panel",
    problem:
      "Client needed a fully functional online store to sell telecom products with a backend admin panel to manage inventory, orders, and customers without technical knowledge.",
    solution:
      "Built a full-stack e-commerce platform with product listings, cart, checkout flow, and a secure admin dashboard for real-time order & inventory management.",
    result:
      "Client can now manage products and orders independently. Store is live with a seamless shopping experience and admin control panel.",
    location: "Bihar, India",
    link: "https://bittutelecom.com",
    screenshots: [
      bt1,  
      bt2, 
      bt3,  
      bt4,  
      bt5,  
      bt5,  
      bt7,  
      bt8,  
      bt9,  
      bt10,  
      bt11,  
      bt12,  
      bt13,  
    ],
    status: "Live",
  },
  {
    id: "preetdoors",
    category: "Client Project",
    tag: "Business Website",
    title: "Preet Doors – Business & Product Showcase",
    problem:
      "Client needed a professional online presence to showcase their door manufacturing work and attract customers via Google search and social media.",
    solution:
      "Designed and developed a mobile-first website with clean UI, product gallery, SEO-friendly structure, and direct contact options.",
    result:
      "Improved online visibility, clearer customer engagement, and a professional digital identity for the business.",
    location:
      "V S Enterprises, Plot No. 14A, Sai Residency, Chinhat, Lucknow, U.P.",
    link: "https://preetdoors.in",
    screenshots: [
      ss1,
      ss2,
      ss3,
      ss4
    ],
    status: "Live",
  },
  {
    id: "panditconstruction",
    category: "Client Project",
    tag: "Construction Website",
    title: "Pandit Construction – Civil Engineer Portfolio",
    problem:
      "Client needed a professional online presence to showcase their civil engineering work, projects, and quality of services.",
    solution:
      "Designed a mobile-first website with service listings, project gallery, SEO-friendly structure, and a contact form with direct contact options.",
    result:
      "Showcases completed projects and services; improved customer engagement and credibility with a polished digital presence.",
    location: "Bardoli, Surat, Gujarat",
    link: "https://panditconstruction.netlify.app",
    screenshots: [
      pc1,
      pc2,
      pc3,
      pc4
    ],
    status: "Live",
  },
  {
    id: "portfolio",
    category: "Client Project",
    tag: "Portfolio",
    title: "Portfolio Websites – For Professionals & Students",
    problem:
      "Clients needed a strong online presence to act as a digital resume and make a lasting impression on HR professionals and recruiters.",
    solution:
      "Built secure, scalable personal portfolio sites that present skills, projects, and experience in a way that speaks directly to potential employers.",
    result:
      "Clients now have a live digital resume, professional online identity, and increased interview callbacks.",
    location: "Abhishek Kumar (Siwan, Bihar) · Anand Kumar (Siwan, Bihar) · Abhi (Nashik, Maharashtra)",
    link: "https://abhi050505.netlify.app",
    screenshots: [
      pss1,
      pss2,
      pss3,
      pss4,
      pss5
    ],
    status: "Live",
  },

  // ── Company Products ─────────────────────────────────────────
  {
    id: "texttoimage",
    category: "Company Product",
    tag: "AI Tool",
    title: "Text-to-Image Converter",
    problem:
      "Users needed a simple, accessible tool to generate AI images from text prompts without complex setup or paid subscriptions.",
    solution:
      "Developed a web-based AI text-to-image platform with an intuitive prompt interface, style controls, and instant generation.",
    result:
      "Live product serving users who want fast, high-quality AI image generation directly in the browser.",
    location: "AbhiApndit – Company Product",
    link: "https://abhiapndit.online",
    screenshots: [
      i1,
      i2,
      i3,
      i4,
      i5,
      i6,
      i7,
      i8,
      i9,
      i10
    ],
    status: "Live",
  },
  {
    id: "csss",
    category: "Company Product",
    tag: "EdTech Platform",
    title: "College Selection Support System (CSSS)",
    problem:
      "Students struggle to choose the right college based on rank, branch preference, fees, and location — a complex, stressful decision with limited guidance.",
    solution:
      "Built an intelligent college selection platform that filters colleges by entrance rank, preferred stream, state, and fees — giving data-backed recommendations.",
    result:
      "Students can now make informed college choices quickly. System is actively running and helping students with admissions guidance.",
    location: "AbhiApndit – Company Product",
    link: null, // Add URL when public
    screenshots: [],
    status: "Running",
  },
];