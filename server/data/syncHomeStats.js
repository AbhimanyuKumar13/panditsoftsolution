import HomeStats from "../models/HomeStats.model.js";
import { initialHomeStats } from "./homeStatsSeeds.js";

const syncHomeStats = async () => {
  await HomeStats.updateOne(
    { id: initialHomeStats.id },
    { $setOnInsert: initialHomeStats },
    { upsert: true, runValidators: true },
  );
};

export default syncHomeStats;
