import Service from "../models/Service.model.js";
import ServiceCategory from "../models/ServiceCategory.model.js";
import { initialCategories, initialServices } from "./serviceCatalogSeeds.js";

const syncServiceCatalog = async () => {
  for (const category of initialCategories) {
    const initialCategory = {
      ...category,
      isActive: true,
      tiers: category.tiers.map((tier) => ({ ...tier, isActive: true })),
    };
    await ServiceCategory.updateOne(
      { id: category.id },
      { $setOnInsert: initialCategory },
      { upsert: true, runValidators: true },
    );
  }

  for (const service of initialServices) {
    const initialService = { isActive: true, ...service };
    await Service.updateOne(
      { id: service.id },
      { $setOnInsert: initialService },
      { upsert: true, runValidators: true },
    );
  }
};

export default syncServiceCatalog;
