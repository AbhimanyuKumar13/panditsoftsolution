import HomeReviews from "../models/HomeReviews.model.js";
import { initialHomeReviews } from "./homeReviewSeeds.js";

const syncHomeReviews = async () => {
  await HomeReviews.updateOne(
    { id: initialHomeReviews.id },
    { $setOnInsert: initialHomeReviews },
    { upsert: true, runValidators: true },
  );
};

export default syncHomeReviews;
