import FAQ from "../models/FAQ.model.js";
import FAQSeedState from "../models/FAQSeedState.model.js";
import { initialFAQs } from "./faqSeeds.js";

const syncFAQs = async () => {
  const seedState = await FAQSeedState.findOne({ id: "main" }).lean();
  if (seedState?.completed) return;

  for (const faq of initialFAQs) {
    await FAQ.updateOne(
      { id: faq.id },
      { $setOnInsert: faq },
      { upsert: true, runValidators: true },
    );
  }

  await FAQSeedState.updateOne(
    { id: "main" },
    { $set: { completed: true } },
    { upsert: true, runValidators: true },
  );
};

export default syncFAQs;
