export const initialFAQs = [
  {
    id: "what-services-do-you-provide",
    question: "What services do you provide?",
    answer: [
      "Business websites and company portals",
      "Landing pages, portfolios, and e-commerce storefronts",
      "Custom web applications and dashboards",
      "API development, backend systems, and database work",
      "Website redesign, maintenance, and performance optimization",
    ],
  },
  {
    id: "do-you-build-custom-websites-and-web-apps",
    question: "Do you build custom websites and web apps?",
    answer: [
      "Yes. We build tailored solutions based on your business goals, whether you need a simple brochure website, a lead-generation platform, or a fully customized web application with login, workflows, and data management.",
    ],
  },
  {
    id: "how-long-does-a-project-usually-take",
    question: "How long does a project usually take?",
    answer: [
      "The timeline depends on scope and complexity. A standard business website can take around 1 to 3 weeks, while a custom web app or multi-page platform may take several weeks. We share a clear timeline before starting and keep updates throughout the project.",
    ],
  },
  {
    id: "how-much-does-a-website-or-app-cost",
    question: "How much does a website or app cost?",
    answer: [
      "The cost depends on the features, pages, integrations, and project timeline. We provide a custom quote after understanding your requirements, with transparent pricing and no hidden charges.",
    ],
  },
  {
    id: "can-you-redesign-my-existing-website",
    question: "Can you redesign my existing website?",
    answer: [
      "Absolutely. We can refresh your current website, improve user experience, update the design, fix outdated sections, improve speed, and add features that support your business growth.",
    ],
  },
  {
    id: "do-you-offer-support-and-maintenance-after-launch",
    question: "Do you offer support and maintenance after launch?",
    answer: [
      "Yes. We provide post-launch support, bug fixes, performance improvements, content updates, and ongoing maintenance packages so your website continues to perform smoothly after delivery.",
    ],
  },
  {
    id: "do-you-work-with-startups-and-growing-businesses",
    question: "Do you work with startups and growing businesses?",
    answer: [
      "Yes. We work with startups, founders, small businesses, and established companies that need reliable digital solutions. We also help clients who are not technical and guide them through the process in simple language.",
    ],
  },
  {
    id: "what-is-your-process-for-starting-a-project",
    question: "What is your process for starting a project?",
    answer: [
      "We begin with a discovery conversation, review your goals and requirements, suggest the right approach, prepare a proposal, and then move into design and development. You will be kept informed at every stage with clear milestones and feedback cycles.",
    ],
  },
  {
    id: "how-do-i-get-a-quote-for-my-project",
    question: "How do I get a quote for my project?",
    answer: [
      "Simply contact us through the form, email, or phone. Share your project goals, timeline, and any references you like, and we will get back to you with a suitable recommendation and quote.",
    ],
  },
].map((faq, sortOrder) => ({ ...faq, isPublished: true, sortOrder }));
