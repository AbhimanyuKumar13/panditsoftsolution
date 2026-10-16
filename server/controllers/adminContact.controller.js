import Contact from "../models/Contact.model.js";
import asyncRoute from "../utils/asyncRoute.js";

const statuses = new Set(["new", "in-progress", "done"]);
const pageSizes = new Set([5, 10, 20]);

export const listAdminContacts = asyncRoute(async (req, res) => {
  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const pageSize = req.query.pageSize === undefined ? 10 : Number(req.query.pageSize);
  const status = req.query.status;

  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !pageSizes.has(pageSize) ||
    (status !== undefined && !statuses.has(status))
  ) {
    return res.status(400).json({
      error: "Provide a positive page, a page size of 5, 10, or 20, and a valid status filter.",
    });
  }

  const filter = status ? { status } : {};
  const [total, newCount, inProgressCount, doneCount] = await Promise.all([
    Contact.countDocuments(filter),
    Contact.countDocuments({ status: { $in: ["new", null] } }),
    Contact.countDocuments({ status: "in-progress" }),
    Contact.countDocuments({ status: "done" }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const contacts = await Contact.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .skip((currentPage - 1) * pageSize)
    .limit(pageSize)
    .lean();

  return res.json({
    contacts: contacts.map((contact) => ({
      ...contact,
      status: contact.status || "new",
    })),
    pagination: { page: currentPage, pageSize, total, totalPages },
    counts: { new: newCount, inProgress: inProgressCount, done: doneCount },
  });
});

export const updateAdminContactStatus = asyncRoute(async (req, res) => {
  const { status } = req.body || {};
  if (!statuses.has(status)) {
    return res.status(400).json({ error: "Status must be new, in-progress, or done." });
  }

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { $set: { status } },
    { new: true, runValidators: true },
  ).lean();
  if (!contact) {
    return res.status(404).json({ error: "Contact enquiry was not found." });
  }
  return res.json({
    success: true,
    contact: { ...contact, status: contact.status || "new" },
  });
});
