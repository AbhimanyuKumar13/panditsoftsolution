export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: "blur(6px)",
  },

  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",

    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};