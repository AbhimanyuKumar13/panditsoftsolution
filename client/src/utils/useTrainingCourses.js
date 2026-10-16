import { useCallback, useState } from "react";
import initialCourses from "../data/Training/trainingCourses.json";
import { useLiveContentRefresh } from "./liveContent.js";

const apiBase = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, "");

export const useTrainingCourses = () => {
  const [courses, setCourses] = useState(initialCourses);

  const refreshCourses = useCallback(async () => {
    const response = await fetch(`${apiBase || ""}/api/courses`, {
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Unable to load training courses.");
    }
    if (!Array.isArray(data.courses)) {
      throw new Error("The training courses response was invalid.");
    }
    setCourses(data.courses);
  }, []);

  useLiveContentRefresh("training-courses", refreshCourses);

  return courses;
};
