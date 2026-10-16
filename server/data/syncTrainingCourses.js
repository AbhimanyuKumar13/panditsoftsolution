import courses from "../../client/src/data/Training/trainingCourses.json" with { type: "json" };
import TrainingCourse from "../models/TrainingCourse.model.js";

const syncTrainingCourses = async () => {
  for (const course of courses) {
    await TrainingCourse.updateOne(
      { id: course.id },
      { $setOnInsert: { ...course, isActive: true } },
      { upsert: true, runValidators: true },
    );
  }
};

export default syncTrainingCourses;
