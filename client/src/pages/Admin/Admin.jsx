import { useCallback, useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiArrowDown,
  FiArrowUp,
  FiFileText,
  FiLogOut,
  FiPlus,
  FiRefreshCw,
  FiShield,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import styles from "./Admin.module.css";
import { notifyLiveContentUpdated } from "../../utils/liveContent.js";

const apiBase = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, "");
const emptyProject = {
  category: "Client Project",
  tag: "",
  title: "",
  problem: "",
  solution: "",
  result: "",
  location: "",
  link: "",
  screenshots: "",
  status: "Live",
};
const emptyCertificate = {
  studentName: "",
  studentId: "",
  certificateNo: "",
  courseName: "",
  courseStartDate: "",
  courseEndDate: "",
  issuedOn: "",
};
const emptyConfirmationLetter = {
  candidateName: "",
  referenceNo: "",
  programName: "",
  technology: "",
  durationLabel: "",
  sessionYear: new Date().getFullYear(),
  supervisorName: "",
  issuedOn: "",
};
const emptyOffer = {
  isActive: false,
  title: "",
  description: "",
  label: "",
  ctaText: "Contact Us",
  ctaLink: "/Contact",
  startsAt: "",
  endsAt: "",
};
const emptyService = {
  packageCategory: "",
  title: "",
  desc: "",
  points: "",
  icon: "FiLayout",
  isActive: true,
};
const emptyServiceCategory = { label: "", isActive: true };
const emptyPackageTier = {
  name: "",
  price: "",
  summary: "",
  timeline: "",
  features: "",
  isActive: true,
};
const emptyFAQ = {
  question: "",
  answer: "",
  isPublished: true,
};
const createEmptyHomeReview = () => ({
  id: `review-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
  name: "",
  badge: "",
  meta: "",
  rating: 5,
  timeAgo: "",
  avatar: "",
  text: "",
});
const initialHomeStats = [
  { id: "experience", value: 4, label: "Years of Experience", suffix: "+" },
  { id: "clients", value: 20, label: "Clients Served", suffix: "+" },
  { id: "projects", value: 30, label: "Projects Delivered", suffix: "+" },
];
const emptyTrainingCourse = {
  title: "",
  trackGroup: "45 Days",
  trackLabel: "",
  summary: "",
  skillsPreview: "",
  duration: "",
  level: "",
  mode: "",
  commitment: "",
  price: "",
  audience: "",
  notFor: "",
  modules: "",
  projects: "",
  teachingMethod: "",
  sessionsPerWeek: 1,
  sessionDuration: "",
  recordings: true,
  isActive: true,
};
const emptyPagination = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 1,
};
const emptyContactCounts = { new: 0, inProgress: 0, done: 0 };
const contactStatusLabels = {
  new: "New",
  "in-progress": "In progress",
  done: "Done",
};
const request = async (path, options = {}) => {
  if (!apiBase) {
    throw new Error("VITE_API_BASE_URL is not configured.");
  }

  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "X-Admin-Request": "1",
      ...(options.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || "The request could not be completed.");
    error.status = response.status;
    throw error;
  }

  return data;
};

const getAdminCertificates = (page = 1, pageSize = 10) =>
  request(`/api/admin/certificates?page=${page}&pageSize=${pageSize}`);
const getAdminProjects = (page = 1, pageSize = 10) =>
  request(`/api/admin/projects?page=${page}&pageSize=${pageSize}`);
const getAdminServiceCatalog = () => request("/api/admin/service-catalog");

const asLocalDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
};

const courseToForm = (course) => ({
  ...course,
  skillsPreview: course.skillsPreview.join("\n"),
  audience: course.audience.join("\n"),
  notFor: course.notFor.join("\n"),
  modules: course.modules
    .map((module) => [module.title, ...module.topics.map((topic) => `- ${topic}`)].join("\n"))
    .join("\n\n"),
  projects: course.projects.join("\n"),
  teachingMethod: course.teachingMethod.join("\n"),
  sessionsPerWeek: course.schedule.sessionsPerWeek,
  sessionDuration: course.schedule.sessionDuration,
  recordings: course.schedule.recordings,
});

const parseCourseModules = (value) => {
  const blocks = value
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))
    .filter((lines) => lines.length > 0);

  if (!blocks.length) return null;
  const modules = blocks.map(([title, ...topics]) => ({
    title,
    topics: topics.map((topic) => topic.replace(/^-\s*/, "")).filter(Boolean),
  }));
  return modules.every((module) => module.title && module.topics.length) ? modules : null;
};

const parseCourseLines = (value) =>
  value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

const Admin = () => {
  const [account, setAccount] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [setupRequired, setSetupRequired] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [authView, setAuthView] = useState("login");
  const [setupForm, setSetupForm] = useState({
    email: "",
    code: "",
    password: "",
  });
  const [resetForm, setResetForm] = useState({
    email: "",
    code: "",
    password: "",
  });
  const [projects, setProjects] = useState([]);
  const [projectPagination, setProjectPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [projectPageLoading, setProjectPageLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactPagination, setContactPagination] = useState(emptyPagination);
  const [contactCounts, setContactCounts] = useState(emptyContactCounts);
  const [contactPageLoading, setContactPageLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [certificatePagination, setCertificatePagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [certificatePageLoading, setCertificatePageLoading] = useState(false);
  const [confirmationLetters, setConfirmationLetters] = useState([]);
  const [confirmationLetterPagination, setConfirmationLetterPagination] = useState(emptyPagination);
  const [confirmationLetterPageLoading, setConfirmationLetterPageLoading] = useState(false);
  const [confirmationLetterForm, setConfirmationLetterForm] = useState(emptyConfirmationLetter);
  const [confirmationLetterError, setConfirmationLetterError] = useState("");
  const [admins, setAdmins] = useState([]);
  const [deletingAdminId, setDeletingAdminId] = useState("");
  const [adminDeleteConfirmation, setAdminDeleteConfirmation] = useState("");
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [editingProjectId, setEditingProjectId] = useState("");
  const [certificateForm, setCertificateForm] = useState(emptyCertificate);
  const [adminForm, setAdminForm] = useState({ email: "", password: "" });
  const [passwordAdmin, setPasswordAdmin] = useState(null);
  const [passwordForm, setPasswordForm] = useState("");
  const [offer, setOffer] = useState(emptyOffer);
  const [serviceCatalog, setServiceCatalog] = useState({
    services: [],
    packageCategories: [],
  });
  const [homeReviews, setHomeReviews] = useState([]);
  const [trainingCourses, setTrainingCourses] = useState([]);
  const [trainingCoursesLoading, setTrainingCoursesLoading] = useState(true);
  const [trainingCoursesError, setTrainingCoursesError] = useState("");
  const [trainingCourseForm, setTrainingCourseForm] = useState(emptyTrainingCourse);
  const [editingTrainingCourseId, setEditingTrainingCourseId] = useState("");
  const [deletingTrainingCourseId, setDeletingTrainingCourseId] = useState("");
  const [trainingCourseDeleteConfirmation, setTrainingCourseDeleteConfirmation] = useState("");
  const [homeStats, setHomeStats] = useState(initialHomeStats);
  const [homeStatsLoading, setHomeStatsLoading] = useState(true);
  const [homeStatsError, setHomeStatsError] = useState("");
  const [faqs, setFAQs] = useState([]);
  const [faqsLoading, setFAQsLoading] = useState(true);
  const [faqError, setFAQError] = useState("");
  const [faqForm, setFAQForm] = useState(emptyFAQ);
  const [editingFAQId, setEditingFAQId] = useState("");
  const [selectedCatalogCategoryId, setSelectedCatalogCategoryId] = useState("");
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [editingServiceId, setEditingServiceId] = useState("");
  const [serviceCategoryForm, setServiceCategoryForm] = useState(emptyServiceCategory);
  const [editingServiceCategoryId, setEditingServiceCategoryId] = useState("");
  const [packageTierForm, setPackageTierForm] = useState(emptyPackageTier);
  const [editingPackageTierId, setEditingPackageTierId] = useState("");
  const [offerDeleteConfirmation, setOfferDeleteConfirmation] = useState("");
  const [showOfferDeleteConfirmation, setShowOfferDeleteConfirmation] = useState(false);
  const [activeModal, setActiveModal] = useState("");
  const [saving, setSaving] = useState(false);
  const projectScreenshotUrls = projectForm.screenshots
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean);
  const selectedCatalogCategory = serviceCatalog.packageCategories.find(
    (category) => category.id === selectedCatalogCategoryId,
  );

  const refreshAdminFAQs = useCallback(async () => {
    const data = await request("/api/admin/faqs");
    if (!Array.isArray(data.faqs)) {
      throw new Error("The FAQ list response was invalid.");
    }
    return data.faqs;
  }, []);

  const refreshAdminHomeStats = useCallback(async () => {
    const data = await request("/api/admin/home-stats");
    if (!Array.isArray(data.stats)) {
      throw new Error("The homepage statistics response was invalid.");
    }
    return data.stats;
  }, []);

  const refreshAdminTrainingCourses = useCallback(async () => {
    const data = await request("/api/admin/courses");
    if (!Array.isArray(data.courses)) {
      throw new Error("The training courses response was invalid.");
    }
    return data.courses;
  }, []);

  const refreshAdminConfirmationLetters = useCallback(
    async (page = 1, pageSize = 10) => {
      const data = await request(
        `/api/admin/confirmation-letters?page=${page}&pageSize=${pageSize}`,
      );
      if (!Array.isArray(data.confirmationLetters) || !data.pagination) {
        throw new Error("The confirmation letter response was invalid.");
      }
      return data;
    },
    [],
  );

  const openConfirmationLetters = async () => {
    setConfirmationLetterPageLoading(true);
    setConfirmationLetterError("");
    try {
      const data = await refreshAdminConfirmationLetters(
        1,
        confirmationLetterPagination.pageSize,
      );
      setConfirmationLetters(data.confirmationLetters);
      setConfirmationLetterPagination(data.pagination);
      setError("");
      setActiveModal("confirmationLetters");
    } catch (requestError) {
      if (requestError.status === 401) setAccount(null);
      setConfirmationLetterError(requestError.message);
    } finally {
      setConfirmationLetterPageLoading(false);
    }
  };

  const openTrainingCourseManager = async () => {
    setTrainingCoursesLoading(true);
    setTrainingCoursesError("");
    try {
      setTrainingCourses(await refreshAdminTrainingCourses());
      setError("");
      setActiveModal("trainingCourses");
    } catch (requestError) {
      if (requestError.status === 401) setAccount(null);
      setTrainingCoursesError(requestError.message);
    } finally {
      setTrainingCoursesLoading(false);
    }
  };

  const openTrainingCourseEditor = (course) => {
    setTrainingCourseForm(courseToForm(course));
    setEditingTrainingCourseId(course.id);
    setError("");
    setActiveModal("trainingCourseForm");
  };

  const openHomeStatsEditor = async () => {
    setHomeStatsLoading(true);
    setHomeStatsError("");
    try {
      setHomeStats(await refreshAdminHomeStats());
      setError("");
      setActiveModal("homeStats");
    } catch (requestError) {
      if (requestError.status === 401) setAccount(null);
      setHomeStatsError(requestError.message);
    } finally {
      setHomeStatsLoading(false);
    }
  };

  const openFAQManager = async () => {
    setFAQsLoading(true);
    setFAQError("");
    try {
      setFAQs(await refreshAdminFAQs());
      setActiveModal("faqManager");
    } catch (requestError) {
      if (requestError.status === 401) setAccount(null);
      setFAQError(requestError.message);
    } finally {
      setFAQsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      try {
        const { account: currentAccount } = await request("/api/admin/auth/session");
        if (mounted) setAccount(currentAccount);
      } catch (requestError) {
        if (!mounted) return;
        if (requestError.status === 401) {
          try {
            const { initialized } = await request("/api/admin/auth/owner/setup-status");
            if (!mounted) return;
            setSetupRequired(!initialized);
            setAuthView(initialized ? "login" : "setup");
          } catch (setupError) {
            if (mounted) setError(setupError.message);
          }
        } else {
          setError(requestError.message);
        }
      } finally {
        if (mounted) setCheckingSession(false);
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  const bootstrapOwner = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const data = await request("/api/admin/auth/owner/bootstrap", {
        method: "POST",
        body: JSON.stringify(setupForm),
      });
      setSetupRequired(false);
      setAuthView("login");
      setLoginForm({ email: data.account.email, password: "" });
      setSetupForm({ email: "", code: "", password: "" });
      setNotice(data.message);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!account) return undefined;

    let mounted = true;
    const load = async () => {
      try {
        const results = await Promise.all([
          getAdminProjects(),
          getAdminCertificates(),
          request("/api/admin/offer"),
          getAdminServiceCatalog(),
          request("/api/admin/home-reviews"),
          request("/api/admin/contacts"),
          account.role === "owner"
            ? request("/api/admin/admins")
            : Promise.resolve({ admins: [] }),
        ]);
        if (!mounted) return;
        setProjects(results[0].projects);
        setProjectPagination(results[0].pagination);
        setCertificates(results[1].certificates);
        setCertificatePagination(results[1].pagination);
        setOffer({
          ...emptyOffer,
          ...results[2].offer,
          startsAt: asLocalDateTime(results[2].offer.startsAt),
          endsAt: asLocalDateTime(results[2].offer.endsAt),
        });
        setServiceCatalog({
          services: results[3].services,
          packageCategories: results[3].packageCategories,
        });
        setHomeReviews(results[4].reviews);
        setContacts(results[5].contacts);
        setContactPagination(results[5].pagination);
        setContactCounts(results[5].counts);
        setSelectedCatalogCategoryId((current) =>
          results[3].packageCategories.some((item) => item.id === current)
            ? current
            : results[3].packageCategories[0]?.id || "",
        );
        setAdmins(results[6].admins);
        setError("");
      } catch (requestError) {
        if (mounted) {
          if (requestError.status === 401) setAccount(null);
          setError(requestError.message);
        }
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [account]);

  useEffect(() => {
    if (!account) return undefined;

    let mounted = true;
    setFAQsLoading(true);
    refreshAdminFAQs()
      .then((faqList) => {
        if (!mounted) return;
        setFAQs(faqList);
        setFAQError("");
      })
      .catch((requestError) => {
        if (!mounted) return;
        if (requestError.status === 401) setAccount(null);
        setFAQError(requestError.message);
      })
      .finally(() => {
        if (mounted) setFAQsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [account, refreshAdminFAQs]);

  useEffect(() => {
    if (!account) return undefined;

    let mounted = true;
    setHomeStatsLoading(true);
    refreshAdminHomeStats()
      .then((stats) => {
        if (!mounted) return;
        setHomeStats(stats);
        setHomeStatsError("");
      })
      .catch((requestError) => {
        if (!mounted) return;
        if (requestError.status === 401) setAccount(null);
        setHomeStatsError(requestError.message);
      })
      .finally(() => {
        if (mounted) setHomeStatsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [account, refreshAdminHomeStats]);

  useEffect(() => {
    if (!account) return undefined;

    let mounted = true;
    setTrainingCoursesLoading(true);
    refreshAdminTrainingCourses()
      .then((courses) => {
        if (!mounted) return;
        setTrainingCourses(courses);
        setTrainingCoursesError("");
      })
      .catch((requestError) => {
        if (!mounted) return;
        if (requestError.status === 401) setAccount(null);
        setTrainingCoursesError(requestError.message);
      })
      .finally(() => {
        if (mounted) setTrainingCoursesLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [account, refreshAdminTrainingCourses]);

  useEffect(() => {
    if (!account) return undefined;

    let mounted = true;
    refreshAdminConfirmationLetters(1, 10)
      .then((data) => {
        if (!mounted) return;
        setConfirmationLetters(data.confirmationLetters);
        setConfirmationLetterPagination(data.pagination);
        setConfirmationLetterError("");
      })
      .catch((requestError) => {
        if (!mounted) return;
        if (requestError.status === 401) setAccount(null);
        setConfirmationLetterError(requestError.message);
      });

    return () => {
      mounted = false;
    };
  }, [account, refreshAdminConfirmationLetters]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const data = await request("/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify(loginForm),
      });
      setAccount(data.account);
      setLoginForm({ email: "", password: "" });
      setNotice("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const sendOwnerResetCode = async () => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const data = await request("/api/admin/auth/owner/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: resetForm.email }),
      });
      setNotice(data.message);
      setAuthView("reset");
      setResetForm((currentForm) => ({ ...currentForm, code: "" }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const requestResetCode = async (event) => {
    event.preventDefault();
    await sendOwnerResetCode();
  };

  const resetOwnerPassword = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const data = await request("/api/admin/auth/owner/reset-password", {
        method: "POST",
        body: JSON.stringify(resetForm),
      });
      setNotice(data.message);
      setAuthView("login");
      setResetForm({ email: resetForm.email, code: "", password: "" });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    setSaving(true);
    try {
      await request("/api/admin/auth/logout", { method: "POST" });
      setAccount(null);
      setProjects([]);
      setCertificates([]);
      setAdmins([]);
      setNotice("You have been signed out.");
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const saveProject = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...projectForm,
        screenshots: projectForm.screenshots
          .split(/\r?\n/)
          .map((url) => url.trim())
          .filter(Boolean),
      };
      await request(
        editingProjectId
          ? `/api/admin/projects/${editingProjectId}`
          : "/api/admin/projects",
        {
        method: editingProjectId ? "PATCH" : "POST",
        body: JSON.stringify(payload),
        },
      );
      notifyLiveContentUpdated("projects");
      const wasEditing = Boolean(editingProjectId);
      const data = await getAdminProjects(
        wasEditing ? projectPagination.page : 1,
        projectPagination.pageSize,
      );
      setProjects(data.projects);
      setProjectPagination(data.pagination);
      setProjectForm(emptyProject);
      setEditingProjectId("");
      setActiveModal("");
      setNotice(wasEditing ? "Project updated." : "Project added.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const changeProjectPage = async (
    page,
    pageSize = projectPagination.pageSize,
  ) => {
    setProjectPageLoading(true);
    setError("");
    try {
      const data = await getAdminProjects(page, pageSize);
      setProjects(data.projects);
      setProjectPagination(data.pagination);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setProjectPageLoading(false);
    }
  };

  const saveCertificate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await request("/api/admin/certificates", {
        method: "POST",
        body: JSON.stringify(certificateForm),
      });
      setCertificateForm(emptyCertificate);
      const data = await getAdminCertificates(1, certificatePagination.pageSize);
      setCertificates(data.certificates);
      setCertificatePagination(data.pagination);
      setActiveModal("");
      setNotice("Certificate added and available for verification.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const updateCertificate = async (certificate, status) => {
    setSaving(true);
    setError("");
    try {
      await request(`/api/admin/certificates/${certificate._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      const data = await getAdminCertificates(
        certificatePagination.page,
        certificatePagination.pageSize,
      );
      setCertificates(data.certificates);
      setCertificatePagination(data.pagination);
      setNotice(`Certificate ${status === "active" ? "activated" : "revoked"}.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const changeCertificatePage = async (
    page,
    pageSize = certificatePagination.pageSize,
  ) => {
    setCertificatePageLoading(true);
    setError("");
    try {
      const data = await getAdminCertificates(page, pageSize);
      setCertificates(data.certificates);
      setCertificatePagination(data.pagination);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCertificatePageLoading(false);
    }
  };

  const saveConfirmationLetter = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await request("/api/admin/confirmation-letters", {
        method: "POST",
        body: JSON.stringify(confirmationLetterForm),
      });
      setConfirmationLetterForm(emptyConfirmationLetter);
      const data = await refreshAdminConfirmationLetters(
        1,
        confirmationLetterPagination.pageSize,
      );
      setConfirmationLetters(data.confirmationLetters);
      setConfirmationLetterPagination(data.pagination);
      setActiveModal("confirmationLetters");
      setNotice("Confirmation letter added and available for verification.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const updateConfirmationLetter = async (confirmationLetter, status) => {
    setSaving(true);
    setError("");
    try {
      await request(
        `/api/admin/confirmation-letters/${confirmationLetter._id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
      );
      const data = await refreshAdminConfirmationLetters(
        confirmationLetterPagination.page,
        confirmationLetterPagination.pageSize,
      );
      setConfirmationLetters(data.confirmationLetters);
      setConfirmationLetterPagination(data.pagination);
      setNotice(`Confirmation letter ${status === "active" ? "activated" : "revoked"}.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const changeConfirmationLetterPage = async (
    page,
    pageSize = confirmationLetterPagination.pageSize,
  ) => {
    setConfirmationLetterPageLoading(true);
    setConfirmationLetterError("");
    try {
      const data = await refreshAdminConfirmationLetters(page, pageSize);
      setConfirmationLetters(data.confirmationLetters);
      setConfirmationLetterPagination(data.pagination);
    } catch (requestError) {
      setConfirmationLetterError(requestError.message);
    } finally {
      setConfirmationLetterPageLoading(false);
    }
  };

  const loadContacts = async (
    page = contactPagination.page,
    pageSize = contactPagination.pageSize,
  ) => {
    setContactPageLoading(true);
    setError("");
    try {
      const data = await request(
        `/api/admin/contacts?page=${page}&pageSize=${pageSize}`,
      );
      setContacts(data.contacts);
      setContactPagination(data.pagination);
      setContactCounts(data.counts);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setContactPageLoading(false);
    }
  };

  const openContactInbox = () => {
    setSelectedContact(null);
    setError("");
    setActiveModal("contacts");
    loadContacts(1, contactPagination.pageSize);
  };

  const updateContactStatus = async (contact, status) => {
    setSaving(true);
    setError("");
    try {
      const data = await request(
        `/api/admin/contacts/${encodeURIComponent(contact._id)}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
      );
      setContacts((current) =>
        current.map((item) =>
          item._id === data.contact._id ? data.contact : item,
        ),
      );
      setSelectedContact((current) =>
        current?._id === data.contact._id ? data.contact : current,
      );
      const refreshed = await request(
        `/api/admin/contacts?page=${contactPagination.page}&pageSize=${contactPagination.pageSize}`,
      );
      setContacts(refreshed.contacts);
      setContactPagination(refreshed.pagination);
      setContactCounts(refreshed.counts);
      setNotice(`Enquiry marked ${contactStatusLabels[status].toLowerCase()}.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const uploadProjectScreenshots = async (event) => {
    const input = event.currentTarget;
    const files = Array.from(input.files || []);
    input.value = "";
    if (!files.length) return;

    if (files.length + projectScreenshotUrls.length > 20) {
      setError("A project can have up to 20 screenshots in total.");
      return;
    }
    if (files.some((file) => file.size > 8 * 1024 * 1024)) {
      setError("Each screenshot must be 8 MB or smaller.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("screenshots", file));
      const data = await request("/api/admin/uploads/project-screenshots", {
        method: "POST",
        body: formData,
      });
      setProjectForm((current) => ({
        ...current,
        screenshots: [
          ...current.screenshots.split(/\r?\n/).map((url) => url.trim()).filter(Boolean),
          ...data.images,
        ].join("\n"),
      }));
      setNotice(`${data.images.length} screenshot${data.images.length === 1 ? "" : "s"} uploaded to Cloudinary.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const removeProjectScreenshot = (indexToRemove) => {
    setProjectForm((current) => ({
      ...current,
      screenshots: current.screenshots
        .split(/\r?\n/)
        .map((url) => url.trim())
        .filter(Boolean)
        .filter((_, index) => index !== indexToRemove)
        .join("\n"),
    }));
  };

  const updateProject = async (project, fields) => {
    setSaving(true);
    setError("");
    try {
      await request(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        body: JSON.stringify(fields),
      });
      notifyLiveContentUpdated("projects");
      const data = await getAdminProjects(
        projectPagination.page,
        projectPagination.pageSize,
      );
      setProjects(data.projects);
      setProjectPagination(data.pagination);
      setNotice(fields.isPublished ? "Project published." : "Project hidden.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const editProject = (project) => {
    setProjectForm({
      category: project.category,
      tag: project.tag,
      title: project.title,
      problem: project.problem,
      solution: project.solution,
      result: project.result,
      location: project.location,
      link: project.link || "",
      screenshots: (project.screenshots || []).join("\n"),
      status: project.status,
    });
    setEditingProjectId(project.id);
    setActiveModal("project");
  };

  const deleteProject = async (project) => {
    if (!window.confirm(`Delete "${project.title}" from the website?`)) return;

    setSaving(true);
    setError("");
    try {
      await request(`/api/admin/projects/${project.id}`, { method: "DELETE" });
      notifyLiveContentUpdated("projects");
      const data = await getAdminProjects(
        projectPagination.page,
        projectPagination.pageSize,
      );
      setProjects(data.projects);
      setProjectPagination(data.pagination);
      setNotice("Project deleted.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const saveOffer = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...offer,
        startsAt: offer.startsAt ? new Date(offer.startsAt).toISOString() : null,
        endsAt: offer.endsAt ? new Date(offer.endsAt).toISOString() : null,
      };
      const data = await request("/api/admin/offer", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setOffer({
        ...emptyOffer,
        ...data.offer,
        startsAt: asLocalDateTime(data.offer.startsAt),
        endsAt: asLocalDateTime(data.offer.endsAt),
      });
      notifyLiveContentUpdated("offer");
      setActiveModal("");
      setNotice("Service offer saved.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const updateHomeReview = (index, field, value) => {
    setHomeReviews((current) =>
      current.map((review, reviewIndex) =>
        reviewIndex === index ? { ...review, [field]: value } : review,
      ),
    );
  };

  const addHomeReview = () => {
    setHomeReviews((current) =>
      current.length < 12 ? [...current, createEmptyHomeReview()] : current,
    );
  };

  const deleteHomeReview = (reviewId) => {
    setHomeReviews((current) =>
      current.filter((review) => review.id !== reviewId),
    );
  };

  const saveHomeReviews = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const data = await request("/api/admin/home-reviews", {
        method: "PUT",
        body: JSON.stringify({ reviews: homeReviews }),
      });
      setHomeReviews(data.reviews);
      notifyLiveContentUpdated("home-reviews");
      setActiveModal("");
      setNotice("Homepage reviews saved and published.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const updateHomeStat = (index, field, value) => {
    setHomeStats((current) =>
      current.map((stat, statIndex) =>
        statIndex === index ? { ...stat, [field]: value } : stat,
      ),
    );
  };

  const saveHomeStats = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const data = await request("/api/admin/home-stats", {
        method: "PUT",
        body: JSON.stringify({ stats: homeStats }),
      });
      setHomeStats(data.stats);
      notifyLiveContentUpdated("home-stats");
      setActiveModal("");
      setNotice("Homepage statistics saved and published.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const saveTrainingCourse = async (event) => {
    event.preventDefault();
    const modules = parseCourseModules(trainingCourseForm.modules);
    if (!modules) {
      setError("Enter each module as a heading followed by at least one “- topic” line, and separate modules with a blank line.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        title: trainingCourseForm.title,
        trackGroup: trainingCourseForm.trackGroup,
        trackLabel: trainingCourseForm.trackLabel,
        summary: trainingCourseForm.summary,
        skillsPreview: parseCourseLines(trainingCourseForm.skillsPreview),
        duration: trainingCourseForm.duration,
        level: trainingCourseForm.level,
        mode: trainingCourseForm.mode,
        commitment: trainingCourseForm.commitment,
        price: trainingCourseForm.price,
        audience: parseCourseLines(trainingCourseForm.audience),
        notFor: parseCourseLines(trainingCourseForm.notFor),
        modules,
        projects: parseCourseLines(trainingCourseForm.projects),
        teachingMethod: parseCourseLines(trainingCourseForm.teachingMethod),
        schedule: {
          sessionsPerWeek: Number(trainingCourseForm.sessionsPerWeek),
          sessionDuration: trainingCourseForm.sessionDuration,
          recordings: trainingCourseForm.recordings,
        },
        isActive: trainingCourseForm.isActive,
      };
      const data = await request(
        `/api/admin/courses/${encodeURIComponent(editingTrainingCourseId)}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
      );
      setTrainingCourses((current) =>
        current.map((course) => (course.id === data.course.id ? data.course : course)),
      );
      notifyLiveContentUpdated("training-courses");
      setActiveModal("trainingCourses");
      setNotice(`“${data.course.title}” saved and published.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteTrainingCourse = async (event) => {
    event.preventDefault();
    if (
      !deletingTrainingCourseId ||
      trainingCourseDeleteConfirmation !== "DELETE"
    ) {
      return;
    }

    const course = trainingCourses.find(
      (item) => item.id === deletingTrainingCourseId,
    );
    setSaving(true);
    setError("");
    try {
      await request(
        `/api/admin/courses/${encodeURIComponent(deletingTrainingCourseId)}`,
        { method: "DELETE" },
      );
      setTrainingCourses((current) =>
        current.filter((item) => item.id !== deletingTrainingCourseId),
      );
      notifyLiveContentUpdated("training-courses");
      setDeletingTrainingCourseId("");
      setTrainingCourseDeleteConfirmation("");
      setNotice(`“${course?.title || "Course"}” deleted from Skill Lab.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const saveFAQ = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...faqForm,
        answer: faqForm.answer.split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
      };
      const data = await request(
        editingFAQId
          ? `/api/admin/faqs/${encodeURIComponent(editingFAQId)}`
          : "/api/admin/faqs",
        {
          method: editingFAQId ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        },
      );
      const nextFAQs = editingFAQId
        ? faqs.map((faq) => (faq.id === data.faq.id ? data.faq : faq))
        : [...faqs, data.faq].sort((left, right) => left.sortOrder - right.sortOrder);
      setFAQs(nextFAQs);
      notifyLiveContentUpdated("faqs");
      setFAQForm(emptyFAQ);
      setEditingFAQId("");
      setActiveModal("faqManager");
      setNotice(editingFAQId ? "FAQ updated." : "FAQ added.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const editFAQ = (faq) => {
    setFAQForm({
      question: faq.question,
      answer: faq.answer.join("\n"),
      isPublished: faq.isPublished,
    });
    setEditingFAQId(faq.id);
    setError("");
    setActiveModal("faqForm");
  };

  const toggleFAQVisibility = async (faq) => {
    setSaving(true);
    setError("");
    try {
      const data = await request(`/api/admin/faqs/${encodeURIComponent(faq.id)}`, {
        method: "PATCH",
        body: JSON.stringify({ isPublished: !faq.isPublished }),
      });
      setFAQs((current) =>
        current.map((item) => (item.id === data.faq.id ? data.faq : item)),
      );
      notifyLiveContentUpdated("faqs");
      setNotice(`FAQ ${data.faq.isPublished ? "published" : "hidden"}.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const reorderFAQ = async (faq, direction) => {
    const index = faqs.findIndex((item) => item.id === faq.id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= faqs.length) return;

    const reordered = [...faqs];
    [reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[index],
    ];
    setSaving(true);
    setError("");
    try {
      const data = await request("/api/admin/faqs/reorder", {
        method: "PATCH",
        body: JSON.stringify({ ids: reordered.map((item) => item.id) }),
      });
      setFAQs(data.faqs);
      notifyLiveContentUpdated("faqs");
      setNotice("FAQ order updated.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteFAQ = async (faq) => {
    if (!window.confirm(`Delete the FAQ "${faq.question}"?`)) return;
    setSaving(true);
    setError("");
    try {
      await request(`/api/admin/faqs/${encodeURIComponent(faq.id)}`, {
        method: "DELETE",
      });
      const data = await request("/api/admin/faqs");
      setFAQs(data.faqs);
      notifyLiveContentUpdated("faqs");
      setNotice("FAQ deleted.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const refreshServiceCatalog = async () => {
    const data = await getAdminServiceCatalog();
    setServiceCatalog({
      services: data.services,
      packageCategories: data.packageCategories,
    });
    setSelectedCatalogCategoryId((current) =>
      data.packageCategories.some((item) => item.id === current)
        ? current
        :         data.packageCategories[0]?.id || "",
    );
  };

  const saveCatalogService = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...serviceForm,
        points: serviceForm.points.split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
      };
      await request(
        editingServiceId
          ? `/api/admin/service-catalog/services/${encodeURIComponent(editingServiceId)}`
          : "/api/admin/service-catalog/services",
        {
          method: editingServiceId ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        },
      );
      notifyLiveContentUpdated("service-catalog");
      await refreshServiceCatalog();
      setActiveModal("catalog");
      setNotice(editingServiceId ? "Service updated." : "Service added.");
      setEditingServiceId("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleCatalogService = async (service) => {
    setSaving(true);
    setError("");
    try {
      await request(
        `/api/admin/service-catalog/services/${encodeURIComponent(service.id)}`,
        {
          method: "PATCH",
          body: JSON.stringify({ isActive: !service.isActive }),
        },
      );
      notifyLiveContentUpdated("service-catalog");
      await refreshServiceCatalog();
      setNotice(`Service ${service.isActive ? "hidden" : "shown"} on the website.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const saveServiceCategory = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const data = await request(
        editingServiceCategoryId
          ? `/api/admin/service-catalog/categories/${encodeURIComponent(editingServiceCategoryId)}`
          : "/api/admin/service-catalog/categories",
        {
          method: editingServiceCategoryId ? "PATCH" : "POST",
          body: JSON.stringify(serviceCategoryForm),
        },
      );
      notifyLiveContentUpdated("service-catalog");
      await refreshServiceCatalog();
      if (data.category?.id) setSelectedCatalogCategoryId(data.category.id);
      setActiveModal("catalog");
      setNotice(editingServiceCategoryId ? "Package category updated." : "Package category added.");
      setEditingServiceCategoryId("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleServiceCategory = async (category) => {
    setSaving(true);
    setError("");
    try {
      await request(
        `/api/admin/service-catalog/categories/${encodeURIComponent(category.id)}`,
        {
          method: "PATCH",
          body: JSON.stringify({ isActive: !category.isActive }),
        },
      );
      notifyLiveContentUpdated("service-catalog");
      await refreshServiceCatalog();
      setNotice(`Package category ${category.isActive ? "hidden" : "shown"} on the website.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const savePackageTier = async (event) => {
    event.preventDefault();
    if (!selectedCatalogCategoryId) {
      setError("Choose a package category first.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...packageTierForm,
        features: packageTierForm.features.split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
      };
      const categoryId = encodeURIComponent(selectedCatalogCategoryId);
      await request(
        editingPackageTierId
          ? `/api/admin/service-catalog/categories/${categoryId}/packages/${encodeURIComponent(editingPackageTierId)}`
          : `/api/admin/service-catalog/categories/${categoryId}/packages`,
        {
          method: editingPackageTierId ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        },
      );
      notifyLiveContentUpdated("service-catalog");
      await refreshServiceCatalog();
      setActiveModal("catalog");
      setNotice(editingPackageTierId ? "Package updated." : "Package added.");
      setEditingPackageTierId("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const togglePackageTier = async (tier) => {
    setSaving(true);
    setError("");
    try {
      const categoryId = encodeURIComponent(selectedCatalogCategoryId);
      await request(
        `/api/admin/service-catalog/categories/${categoryId}/packages/${encodeURIComponent(tier.id)}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            name: tier.name,
            price: tier.price,
            summary: tier.summary,
            timeline: tier.timeline,
            features: tier.features,
            isActive: !tier.isActive,
          }),
        },
      );
      await refreshServiceCatalog();
      setNotice(`Package ${tier.isActive ? "hidden" : "shown"} on the website.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteOffer = async () => {
    if (offerDeleteConfirmation !== "DELETE") return;

    setSaving(true);
    setError("");
    try {
      await request("/api/admin/offer", { method: "DELETE" });
      setOffer(emptyOffer);
      notifyLiveContentUpdated("offer");
      setOfferDeleteConfirmation("");
      setShowOfferDeleteConfirmation(false);
      setActiveModal("");
      setNotice("Service offer deleted.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const createAdmin = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await request("/api/admin/admins", {
        method: "POST",
        body: JSON.stringify(adminForm),
      });
      setAdminForm({ email: "", password: "" });
      setAdmins((await request("/api/admin/admins")).admins);
      setActiveModal("");
      setNotice("Admin account created.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const changeAdminPassword = async (admin) => {
    setPasswordAdmin(admin);
    setPasswordForm("");
    setError("");
    setActiveModal("adminPassword");
  };

  const saveAdminPassword = async (event) => {
    event.preventDefault();
    if (!passwordAdmin) return;
    setSaving(true);
    setError("");
    try {
      await request(`/api/admin/admins/${passwordAdmin.id}/password`, {
        method: "PATCH",
        body: JSON.stringify({ password: passwordForm }),
      });
      setActiveModal("");
      setPasswordAdmin(null);
      setPasswordForm("");
      setNotice(`Password updated for ${passwordAdmin.email}; their sessions were revoked.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    if (saving) return;
    setActiveModal("");
    setEditingProjectId("");
    setPasswordAdmin(null);
    setDeletingAdminId("");
    setAdminDeleteConfirmation("");
    setOfferDeleteConfirmation("");
    setShowOfferDeleteConfirmation(false);
    setError("");
  };

  useEffect(() => {
    if (!activeModal) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) {
        setActiveModal("");
        setEditingProjectId("");
        setPasswordAdmin(null);
        setDeletingAdminId("");
        setAdminDeleteConfirmation("");
        setError("");
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModal, saving]);

  const updateAdminStatus = async (admin) => {
    setSaving(true);
    setError("");
    try {
      await request(`/api/admin/admins/${admin.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !admin.isActive }),
      });
      setAdmins((await request("/api/admin/admins")).admins);
      setNotice(`Admin account ${admin.isActive ? "disabled" : "enabled"}.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteAdmin = async (admin) => {
    if (
      deletingAdminId !== admin.id ||
      adminDeleteConfirmation !== "DELETE"
    ) {
      return;
    }
    setSaving(true);
    setError("");
    try {
      await request(`/api/admin/admins/${admin.id}`, { method: "DELETE" });
      setAdmins((current) => current.filter((item) => item.id !== admin.id));
      setDeletingAdminId("");
      setAdminDeleteConfirmation("");
      setNotice("Admin account removed.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (checkingSession) {
    return <main className={styles.adminPage}><p className={styles.loading}>Checking admin session…</p></main>;
  }

  if (!account) {
    return (
      <main className={styles.adminPage}>
        <section className={styles.authCard}>
          <div className={styles.adminBrand}>
            <span className={styles.brandIcon}><FiShield aria-hidden="true" /></span>
            <span>Private admin access</span>
          </div>
          {authView === "setup" && setupRequired && (
            <>
              <h1>Set up owner account</h1>
              <p className={styles.formIntro}>Create the first owner account once. The password is securely hashed and stored in the database; it is not saved in the environment file.</p>
              <p className={styles.warningMessage} role="note">Use the exact OWNER_EMAIL and OWNER_BOOTSTRAP_CODE from the server environment. This setup is available only until the first owner account is created.</p>
              <form className={styles.adminForm} onSubmit={bootstrapOwner}>
                <label>Owner email<input type="email" autoComplete="username" required value={setupForm.email} onChange={(event) => setSetupForm({ ...setupForm, email: event.target.value })} /></label>
                <label>One-time setup code<input type="password" autoComplete="off" required value={setupForm.code} onChange={(event) => setSetupForm({ ...setupForm, code: event.target.value })} /></label>
                <label>Create password<input type="password" autoComplete="new-password" minLength={12} maxLength={72} required value={setupForm.password} onChange={(event) => setSetupForm({ ...setupForm, password: event.target.value })} /></label>
                <button className={styles.primaryButton} disabled={saving}>{saving ? "Creating owner account…" : "Create owner account"}</button>
              </form>
            </>
          )}
          {authView === "login" && (
            <>
              <h1>Sign in</h1>
              <p className={styles.formIntro}>Use an account created by the owner.</p>
              <form className={styles.adminForm} onSubmit={handleLogin}>
                <label>Email<input type="email" autoComplete="username" required value={loginForm.email} onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })} /></label>
                <label>Password<input type="password" autoComplete="current-password" required value={loginForm.password} onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })} /></label>
                <button className={styles.primaryButton} disabled={saving}>{saving ? "Signing in…" : "Sign in"}</button>
              </form>
              <button className={styles.textButton} onClick={() => { setAuthView("forgot"); setError(""); setNotice(""); }}>Forgot owner password?</button>
            </>
          )}
          {authView === "forgot" && (
            <>
              <h1>Owner password recovery</h1>
              <p className={styles.formIntro}>A one-time code can only be sent to the registered, active owner account.</p>
              <p className={styles.warningMessage} role="note">Before continuing, check that this email is already registered as the owner email in the system. It must exactly match the server’s OWNER_EMAIL setting. Admin accounts cannot use owner password recovery.</p>
              <form className={styles.adminForm} onSubmit={requestResetCode}>
                <label>Owner email<input type="email" autoComplete="email" required value={resetForm.email} onChange={(event) => setResetForm({ ...resetForm, email: event.target.value })} /></label>
                <button className={styles.primaryButton} disabled={saving}>{saving ? "Sending code…" : "Send verification code"}</button>
              </form>
              <button className={styles.textButton} onClick={() => { setAuthView("login"); setError(""); setNotice(""); }}>Back to sign in</button>
            </>
          )}
          {authView === "reset" && (
            <>
              <h1>Verify and reset</h1>
              <p className={styles.formIntro}>Enter the 6-digit code sent to the configured owner email.</p>
              <form className={styles.adminForm} onSubmit={resetOwnerPassword}>
                <label>Owner email<input type="email" autoComplete="email" required value={resetForm.email} onChange={(event) => setResetForm({ ...resetForm, email: event.target.value })} /></label>
                <label>Verification code<input inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={resetForm.code} onChange={(event) => setResetForm({ ...resetForm, code: event.target.value })} /></label>
                <button type="button" className={styles.textButton} onClick={sendOwnerResetCode} disabled={saving}>{saving ? "Sending code…" : "Resend verification code"}</button>
                <label>New password<input type="password" autoComplete="new-password" minLength={12} maxLength={72} required value={resetForm.password} onChange={(event) => setResetForm({ ...resetForm, password: event.target.value })} /></label>
                <button className={styles.primaryButton} disabled={saving}>{saving ? "Updating password…" : "Verify code and update password"}</button>
              </form>
              <button className={styles.textButton} onClick={() => { setAuthView("login"); setError(""); }}>Back to sign in</button>
            </>
          )}
          {error && !activeModal && <p className={styles.errorMessage} role="alert">{error}</p>}
          {notice && <p className={styles.successMessage} role="status">{notice}</p>}
          <p className={styles.securityNote}>No public registration. Admin accounts are created and managed by the owner.</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.adminPage}>
      <div className={styles.dashboard}>
        <header className={styles.dashboardHeader}>
          <div>
            <span className={styles.adminBrand}><FiShield aria-hidden="true" /> Admin panel</span>
            <h1>Website management</h1>
            <p>{account.email} <span className={styles.roleBadge}>{account.role}</span></p>
          </div>
          <button className={styles.secondaryButton} onClick={logout} disabled={saving}><FiLogOut aria-hidden="true" /> Sign out</button>
        </header>

        {error && <p className={styles.errorMessage} role="alert">{error}</p>}
        {notice && <p className={styles.successMessage} role="status">{notice}</p>}

        <div className={styles.dashboardGrid}>
          <section className={styles.panelCard}>
            <div className={styles.panelHeading}>
              <div><span className={styles.panelEyebrow}>Contact</span><h2>Enquiries inbox</h2></div>
              <FiRefreshCw aria-hidden="true" />
            </div>
            <p className={styles.formIntro}>
              Review contact form submissions, open full details, and keep each enquiry’s status up to date.
            </p>
            <div className={styles.enquiryStatusSummary}>
              <span><strong>{contactCounts.new}</strong> New</span>
              <span><strong>{contactCounts.inProgress}</strong> In progress</span>
              <span><strong>{contactCounts.done}</strong> Done</span>
            </div>
            <button
              className={styles.primaryButton}
              onClick={openContactInbox}
              disabled={saving || contactPageLoading}
            >
              View enquiries ({contactPagination.total})
            </button>
          </section>

          <section className={styles.panelCard}>
            <div className={styles.panelHeading}>
              <div><span className={styles.panelEyebrow}>Website content</span><h2>FAQs</h2></div>
              <FiRefreshCw aria-hidden="true" />
            </div>
            <p className={styles.formIntro}>
              Add, edit, reorder, and publish or hide the questions visitors see.
            </p>
            <p className={styles.offerSummary}>
              <strong>
                {faqsLoading
                  ? "Loading FAQs…"
                  : `${faqs.length} FAQs · ${faqs.filter((faq) => faq.isPublished).length} published`}
              </strong>
              <span>Changes appear on public pages automatically.</span>
            </p>
            {faqError && <p className={styles.errorMessage} role="alert">{faqError}</p>}
            <button
              className={styles.primaryButton}
              onClick={openFAQManager}
              disabled={saving || faqsLoading}
            >
              {faqsLoading ? "Loading FAQs…" : "Manage FAQs"}
            </button>
          </section>

          <section className={styles.panelCard}>
            <div className={styles.panelHeading}>
              <div><span className={styles.panelEyebrow}>Homepage</span><h2>Statistics</h2></div>
              <FiRefreshCw aria-hidden="true" />
            </div>
            <p className={styles.formIntro}>
              Update the numbers and labels shown in the homepage statistics section.
            </p>
            <p className={styles.offerSummary}>
              <strong>
                {homeStatsLoading
                  ? "Loading statistics…"
                  : `${homeStats.length} homepage statistics`}
              </strong>
              <span>Changes are published on the homepage automatically.</span>
            </p>
            {homeStatsError && <p className={styles.errorMessage} role="alert">{homeStatsError}</p>}
            <button
              className={styles.primaryButton}
              onClick={openHomeStatsEditor}
              disabled={saving || homeStatsLoading}
            >
              {homeStatsLoading ? "Loading statistics…" : "Edit homepage statistics"}
            </button>
          </section>

          <section className={styles.panelCard}>
            <div className={styles.panelHeading}>
              <div><span className={styles.panelEyebrow}>Homepage</span><h2>Client reviews</h2></div>
              <FiRefreshCw aria-hidden="true" />
            </div>
            <p className={styles.formIntro}>
              Add new client reviews, edit existing ones, or remove reviews from the homepage.
            </p>
            <p className={styles.offerSummary}>
              <strong>{homeReviews.length} homepage reviews</strong>
              <span>Changes are saved and published on the homepage automatically.</span>
            </p>
            <button
              className={styles.primaryButton}
              onClick={() => {
                setError("");
                setActiveModal("homeReviews");
              }}
              disabled={saving}
            >
              Edit homepage reviews
            </button>
          </section>

          <section className={styles.panelCard}>
            <div className={styles.panelHeading}><div><span className={styles.panelEyebrow}>Portfolio</span><h2>Add a project</h2></div><FiPlus aria-hidden="true" /></div>
            <button
              className={styles.primaryButton}
              onClick={() => {
                setProjectForm(emptyProject);
                setEditingProjectId("");
                setError("");
                setActiveModal("project");
              }}
              disabled={saving}
            >
              <FiPlus aria-hidden="true" /> Add project
            </button>
            <div className={styles.recordList}>
              <h3>Projects ({projectPagination.total})</h3>
              <button
                className={styles.secondaryButton}
                onClick={() => setActiveModal("projects")}
              >
                View projects
              </button>
            </div>
          </section>

          <section className={styles.panelCard}>
            <div className={styles.panelHeading}>
              <div><span className={styles.panelEyebrow}>Services page</span><h2>Services & packages</h2></div>
              <FiRefreshCw aria-hidden="true" />
            </div>
            <p className={styles.formIntro}>
              Manage service descriptions, package pricing, timelines, inclusions, and what is visible on the website.
            </p>
            <p className={styles.offerSummary}>
              <strong>{serviceCatalog.services.length} services · {serviceCatalog.packageCategories.reduce((count, category) => count + category.tiers.length, 0)} packages</strong>
              <span>Changes are saved to the database and appear on the Services page.</span>
            </p>
            <button
              className={styles.primaryButton}
              onClick={() => {
                setError("");
                setActiveModal("catalog");
              }}
              disabled={saving}
            >
              Manage services & packages
            </button>
          </section>

          <section className={styles.panelCard}>
            <div className={styles.panelHeading}>
              <div><span className={styles.panelEyebrow}>Skill Lab</span><h2>Training courses</h2></div>
              <FiRefreshCw aria-hidden="true" />
            </div>
            <p className={styles.formIntro}>
              Update course details, pricing, modules, schedule, and availability on the Skill Lab page.
            </p>
            <p className={styles.offerSummary}>
              <strong>
                {trainingCoursesLoading
                  ? "Loading courses…"
                  : `${trainingCourses.length} courses · ${trainingCourses.filter((course) => course.isActive).length} visible`}
              </strong>
              <span>Course changes publish to the Skill Lab and course detail pages.</span>
            </p>
            {trainingCoursesError && <p className={styles.errorMessage} role="alert">{trainingCoursesError}</p>}
            <button
              className={styles.primaryButton}
              onClick={openTrainingCourseManager}
              disabled={saving || trainingCoursesLoading}
            >
              {trainingCoursesLoading ? "Loading courses…" : "Manage training courses"}
            </button>
          </section>

          <section className={styles.panelCard}>
            <div className={styles.panelHeading}><div><span className={styles.panelEyebrow}>Skill Lab</span><h2>Add a certificate</h2></div><FiCheckCircle aria-hidden="true" /></div>
            <button
              className={styles.primaryButton}
              onClick={() => {
                setCertificateForm(emptyCertificate);
                setError("");
                setActiveModal("certificate");
              }}
              disabled={saving}
            >
              <FiPlus aria-hidden="true" /> Add certificate
            </button>
            <div className={styles.recordList}>
              <div className={styles.certificateListHeading}>
                <h3>Certificates ({certificatePagination.total})</h3>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setActiveModal("certificates")}
                >
                  View certificates
                </button>
              </div>
            </div>
          </section>

          <section className={styles.panelCard}>
            <div className={styles.panelHeading}><div><span className={styles.panelEyebrow}>Skill Lab</span><h2>Confirmation letters</h2></div><FiFileText aria-hidden="true" /></div>
            <p className={styles.formIntro}>
              Issue internship confirmation letters and manage whether each record passes public verification.
            </p>
            {confirmationLetterError && <p className={styles.errorMessage} role="alert">{confirmationLetterError}</p>}
            <p className={styles.offerSummary}>
              <strong>{confirmationLetterPagination.total} records</strong>
              <span>{confirmationLetters.filter((letter) => letter.status === "active").length} active on the current page</span>
            </p>
            <div className={styles.formActions}>
              <button
                className={styles.primaryButton}
                onClick={() => {
                  setConfirmationLetterForm(emptyConfirmationLetter);
                  setError("");
                  setActiveModal("confirmationLetterForm");
                }}
                disabled={saving}
              >
                <FiPlus aria-hidden="true" /> Add confirmation letter
              </button>
              <button className={styles.secondaryButton} onClick={openConfirmationLetters} disabled={confirmationLetterPageLoading}>
                {confirmationLetterPageLoading ? "Loading…" : "Manage letters"}
              </button>
            </div>
          </section>

          <section className={styles.panelCard}>
            <div className={styles.panelHeading}><div><span className={styles.panelEyebrow}>Services page</span><h2>Service offer banner</h2></div><FiRefreshCw aria-hidden="true" /></div>
            <p className={styles.formIntro}>An active offer appears on the Services page and in the moving ticker below the header on public pages. Optional dates control when it is visible.</p>
            <button className={styles.secondaryButton} onClick={() => { setOfferDeleteConfirmation(""); setShowOfferDeleteConfirmation(false); setActiveModal("offerDetails"); }} disabled={saving}>View offer details</button>
          </section>

          {account.role === "owner" && (
            <section className={styles.panelCard}>
              <div className={styles.panelHeading}><div><span className={styles.panelEyebrow}>Owner controls</span><h2>Manage admins</h2></div><FiShield aria-hidden="true" /></div>
              <button className={styles.primaryButton} onClick={() => { setAdminForm({ email: "", password: "" }); setError(""); setActiveModal("admin"); }} disabled={saving}><FiPlus aria-hidden="true" /> Add admin</button>
              <div className={styles.recordList}>
                <h3>Admin accounts ({admins.length})</h3>
                <button className={styles.secondaryButton} onClick={() => setActiveModal("admins")}>View admin accounts</button>
              </div>
            </section>
          )}
        </div>
        {activeModal && (
          <div
            className={styles.modalBackdrop}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeModal();
            }}
          >
            <section
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="admin-modal-title"
            >
              <header className={styles.modalHeader}>
                <h2 id="admin-modal-title">
                  {activeModal === "project" && (editingProjectId ? "Edit project" : "Add project")}
                  {activeModal === "projects" && `Projects (${projectPagination.total})`}
                  {activeModal === "contacts" && `Enquiries inbox (${contactPagination.total})`}
                  {activeModal === "contactDetails" && "Enquiry details"}
                  {activeModal === "faqManager" && `Manage FAQs (${faqs.length})`}
                  {activeModal === "faqForm" && (editingFAQId ? "Edit FAQ" : "Add FAQ")}
                  {activeModal === "homeStats" && "Edit homepage statistics"}
                  {activeModal === "homeReviews" && `Edit homepage reviews (${homeReviews.length})`}
                  {activeModal === "trainingCourses" && `Training courses (${trainingCourses.length})`}
                  {activeModal === "trainingCourseForm" && "Edit training course"}
                  {activeModal === "catalog" && "Manage services & packages"}
                  {activeModal === "catalogService" && (editingServiceId ? "Edit service" : "Add service")}
                  {activeModal === "catalogCategory" && (editingServiceCategoryId ? "Edit package category" : "Add package category")}
                  {activeModal === "catalogPackage" && (editingPackageTierId ? "Edit package" : "Add package")}
                  {activeModal === "certificate" && "Add certificate"}
                  {activeModal === "certificates" && `Certificates (${certificatePagination.total})`}
                  {activeModal === "confirmationLetterForm" && "Add confirmation letter"}
                  {activeModal === "confirmationLetters" && `Confirmation letters (${confirmationLetterPagination.total})`}
                  {activeModal === "offer" && "Edit service offer"}
                  {activeModal === "offerDetails" && "Service offer details"}
                  {activeModal === "admin" && "Add admin account"}
                  {activeModal === "admins" && `Admin accounts (${admins.length})`}
                  {activeModal === "adminPassword" && "Change admin password"}
                </h2>
                <button className={styles.modalClose} type="button" onClick={closeModal} disabled={saving} aria-label="Close dialog"><FiX aria-hidden="true" /></button>
              </header>
              <div className={styles.modalContent}>
                {error && <p className={styles.errorMessage} role="alert">{error}</p>}
                {activeModal === "faqManager" && (
                  <div className={styles.catalogManager}>
                    {faqError && <p className={styles.errorMessage} role="alert">{faqError}</p>}
                    <p className={styles.formIntro}>
                      Reorder with the arrow buttons. Hidden FAQs stay saved here and can be published again.
                    </p>
                    <div className={styles.catalogGroupHeading}>
                      <div>
                        <h3>Questions & answers</h3>
                        <p>{faqs.filter((faq) => faq.isPublished).length} of {faqs.length} FAQs are visible publicly.</p>
                      </div>
                      <button
                        type="button"
                        className={styles.smallButton}
                        onClick={() => {
                          setFAQForm(emptyFAQ);
                          setEditingFAQId("");
                          setError("");
                          setActiveModal("faqForm");
                        }}
                        disabled={saving}
                      >
                        <FiPlus aria-hidden="true" /> Add FAQ
                      </button>
                    </div>
                    {faqs.map((faq, index) => (
                      <div className={styles.faqAdminRow} key={faq.id}>
                        <div className={styles.faqAdminText}>
                          <strong>{faq.question}</strong>
                          <span>{faq.isPublished ? "Published" : "Hidden"} · {faq.answer.length} answer {faq.answer.length === 1 ? "paragraph" : "points"}</span>
                        </div>
                        <div className={styles.faqAdminActions}>
                          <button
                            type="button"
                            className={styles.iconButton}
                            aria-label={`Move "${faq.question}" up`}
                            onClick={() => reorderFAQ(faq, -1)}
                            disabled={saving || index === 0}
                          >
                            <FiArrowUp aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className={styles.iconButton}
                            aria-label={`Move "${faq.question}" down`}
                            onClick={() => reorderFAQ(faq, 1)}
                            disabled={saving || index === faqs.length - 1}
                          >
                            <FiArrowDown aria-hidden="true" />
                          </button>
                          <button type="button" className={styles.smallButton} onClick={() => editFAQ(faq)} disabled={saving}>Edit</button>
                          <button type="button" className={styles.smallButton} onClick={() => toggleFAQVisibility(faq)} disabled={saving}>{faq.isPublished ? "Hide" : "Publish"}</button>
                          <button type="button" className={styles.iconButton} aria-label={`Delete FAQ "${faq.question}"`} onClick={() => deleteFAQ(faq)} disabled={saving}><FiTrash2 aria-hidden="true" /></button>
                        </div>
                      </div>
                    ))}
                    {!faqsLoading && !faqs.length && !faqError && <p className={styles.emptyMessage}>No FAQs yet. Add one to show it on the website.</p>}
                  </div>
                )}
                {activeModal === "faqForm" && (
                  <form className={styles.adminForm} onSubmit={saveFAQ}>
                    <label>
                      Question
                      <input
                        required
                        maxLength={240}
                        value={faqForm.question}
                        onChange={(event) => setFAQForm({ ...faqForm, question: event.target.value })}
                      />
                    </label>
                    <label>
                      Answer <span className={styles.fieldHint}>(one answer point per line)</span>
                      <textarea
                        required
                        rows={7}
                        maxLength={20000}
                        value={faqForm.answer}
                        onChange={(event) => setFAQForm({ ...faqForm, answer: event.target.value })}
                      />
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={faqForm.isPublished}
                        onChange={(event) => setFAQForm({ ...faqForm, isPublished: event.target.checked })}
                      />
                      Publish this FAQ on the website
                    </label>
                    <div className={styles.formActions}>
                      <button className={styles.primaryButton} disabled={saving}>{saving ? "Saving…" : editingFAQId ? "Save FAQ" : "Add FAQ"}</button>
                      <button type="button" className={styles.secondaryButton} onClick={() => setActiveModal("faqManager")} disabled={saving}>Back</button>
                    </div>
                  </form>
                )}
                {activeModal === "homeReviews" && (
                  <form className={`${styles.adminForm} ${styles.reviewsEditor}`} onSubmit={saveHomeReviews}>
                    <p className={styles.formIntro}>
                      Add or remove reviews here; changes appear on the homepage after saving. Keep up to 12 reviews.
                    </p>
                    <div className={styles.formActions}>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={addHomeReview}
                        disabled={saving || homeReviews.length >= 12}
                      >
                        <FiPlus aria-hidden="true" /> Add review
                      </button>
                      {homeReviews.length >= 12 && (
                        <span className={styles.fieldHint}>Maximum of 12 reviews reached.</span>
                      )}
                    </div>
                    {homeReviews.map((review, index) => (
                      <fieldset className={styles.reviewEditorCard} key={review.id}>
                        <legend>{review.name || `New review ${index + 1}`}</legend>
                        <div className={styles.formActions}>
                          <button
                            type="button"
                            className={styles.dangerButton}
                            onClick={() => deleteHomeReview(review.id)}
                            disabled={saving}
                          >
                            <FiTrash2 aria-hidden="true" /> Remove review
                          </button>
                        </div>
                        <div className={styles.reviewEditorGrid}>
                          <label>
                            Name
                            <input
                              required
                              maxLength={120}
                              value={review.name}
                              onChange={(event) => updateHomeReview(index, "name", event.target.value)}
                            />
                          </label>
                          <label>
                            Badge
                            <input
                              required
                              maxLength={80}
                              value={review.badge}
                              onChange={(event) => updateHomeReview(index, "badge", event.target.value)}
                            />
                          </label>
                          <label>
                            Reviewer details
                            <input
                              required
                              maxLength={160}
                              value={review.meta}
                              onChange={(event) => updateHomeReview(index, "meta", event.target.value)}
                            />
                          </label>
                          <label>
                            Time label
                            <input
                              required
                              maxLength={80}
                              value={review.timeAgo}
                              onChange={(event) => updateHomeReview(index, "timeAgo", event.target.value)}
                            />
                          </label>
                          <label>
                            Avatar initials
                            <input
                              required
                              maxLength={12}
                              value={review.avatar}
                              onChange={(event) => updateHomeReview(index, "avatar", event.target.value)}
                            />
                          </label>
                          <label>
                            Rating
                            <select
                              required
                              value={review.rating}
                              onChange={(event) => updateHomeReview(index, "rating", Number(event.target.value))}
                            >
                              {[5, 4, 3, 2, 1].map((rating) => (
                                <option key={rating} value={rating}>{rating} stars</option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <label>
                          Review text
                          <textarea
                            required
                            maxLength={2000}
                            value={review.text}
                            onChange={(event) => updateHomeReview(index, "text", event.target.value)}
                          />
                        </label>
                      </fieldset>
                    ))}
                    <div className={styles.formActions}>
                      <button type="button" className={styles.secondaryButton} onClick={closeModal} disabled={saving}>Cancel</button>
                      <button className={styles.primaryButton} disabled={saving}>{saving ? "Saving…" : "Save reviews"}</button>
                    </div>
                  </form>
                )}
                {activeModal === "homeStats" && (
                  <form className={`${styles.adminForm} ${styles.reviewsEditor}`} onSubmit={saveHomeStats}>
                    <p className={styles.formIntro}>
                      Edit the three existing homepage statistics. You cannot add or remove cards.
                    </p>
                    {homeStats.map((stat, index) => (
                      <fieldset className={styles.reviewEditorCard} key={stat.id}>
                        <legend>{stat.label}</legend>
                        <div className={styles.reviewEditorGrid}>
                          <label>
                            Number
                            <input
                              type="number"
                              required
                              min="0"
                              max="1000000"
                              step="1"
                              value={stat.value}
                              onChange={(event) => updateHomeStat(index, "value", Number(event.target.value))}
                            />
                          </label>
                          <label>
                            Label
                            <input
                              required
                              maxLength={80}
                              value={stat.label}
                              onChange={(event) => updateHomeStat(index, "label", event.target.value)}
                            />
                          </label>
                          <label>
                            Suffix
                            <input
                              maxLength={12}
                              value={stat.suffix}
                              onChange={(event) => updateHomeStat(index, "suffix", event.target.value)}
                            />
                          </label>
                        </div>
                      </fieldset>
                    ))}
                    <div className={styles.formActions}>
                      <button type="button" className={styles.secondaryButton} onClick={closeModal} disabled={saving}>Cancel</button>
                      <button className={styles.primaryButton} disabled={saving}>{saving ? "Saving…" : "Save statistics"}</button>
                    </div>
                  </form>
                )}
                {activeModal === "trainingCourses" && (
                  <div className={styles.catalogManager}>
                    {trainingCoursesError && <p className={styles.errorMessage} role="alert">{trainingCoursesError}</p>}
                    <p className={styles.formIntro}>
                      Edit existing course information or hide a course from the public catalog. Course IDs and links stay fixed.
                    </p>
                    {trainingCourses.map((course) => (
                      <div className={styles.faqAdminRow} key={course.id}>
                        <div className={styles.faqAdminText}>
                          <strong>{course.title}</strong>
                          <span>{course.trackGroup} · {course.duration} · {course.price} · {course.isActive ? "Visible" : "Hidden"}</span>
                        </div>
                        <div className={styles.faqAdminActions}>
                          <button
                            type="button"
                            className={styles.smallButton}
                            onClick={() => openTrainingCourseEditor(course)}
                            disabled={saving}
                          >
                            Edit course
                          </button>
                          <button
                            type="button"
                            className={styles.dangerButton}
                            onClick={() => {
                              setDeletingTrainingCourseId(course.id);
                              setTrainingCourseDeleteConfirmation("");
                              setError("");
                            }}
                            disabled={saving || deletingTrainingCourseId === course.id}
                          >
                            Delete
                          </button>
                        </div>
                        {deletingTrainingCourseId === course.id && (
                          <form
                            className={`${styles.offerDeleteConfirmation} ${styles.courseDeleteLayer}`}
                            onSubmit={deleteTrainingCourse}
                          >
                            <p>
                              This removes <strong>{course.title}</strong> from the
                              Skill Lab and keeps it deleted after server restarts.
                              Type <strong>DELETE</strong> to confirm.
                            </p>
                            <label>
                              Type DELETE to confirm
                              <input
                                autoComplete="off"
                                value={trainingCourseDeleteConfirmation}
                                onChange={(event) =>
                                  setTrainingCourseDeleteConfirmation(event.target.value)
                                }
                              />
                            </label>
                            <div className={styles.formActions}>
                              <button
                                type="button"
                                className={styles.secondaryButton}
                                onClick={() => {
                                  setDeletingTrainingCourseId("");
                                  setTrainingCourseDeleteConfirmation("");
                                }}
                                disabled={saving}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className={styles.dangerButton}
                                disabled={
                                  saving ||
                                  trainingCourseDeleteConfirmation !== "DELETE"
                                }
                              >
                                {saving ? "Deleting…" : "Confirm delete"}
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    ))}
                    {!trainingCoursesLoading && !trainingCourses.length && !trainingCoursesError && (
                      <p className={styles.emptyMessage}>No training courses were found.</p>
                    )}
                  </div>
                )}
                {activeModal === "trainingCourseForm" && (
                  <form className={styles.adminForm} onSubmit={saveTrainingCourse}>
                    <p className={styles.formIntro}>
                      Update the public listing and full course detail. Keep the existing course identity and URL unchanged.
                    </p>
                    <div className={styles.formColumns}>
                      <label>
                        Course title
                        <input
                          required
                          maxLength={160}
                          value={trainingCourseForm.title}
                          onChange={(event) => setTrainingCourseForm({ ...trainingCourseForm, title: event.target.value })}
                        />
                      </label>
                      <label>
                        Training track
                        <select
                          value={trainingCourseForm.trackGroup}
                          onChange={(event) => setTrainingCourseForm({ ...trainingCourseForm, trackGroup: event.target.value })}
                        >
                          <option value="45 Days">45 Days</option>
                          <option value="6 Months">6 Months</option>
                        </select>
                      </label>
                    </div>
                    <div className={styles.formColumns}>
                      <label>
                        Track label
                        <input
                          required
                          maxLength={80}
                          value={trainingCourseForm.trackLabel}
                          onChange={(event) => setTrainingCourseForm({ ...trainingCourseForm, trackLabel: event.target.value })}
                        />
                      </label>
                      <label>
                        Price
                        <input
                          required
                          maxLength={80}
                          value={trainingCourseForm.price}
                          onChange={(event) => setTrainingCourseForm({ ...trainingCourseForm, price: event.target.value })}
                        />
                      </label>
                    </div>
                    <label>
                      Course summary
                      <textarea
                        required
                        rows={3}
                        maxLength={1000}
                        value={trainingCourseForm.summary}
                        onChange={(event) => setTrainingCourseForm({ ...trainingCourseForm, summary: event.target.value })}
                      />
                    </label>
                    <div className={styles.formColumns}>
                      <label>
                        Duration
                        <input required maxLength={80} value={trainingCourseForm.duration} onChange={(event) => setTrainingCourseForm({ ...trainingCourseForm, duration: event.target.value })} />
                      </label>
                      <label>
                        Level
                        <input required maxLength={80} value={trainingCourseForm.level} onChange={(event) => setTrainingCourseForm({ ...trainingCourseForm, level: event.target.value })} />
                      </label>
                    </div>
                    <div className={styles.formColumns}>
                      <label>
                        Mode
                        <input required maxLength={80} value={trainingCourseForm.mode} onChange={(event) => setTrainingCourseForm({ ...trainingCourseForm, mode: event.target.value })} />
                      </label>
                      <label>
                        Weekly time commitment
                        <input required maxLength={80} value={trainingCourseForm.commitment} onChange={(event) => setTrainingCourseForm({ ...trainingCourseForm, commitment: event.target.value })} />
                      </label>
                    </div>
                    <label>
                      Skills shown on course card <span className={styles.fieldHint}>(one skill per line; up to 20)</span>
                      <textarea rows={3} maxLength={2000} value={trainingCourseForm.skillsPreview} onChange={(event) => setTrainingCourseForm({ ...trainingCourseForm, skillsPreview: event.target.value })} />
                    </label>
                    <label>
                      Course modules <span className={styles.fieldHint}>(module heading, then “- topic” lines; leave a blank line between modules)</span>
                      <textarea rows={10} required value={trainingCourseForm.modules} onChange={(event) => setTrainingCourseForm({ ...trainingCourseForm, modules: event.target.value })} />
                    </label>
                    <label>
                      Who this course is for <span className={styles.fieldHint}>(one audience per line)</span>
                      <textarea rows={4} value={trainingCourseForm.audience} onChange={(event) => setTrainingCourseForm({ ...trainingCourseForm, audience: event.target.value })} />
                    </label>
                    <label>
                      Not suitable for <span className={styles.fieldHint}>(one item per line)</span>
                      <textarea rows={3} value={trainingCourseForm.notFor} onChange={(event) => setTrainingCourseForm({ ...trainingCourseForm, notFor: event.target.value })} />
                    </label>
                    <label>
                      Projects students will build <span className={styles.fieldHint}>(one project per line)</span>
                      <textarea rows={3} value={trainingCourseForm.projects} onChange={(event) => setTrainingCourseForm({ ...trainingCourseForm, projects: event.target.value })} />
                    </label>
                    <label>
                      Teaching approach <span className={styles.fieldHint}>(one method per line)</span>
                      <textarea rows={3} value={trainingCourseForm.teachingMethod} onChange={(event) => setTrainingCourseForm({ ...trainingCourseForm, teachingMethod: event.target.value })} />
                    </label>
                    <fieldset className={styles.reviewEditorCard}>
                      <legend>Schedule</legend>
                      <div className={styles.reviewEditorGrid}>
                        <label>
                          Sessions per week
                          <input
                            type="number"
                            min="1"
                            max="14"
                            step="1"
                            required
                            value={trainingCourseForm.sessionsPerWeek}
                            onChange={(event) => setTrainingCourseForm({ ...trainingCourseForm, sessionsPerWeek: Number(event.target.value) })}
                          />
                        </label>
                        <label>
                          Session duration
                          <input
                            required
                            maxLength={80}
                            value={trainingCourseForm.sessionDuration}
                            onChange={(event) => setTrainingCourseForm({ ...trainingCourseForm, sessionDuration: event.target.value })}
                          />
                        </label>
                      </div>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={trainingCourseForm.recordings}
                          onChange={(event) => setTrainingCourseForm({ ...trainingCourseForm, recordings: event.target.checked })}
                        />
                        Session recordings are available
                      </label>
                    </fieldset>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={trainingCourseForm.isActive}
                        onChange={(event) => setTrainingCourseForm({ ...trainingCourseForm, isActive: event.target.checked })}
                      />
                      Show this course in the public Skill Lab catalog
                    </label>
                    <div className={styles.formActions}>
                      <button className={styles.primaryButton} disabled={saving}>{saving ? "Saving…" : "Save course"}</button>
                      <button type="button" className={styles.secondaryButton} onClick={() => setActiveModal("trainingCourses")} disabled={saving}>Back to courses</button>
                    </div>
                  </form>
                )}
                {activeModal === "catalog" && (
                  <div className={styles.catalogManager}>
                    <p className={styles.formIntro}>
                      Hidden services, categories, and packages stay saved here and can be shown again at any time.
                    </p>
                    <section className={styles.catalogGroup}>
                      <div className={styles.catalogGroupHeading}>
                        <div>
                          <h3>Package categories</h3>
                          <p>Each category has its own package options and can be shown or hidden.</p>
                        </div>
                        <button
                          className={styles.smallButton}
                          onClick={() => {
                            setServiceCategoryForm(emptyServiceCategory);
                            setEditingServiceCategoryId("");
                            setError("");
                            setActiveModal("catalogCategory");
                          }}
                          disabled={saving}
                        >
                          <FiPlus aria-hidden="true" /> Add category
                        </button>
                      </div>
                      {serviceCatalog.packageCategories.map((category) => (
                        <div className={styles.recordRow} key={category.id}>
                          <button
                            type="button"
                            className={styles.catalogSelectButton}
                            aria-pressed={selectedCatalogCategoryId === category.id}
                            onClick={() => setSelectedCatalogCategoryId(category.id)}
                          >
                            <strong>{category.label}</strong>
                            <span>{category.tiers.length} packages · {category.isActive ? "Visible" : "Hidden"}</span>
                          </button>
                          <div className={styles.rowActions}>
                            <button
                              className={styles.smallButton}
                              onClick={() => {
                                setServiceCategoryForm({ label: category.label, isActive: category.isActive });
                                setEditingServiceCategoryId(category.id);
                                setError("");
                                setActiveModal("catalogCategory");
                              }}
                              disabled={saving}
                            >
                              Edit
                            </button>
                            <button className={styles.smallButton} onClick={() => toggleServiceCategory(category)} disabled={saving}>
                              {category.isActive ? "Hide" : "Show"}
                            </button>
                          </div>
                        </div>
                      ))}
                      {!serviceCatalog.packageCategories.length && (
                        <p className={styles.emptyMessage}>Add a package category to start building service packages.</p>
                      )}
                    </section>

                    {selectedCatalogCategory && (
                      <section className={styles.catalogGroup}>
                        <div className={styles.catalogGroupHeading}>
                          <div>
                            <h3>{selectedCatalogCategory.label} packages</h3>
                            <p>Edit package name, price, description, timeline, inclusions, and visibility.</p>
                          </div>
                          <button
                            className={styles.smallButton}
                            onClick={() => {
                              setPackageTierForm(emptyPackageTier);
                              setEditingPackageTierId("");
                              setError("");
                              setActiveModal("catalogPackage");
                            }}
                            disabled={saving}
                          >
                            <FiPlus aria-hidden="true" /> Add package
                          </button>
                        </div>
                        {selectedCatalogCategory.tiers.map((tier) => (
                          <div className={styles.recordRow} key={tier.id}>
                            <div><strong>{tier.name} · {tier.price}</strong><span>{tier.timeline} · {tier.isActive ? "Visible" : "Hidden"}</span></div>
                            <div className={styles.rowActions}>
                              <button
                                className={styles.smallButton}
                                onClick={() => {
                                  setPackageTierForm({
                                    name: tier.name,
                                    price: tier.price,
                                    summary: tier.summary,
                                    timeline: tier.timeline,
                                    features: tier.features.join("\n"),
                                    isActive: tier.isActive,
                                  });
                                  setEditingPackageTierId(tier.id);
                                  setError("");
                                  setActiveModal("catalogPackage");
                                }}
                                disabled={saving}
                              >
                                Edit
                              </button>
                              <button className={styles.smallButton} onClick={() => togglePackageTier(tier)} disabled={saving}>
                                {tier.isActive ? "Hide" : "Show"}
                              </button>
                            </div>
                          </div>
                        ))}
                        {!selectedCatalogCategory.tiers.length && (
                          <p className={styles.emptyMessage}>No packages in this category yet.</p>
                        )}
                      </section>
                    )}

                    <section className={styles.catalogGroup}>
                      <div className={styles.catalogGroupHeading}>
                        <div>
                          <h3>Service cards</h3>
                          <p>Services shown in the “What we can help you build” section.</p>
                        </div>
                        <button
                          className={styles.smallButton}
                          onClick={() => {
                            setServiceForm({
                              ...emptyService,
                              packageCategory: selectedCatalogCategoryId || serviceCatalog.packageCategories[0]?.id || "",
                            });
                            setEditingServiceId("");
                            setError("");
                            setActiveModal("catalogService");
                          }}
                          disabled={saving || !serviceCatalog.packageCategories.length}
                        >
                          <FiPlus aria-hidden="true" /> Add service
                        </button>
                      </div>
                      {serviceCatalog.services.map((service) => (
                        <div className={styles.recordRow} key={service.id}>
                          <div><strong>{service.title}</strong><span>{serviceCatalog.packageCategories.find((category) => category.id === service.packageCategory)?.label || "Category unavailable"} · {service.isActive ? "Visible" : "Hidden"}</span></div>
                          <div className={styles.rowActions}>
                            <button
                              className={styles.smallButton}
                              onClick={() => {
                                setServiceForm({
                                  ...service,
                                  points: service.points.join("\n"),
                                });
                                setEditingServiceId(service.id);
                                setError("");
                                setActiveModal("catalogService");
                              }}
                              disabled={saving}
                            >
                              Edit
                            </button>
                            <button className={styles.smallButton} onClick={() => toggleCatalogService(service)} disabled={saving}>
                              {service.isActive ? "Hide" : "Show"}
                            </button>
                          </div>
                        </div>
                      ))}
                      {!serviceCatalog.services.length && (
                        <p className={styles.emptyMessage}>No services created yet.</p>
                      )}
                    </section>
                  </div>
                )}
                {activeModal === "catalogService" && (
                  <form className={styles.adminForm} onSubmit={saveCatalogService}>
                    <label>Service name<input required maxLength={100} value={serviceForm.title} onChange={(event) => setServiceForm({ ...serviceForm, title: event.target.value })} /></label>
                    <label>Description<textarea required rows={3} maxLength={500} value={serviceForm.desc} onChange={(event) => setServiceForm({ ...serviceForm, desc: event.target.value })} /></label>
                    <div className={styles.formColumns}>
                      <label>Package category<select required value={serviceForm.packageCategory} onChange={(event) => setServiceForm({ ...serviceForm, packageCategory: event.target.value })}>{serviceCatalog.packageCategories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></label>
                      <label>Card icon<select value={serviceForm.icon} onChange={(event) => setServiceForm({ ...serviceForm, icon: event.target.value })}><option value="FiLayout">Layout</option><option value="FiGlobe">Globe</option><option value="FiMonitor">Monitor</option><option value="FiShoppingBag">Shopping bag</option><option value="FiServer">Server</option><option value="FiActivity">Activity</option></select></label>
                    </div>
                    <label>Service highlights <span className={styles.fieldHint}>(one item per line)</span><textarea rows={5} maxLength={4000} value={serviceForm.points} onChange={(event) => setServiceForm({ ...serviceForm, points: event.target.value })} /></label>
                    <label className={styles.checkboxLabel}><input type="checkbox" checked={serviceForm.isActive} onChange={(event) => setServiceForm({ ...serviceForm, isActive: event.target.checked })} /> Show this service on the website</label>
                    <div className={styles.formActions}>
                      <button className={styles.primaryButton} disabled={saving}>{saving ? "Saving…" : editingServiceId ? "Save service" : "Add service"}</button>
                      <button type="button" className={styles.secondaryButton} onClick={() => setActiveModal("catalog")} disabled={saving}>Back</button>
                    </div>
                  </form>
                )}
                {activeModal === "catalogCategory" && (
                  <form className={styles.adminForm} onSubmit={saveServiceCategory}>
                    <label>Category name<input required maxLength={100} value={serviceCategoryForm.label} onChange={(event) => setServiceCategoryForm({ ...serviceCategoryForm, label: event.target.value })} /></label>
                    <label className={styles.checkboxLabel}><input type="checkbox" checked={serviceCategoryForm.isActive} onChange={(event) => setServiceCategoryForm({ ...serviceCategoryForm, isActive: event.target.checked })} /> Show this category and its active packages on the website</label>
                    <div className={styles.formActions}>
                      <button className={styles.primaryButton} disabled={saving}>{saving ? "Saving…" : editingServiceCategoryId ? "Save category" : "Add category"}</button>
                      <button type="button" className={styles.secondaryButton} onClick={() => setActiveModal("catalog")} disabled={saving}>Back</button>
                    </div>
                  </form>
                )}
                {activeModal === "catalogPackage" && (
                  <form className={styles.adminForm} onSubmit={savePackageTier}>
                    <label>Package name<input required maxLength={80} value={packageTierForm.name} onChange={(event) => setPackageTierForm({ ...packageTierForm, name: event.target.value })} /></label>
                    <label>Price / price range<input required maxLength={80} value={packageTierForm.price} onChange={(event) => setPackageTierForm({ ...packageTierForm, price: event.target.value })} /></label>
                    <label>Summary<textarea required rows={3} maxLength={300} value={packageTierForm.summary} onChange={(event) => setPackageTierForm({ ...packageTierForm, summary: event.target.value })} /></label>
                    <label>Timeline<input required maxLength={120} placeholder="Usually 2–4 weeks" value={packageTierForm.timeline} onChange={(event) => setPackageTierForm({ ...packageTierForm, timeline: event.target.value })} /></label>
                    <label>What's included <span className={styles.fieldHint}>(one feature per line, up to 30)</span><textarea rows={6} value={packageTierForm.features} onChange={(event) => setPackageTierForm({ ...packageTierForm, features: event.target.value })} /></label>
                    <label className={styles.checkboxLabel}><input type="checkbox" checked={packageTierForm.isActive} onChange={(event) => setPackageTierForm({ ...packageTierForm, isActive: event.target.checked })} /> Show this package on the website</label>
                    <div className={styles.formActions}>
                      <button className={styles.primaryButton} disabled={saving}>{saving ? "Saving…" : editingPackageTierId ? "Save package" : "Add package"}</button>
                      <button type="button" className={styles.secondaryButton} onClick={() => setActiveModal("catalog")} disabled={saving}>Back</button>
                    </div>
                  </form>
                )}
                {activeModal === "projects" && (
                  <div className={styles.certificateRecords}>
                    <label className={styles.pageSizeControl}>
                      Show
                      <select
                        value={projectPagination.pageSize}
                        onChange={(event) =>
                          changeProjectPage(1, Number(event.target.value))
                        }
                        disabled={projectPageLoading}
                        aria-label="Projects per page"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                      per page
                    </label>
                    {projects.map((project) => (
                      <div className={styles.recordRow} key={project.id}>
                        <div><strong>{project.title}</strong><span>{project.category} · {project.isPublished ? "Published" : "Hidden"}</span></div>
                        <div className={styles.rowActions}>
                          <button className={styles.smallButton} onClick={() => editProject(project)} disabled={saving}>Edit</button>
                          <button className={styles.smallButton} onClick={() => updateProject(project, { isPublished: !project.isPublished })} disabled={saving}>{project.isPublished ? "Hide" : "Publish"}</button>
                          <button className={styles.iconButton} aria-label={`Delete ${project.title}`} onClick={() => deleteProject(project)} disabled={saving}><FiTrash2 aria-hidden="true" /></button>
                        </div>
                      </div>
                    ))}
                    {!projectPagination.total && <p className={styles.emptyMessage}>No admin-managed projects yet.</p>}
                    {projectPagination.totalPages > 1 && (
                      <div className={styles.pagination} aria-label="Project pages">
                        <button className={styles.smallButton} onClick={() => changeProjectPage(projectPagination.page - 1)} disabled={projectPageLoading || projectPagination.page <= 1}>Previous</button>
                        <span>Page {projectPagination.page} of {projectPagination.totalPages}</span>
                        <button className={styles.smallButton} onClick={() => changeProjectPage(projectPagination.page + 1)} disabled={projectPageLoading || projectPagination.page >= projectPagination.totalPages}>Next</button>
                      </div>
                    )}
                  </div>
                )}
                {activeModal === "contacts" && (
                  <div className={styles.certificateRecords}>
                    <div className={styles.enquiryCounts}>
                      <span><strong>{contactCounts.new}</strong> New</span>
                      <span><strong>{contactCounts.inProgress}</strong> In progress</span>
                      <span><strong>{contactCounts.done}</strong> Done</span>
                    </div>
                    <label className={styles.pageSizeControl}>
                      Show
                      <select
                        value={contactPagination.pageSize}
                        onChange={(event) => loadContacts(1, Number(event.target.value))}
                        disabled={contactPageLoading}
                        aria-label="Enquiries per page"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                      per page
                    </label>
                    {contacts.map((contact) => (
                      <article className={`${styles.recordRow} ${styles.contactRecordRow}`} key={contact._id}>
                        <div className={styles.contactRecordMain}>
                          <strong>{contact.name}</strong>
                          <span>{contact.email}{contact.phone ? ` · ${contact.phone}` : ""}</span>
                          <span className={styles.contactMessagePreview}>{contact.message}</span>
                          <span>{new Date(contact.createdAt).toLocaleString()}</span>
                        </div>
                        <div className={styles.contactRecordActions}>
                          <label className={styles.contactStatusControl}>
                            <span className={styles.visuallyHidden}>Status for {contact.name}</span>
                            <select
                              value={contact.status || "new"}
                              onChange={(event) => updateContactStatus(contact, event.target.value)}
                              disabled={saving}
                            >
                              <option value="new">New</option>
                              <option value="in-progress">In progress</option>
                              <option value="done">Done</option>
                            </select>
                          </label>
                          <button
                            type="button"
                            className={styles.smallButton}
                            onClick={() => {
                              setSelectedContact(contact);
                              setActiveModal("contactDetails");
                            }}
                          >
                            View details
                          </button>
                        </div>
                      </article>
                    ))}
                    {!contactPagination.total && (
                      <p className={styles.emptyMessage}>No contact enquiries have been submitted yet.</p>
                    )}
                    {contactPagination.totalPages > 1 && (
                      <div className={styles.pagination} aria-label="Enquiry pages">
                        <button
                          className={styles.smallButton}
                          onClick={() => loadContacts(contactPagination.page - 1)}
                          disabled={contactPageLoading || contactPagination.page <= 1}
                        >
                          Previous
                        </button>
                        <span>Page {contactPagination.page} of {contactPagination.totalPages}</span>
                        <button
                          className={styles.smallButton}
                          onClick={() => loadContacts(contactPagination.page + 1)}
                          disabled={contactPageLoading || contactPagination.page >= contactPagination.totalPages}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {activeModal === "contactDetails" && selectedContact && (
                  <div className={styles.contactDetails}>
                    <p><strong>Name</strong><span>{selectedContact.name}</span></p>
                    <p><strong>Email</strong><a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a></p>
                    <p><strong>Phone</strong>{selectedContact.phone ? <a href={`tel:${selectedContact.phone}`}>{selectedContact.phone}</a> : <span>Not provided</span>}</p>
                    <p><strong>Submitted</strong><span>{new Date(selectedContact.createdAt).toLocaleString()}</span></p>
                    <label className={styles.contactDetailStatus}>
                      Status
                      <select
                        value={selectedContact.status || "new"}
                        onChange={(event) => updateContactStatus(selectedContact, event.target.value)}
                        disabled={saving}
                      >
                        <option value="new">New</option>
                        <option value="in-progress">In progress</option>
                        <option value="done">Done</option>
                      </select>
                    </label>
                    <div className={styles.contactMessage}>
                      <strong>Message</strong>
                      <p>{selectedContact.message}</p>
                    </div>
                    <div className={styles.formActions}>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={() => setActiveModal("contacts")}
                      >
                        Back to inbox
                      </button>
                    </div>
                  </div>
                )}
                {activeModal === "offerDetails" && (
                  <div className={styles.offerDetails}>
                    <p><strong>Status</strong><span>{offer.isActive ? "Active" : "Hidden"}</span></p>
                    <p><strong>Headline</strong><span>{offer.title || "Not set"}</span></p>
                    <p><strong>Details</strong><span>{offer.description || "Not set"}</span></p>
                    <p><strong>Badge</strong><span>{offer.label || "Not set"}</span></p>
                    <p><strong>Display period</strong><span>{offer.startsAt || offer.endsAt ? `${offer.startsAt || "No start date"} – ${offer.endsAt || "No end date"}` : "No date limits"}</span></p>
                    <div className={styles.formActions}>
                      <button className={styles.primaryButton} onClick={() => { setError(""); setActiveModal("offer"); }}>Edit offer</button>
                      <button
                        className={styles.secondaryButton}
                        type="button"
                        onClick={() => setShowOfferDeleteConfirmation(true)}
                        disabled={saving || showOfferDeleteConfirmation}
                      >
                        Delete offer
                      </button>
                    </div>
                    {showOfferDeleteConfirmation && (
                      <div className={styles.offerDeleteConfirmation}>
                        <p>This permanently removes the offer from the Services page and public ticker. Type <strong>DELETE</strong> to confirm.</p>
                        <label>
                          Type DELETE to confirm
                          <input
                            autoComplete="off"
                            value={offerDeleteConfirmation}
                            onChange={(event) => setOfferDeleteConfirmation(event.target.value)}
                            disabled={saving}
                          />
                        </label>
                        <button
                          className={styles.dangerButton}
                          type="button"
                          onClick={deleteOffer}
                          disabled={saving || offerDeleteConfirmation.trimStart() !== "DELETE"}
                        >
                          {saving ? "Deleting…" : "Confirm delete"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {activeModal === "admins" && (
                  <div className={styles.certificateRecords}>
                    {admins.map((admin) => (
                      <div className={styles.recordRow} key={admin.id}>
                        <div><strong>{admin.email}</strong><span>{admin.isActive ? "Active" : "Disabled"}</span></div>
                        <div className={styles.rowActions}>
                          <button className={styles.smallButton} onClick={() => changeAdminPassword(admin)} disabled={saving}>Change password</button>
                          <button className={styles.smallButton} onClick={() => updateAdminStatus(admin)} disabled={saving}>{admin.isActive ? "Disable" : "Enable"}</button>
                          <button
                            className={styles.iconButton}
                            aria-label={`Remove ${admin.email}`}
                            onClick={() => {
                              setDeletingAdminId(admin.id);
                              setAdminDeleteConfirmation("");
                              setError("");
                            }}
                            disabled={saving || deletingAdminId === admin.id}
                          >
                            <FiTrash2 aria-hidden="true" />
                          </button>
                        </div>
                        {deletingAdminId === admin.id && (
                          <form
                            className={`${styles.offerDeleteConfirmation} ${styles.courseDeleteLayer}`}
                            onSubmit={(event) => {
                              event.preventDefault();
                              deleteAdmin(admin);
                            }}
                          >
                            <p>
                              This permanently removes admin account{" "}
                              <strong>{admin.email}</strong>. Type{" "}
                              <strong>DELETE</strong> to confirm.
                            </p>
                            <label>
                              Type DELETE to confirm
                              <input
                                autoComplete="off"
                                value={adminDeleteConfirmation}
                                onChange={(event) =>
                                  setAdminDeleteConfirmation(event.target.value)
                                }
                              />
                            </label>
                            <div className={styles.formActions}>
                              <button
                                type="button"
                                className={styles.secondaryButton}
                                onClick={() => {
                                  setDeletingAdminId("");
                                  setAdminDeleteConfirmation("");
                                }}
                                disabled={saving}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className={styles.dangerButton}
                                disabled={
                                  saving || adminDeleteConfirmation !== "DELETE"
                                }
                              >
                                {saving ? "Deleting…" : "Confirm delete"}
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    ))}
                    {!admins.length && <p className={styles.emptyMessage}>No admin accounts created yet.</p>}
                  </div>
                )}
                {activeModal === "certificates" && (
                  <div className={styles.certificateRecords}>
                    <label className={styles.pageSizeControl}>
                      Show
                      <select
                        value={certificatePagination.pageSize}
                        onChange={(event) =>
                          changeCertificatePage(1, Number(event.target.value))
                        }
                        disabled={certificatePageLoading}
                        aria-label="Certificates per page"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                      per page
                    </label>
                    {certificates.map((certificate) => (
                      <div className={styles.recordRow} key={certificate._id}>
                        <div><strong>{certificate.studentName}</strong><span>{certificate.certificateNo} · {certificate.status}</span></div>
                        <button className={styles.smallButton} onClick={() => updateCertificate(certificate, certificate.status === "active" ? "revoked" : "active")} disabled={saving}>{certificate.status === "active" ? "Revoke" : "Reactivate"}</button>
                      </div>
                    ))}
                    {!certificatePagination.total && <p className={styles.emptyMessage}>No certificate records found.</p>}
                    {certificatePagination.totalPages > 1 && (
                      <div className={styles.pagination} aria-label="Certificate pages">
                        <button className={styles.smallButton} onClick={() => changeCertificatePage(certificatePagination.page - 1)} disabled={certificatePageLoading || certificatePagination.page <= 1}>Previous</button>
                        <span>Page {certificatePagination.page} of {certificatePagination.totalPages}</span>
                        <button className={styles.smallButton} onClick={() => changeCertificatePage(certificatePagination.page + 1)} disabled={certificatePageLoading || certificatePagination.page >= certificatePagination.totalPages}>Next</button>
                      </div>
                    )}
                  </div>
                )}
                {activeModal === "confirmationLetters" && (
                  <div className={styles.certificateRecords}>
                    {confirmationLetterError && <p className={styles.errorMessage} role="alert">{confirmationLetterError}</p>}
                    <label className={styles.pageSizeControl}>
                      Show
                      <select
                        value={confirmationLetterPagination.pageSize}
                        onChange={(event) =>
                          changeConfirmationLetterPage(1, Number(event.target.value))
                        }
                        disabled={confirmationLetterPageLoading}
                        aria-label="Confirmation letters per page"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                      per page
                    </label>
                    {confirmationLetters.map((letter) => (
                      <div className={styles.recordRow} key={letter._id}>
                        <div>
                          <strong>{letter.candidateName}</strong>
                          <span>{letter.referenceNo} · {letter.programName} · {letter.status}</span>
                        </div>
                        <button
                          type="button"
                          className={styles.smallButton}
                          onClick={() =>
                            updateConfirmationLetter(
                              letter,
                              letter.status === "active" ? "revoked" : "active",
                            )
                          }
                          disabled={saving}
                        >
                          {letter.status === "active" ? "Revoke" : "Reactivate"}
                        </button>
                      </div>
                    ))}
                    {!confirmationLetterPageLoading && !confirmationLetterPagination.total && (
                      <p className={styles.emptyMessage}>No confirmation letters found.</p>
                    )}
                    {confirmationLetterPageLoading && <p className={styles.emptyMessage}>Loading confirmation letters…</p>}
                    {confirmationLetterPagination.totalPages > 1 && (
                      <div className={styles.pagination} aria-label="Confirmation letter pages">
                        <button
                          className={styles.smallButton}
                          onClick={() => changeConfirmationLetterPage(confirmationLetterPagination.page - 1)}
                          disabled={confirmationLetterPageLoading || confirmationLetterPagination.page <= 1}
                        >
                          Previous
                        </button>
                        <span>Page {confirmationLetterPagination.page} of {confirmationLetterPagination.totalPages}</span>
                        <button
                          className={styles.smallButton}
                          onClick={() => changeConfirmationLetterPage(confirmationLetterPagination.page + 1)}
                          disabled={confirmationLetterPageLoading || confirmationLetterPagination.page >= confirmationLetterPagination.totalPages}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {activeModal === "project" && (
                  <>
                    <p className={styles.formIntro}>All project details and screenshots are optional. Upload one or multiple screenshots directly.</p>
                    <form id="project-form" className={styles.adminForm} onSubmit={saveProject}>
                      <label>Project title <span className={styles.fieldHint}>(optional)</span><input maxLength={140} value={projectForm.title} onChange={(event) => setProjectForm({ ...projectForm, title: event.target.value })} /></label>
                      <div className={styles.formColumns}>
                        <label>Category <span className={styles.fieldHint}>(optional)</span><select value={projectForm.category} onChange={(event) => setProjectForm({ ...projectForm, category: event.target.value })}><option value="">Choose category</option><option>Client Project</option><option>Company Product</option></select></label>
                        <label>Project tag <span className={styles.fieldHint}>(optional)</span><input maxLength={80} value={projectForm.tag} onChange={(event) => setProjectForm({ ...projectForm, tag: event.target.value })} /></label>
                      </div>
                      <label>Problem <span className={styles.fieldHint}>(optional)</span><textarea rows={3} value={projectForm.problem} onChange={(event) => setProjectForm({ ...projectForm, problem: event.target.value })} /></label>
                      <label>Solution <span className={styles.fieldHint}>(optional)</span><textarea rows={3} value={projectForm.solution} onChange={(event) => setProjectForm({ ...projectForm, solution: event.target.value })} /></label>
                      <label>Outcome <span className={styles.fieldHint}>(optional)</span><textarea rows={3} value={projectForm.result} onChange={(event) => setProjectForm({ ...projectForm, result: event.target.value })} /></label>
                      <div className={styles.formColumns}>
                        <label>Client / Origin <span className={styles.fieldHint}>(optional)</span><input maxLength={120} value={projectForm.location} onChange={(event) => setProjectForm({ ...projectForm, location: event.target.value })} /></label>
                        <label>Project status <span className={styles.fieldHint}>(optional)</span><input maxLength={80} value={projectForm.status} onChange={(event) => setProjectForm({ ...projectForm, status: event.target.value })} /></label>
                      </div>
                      <label>Project URL <span className={styles.fieldHint}>(optional)</span><input type="url" placeholder="https://" value={projectForm.link} onChange={(event) => setProjectForm({ ...projectForm, link: event.target.value })} /></label>
                      <label>Upload screenshots <span className={styles.fieldHint}>(select multiple JPG, PNG, or WebP files · 8 MB each · 20 total)</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={uploadProjectScreenshots} disabled={saving} /></label>
                      {projectScreenshotUrls.length > 0 && (
                        <div className={styles.projectImageGrid} aria-label="Uploaded project screenshots">
                          {projectScreenshotUrls.map((url, index) => (
                            <div className={styles.projectImagePreview} key={`${url}-${index}`}>
                              <img src={url} alt={`Project screenshot ${index + 1}`} />
                              <button type="button" className={styles.projectImageRemove} onClick={() => removeProjectScreenshot(index)} disabled={saving} aria-label={`Remove screenshot ${index + 1}`}><FiTrash2 aria-hidden="true" /></button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className={styles.formActions}>
                        <button className={styles.primaryButton} disabled={saving}>{saving ? "Saving…" : editingProjectId ? "Save project changes" : "Add project"}</button>
                        <button type="button" className={styles.secondaryButton} onClick={closeModal} disabled={saving}>Cancel</button>
                      </div>
                    </form>
                  </>
                )}
                {activeModal === "certificate" && (
                  <form className={styles.adminForm} onSubmit={saveCertificate}>
                    <label>Student name<input required value={certificateForm.studentName} onChange={(event) => setCertificateForm({ ...certificateForm, studentName: event.target.value })} /></label>
                    <div className={styles.formColumns}>
                      <label>Student ID<input required value={certificateForm.studentId} onChange={(event) => setCertificateForm({ ...certificateForm, studentId: event.target.value })} /></label>
                      <label>Certificate number<input required value={certificateForm.certificateNo} onChange={(event) => setCertificateForm({ ...certificateForm, certificateNo: event.target.value })} /></label>
                    </div>
                    <label>Course<input required value={certificateForm.courseName} onChange={(event) => setCertificateForm({ ...certificateForm, courseName: event.target.value })} /></label>
                    <div className={styles.formColumns}>
                      <label>Course start date<input type="date" required value={certificateForm.courseStartDate} onChange={(event) => setCertificateForm({ ...certificateForm, courseStartDate: event.target.value })} /></label>
                      <label>Course end date<input type="date" required value={certificateForm.courseEndDate} onChange={(event) => setCertificateForm({ ...certificateForm, courseEndDate: event.target.value })} /></label>
                    </div>
                    <label>Issue date<input type="date" value={certificateForm.issuedOn} onChange={(event) => setCertificateForm({ ...certificateForm, issuedOn: event.target.value })} /></label>
                    <div className={styles.formActions}><button className={styles.primaryButton} disabled={saving}>{saving ? "Saving…" : "Add certificate"}</button><button type="button" className={styles.secondaryButton} onClick={closeModal} disabled={saving}>Cancel</button></div>
                  </form>
                )}
                {activeModal === "confirmationLetterForm" && (
                  <form className={styles.adminForm} onSubmit={saveConfirmationLetter}>
                    <p className={styles.formIntro}>
                      The reference number and candidate name are used to verify the letter on the website. Reference numbers must be unique.
                    </p>
                    <div className={styles.formColumns}>
                      <label>Candidate name<input required maxLength={160} value={confirmationLetterForm.candidateName} onChange={(event) => setConfirmationLetterForm({ ...confirmationLetterForm, candidateName: event.target.value })} /></label>
                      <label>Reference number<input required maxLength={100} value={confirmationLetterForm.referenceNo} onChange={(event) => setConfirmationLetterForm({ ...confirmationLetterForm, referenceNo: event.target.value })} /></label>
                    </div>
                    <label>Program name<input required maxLength={160} value={confirmationLetterForm.programName} onChange={(event) => setConfirmationLetterForm({ ...confirmationLetterForm, programName: event.target.value })} /></label>
                    <div className={styles.formColumns}>
                      <label>Technology<input required maxLength={120} value={confirmationLetterForm.technology} onChange={(event) => setConfirmationLetterForm({ ...confirmationLetterForm, technology: event.target.value })} /></label>
                      <label>Duration<input required maxLength={80} placeholder="45 Days" value={confirmationLetterForm.durationLabel} onChange={(event) => setConfirmationLetterForm({ ...confirmationLetterForm, durationLabel: event.target.value })} /></label>
                    </div>
                    <div className={styles.formColumns}>
                      <label>Session year<input type="number" required min={2000} max={2200} value={confirmationLetterForm.sessionYear} onChange={(event) => setConfirmationLetterForm({ ...confirmationLetterForm, sessionYear: event.target.value })} /></label>
                      <label>Supervisor name<input required maxLength={160} value={confirmationLetterForm.supervisorName} onChange={(event) => setConfirmationLetterForm({ ...confirmationLetterForm, supervisorName: event.target.value })} /></label>
                    </div>
                    <label>Issue date<input type="date" required value={confirmationLetterForm.issuedOn} onChange={(event) => setConfirmationLetterForm({ ...confirmationLetterForm, issuedOn: event.target.value })} /></label>
                    <div className={styles.formActions}>
                      <button className={styles.primaryButton} disabled={saving}>{saving ? "Saving…" : "Add confirmation letter"}</button>
                      <button type="button" className={styles.secondaryButton} onClick={closeModal} disabled={saving}>Cancel</button>
                    </div>
                  </form>
                )}
                {activeModal === "offer" && (
                  <form className={styles.adminForm} onSubmit={saveOffer}>
                    <label className={styles.checkboxLabel}><input type="checkbox" checked={offer.isActive} onChange={(event) => setOffer({ ...offer, isActive: event.target.checked })} /> Show offer on the Services page and public-page ticker</label>
                    <label>Offer headline<input maxLength={100} value={offer.title} onChange={(event) => setOffer({ ...offer, title: event.target.value })} /></label>
                    <label>Offer details<input maxLength={300} value={offer.description} onChange={(event) => setOffer({ ...offer, description: event.target.value })} /></label>
                    <label>Badge text<input maxLength={50} placeholder="Limited-time offer" value={offer.label} onChange={(event) => setOffer({ ...offer, label: event.target.value })} /></label>
                    <div className={styles.formColumns}>
                      <label>Starts at<input type="datetime-local" value={offer.startsAt} onChange={(event) => setOffer({ ...offer, startsAt: event.target.value })} /></label>
                      <label>Ends at<input type="datetime-local" value={offer.endsAt} onChange={(event) => setOffer({ ...offer, endsAt: event.target.value })} /></label>
                    </div>
                    <div className={styles.formActions}><button className={styles.primaryButton} disabled={saving}>{saving ? "Saving…" : "Save offer"}</button><button type="button" className={styles.secondaryButton} onClick={closeModal} disabled={saving}>Cancel</button></div>
                  </form>
                )}
                {activeModal === "admin" && (
                  <form className={styles.adminForm} onSubmit={createAdmin}>
                    <label>Admin email<input type="email" required value={adminForm.email} onChange={(event) => setAdminForm({ ...adminForm, email: event.target.value })} /></label>
                    <label>Initial password<input type="password" minLength={12} maxLength={72} required value={adminForm.password} onChange={(event) => setAdminForm({ ...adminForm, password: event.target.value })} /></label>
                    <p className={styles.fieldHint}>Minimum 12 characters. Admins cannot reset their own password; you can change it below.</p>
                    <div className={styles.formActions}><button className={styles.primaryButton} disabled={saving}>{saving ? "Creating…" : "Create admin account"}</button><button type="button" className={styles.secondaryButton} onClick={closeModal} disabled={saving}>Cancel</button></div>
                  </form>
                )}
                {activeModal === "adminPassword" && passwordAdmin && (
                  <form className={styles.adminForm} onSubmit={saveAdminPassword}>
                    <p className={styles.formIntro}>Set a new password for {passwordAdmin.email}. This will sign them out of existing sessions.</p>
                    <label>New password<input type="password" autoComplete="new-password" minLength={12} maxLength={72} required value={passwordForm} onChange={(event) => setPasswordForm(event.target.value)} /></label>
                    <div className={styles.formActions}><button className={styles.primaryButton} disabled={saving}>{saving ? "Updating…" : "Update password"}</button><button type="button" className={styles.secondaryButton} onClick={closeModal} disabled={saving}>Cancel</button></div>
                  </form>
                )}
                {error && <p className={styles.errorMessage} role="alert">{error}</p>}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
};

export default Admin;
