const defaultResume = {
  id: "",
  title: "Untitled Resume",
  templateId: "modern",
  isFresher: false,
  createdAt: "",
  updatedAt: "",

  personalInfo: {
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
  },

  summary: "",

  experience: [
    {
      id: "",
      jobTitle: "",
      company: "",
      employmentType: "full-time",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
  ],

  education: [
    {
      id: "",
      institution: "",
      degree: "",
      fieldOfStudy: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
  ],

  skills: [],

  projects: [
    {
      id: "",
      name: "",
      description: "",
      technologies: [],
      projectUrl: "",
      githubUrl: "",
    },
  ],

  certifications: [
    {
      id: "",
      name: "",
      issuer: "",
      issueDate: "",
      credentialUrl: "",
    },
  ],

  languages: [
    {
      id: "",
      name: "",
      proficiency: "",
    },
  ],

  jobTarget: {
    jobTitle: "",
    company: "",
    jobDescription: "",
  },

  analysis: {
    overallScore: 0,
    atsScore: 0,
    contentScore: 0,
    impactScore: 0,
    keywordScore: 0,
    missingKeywords: [],
    matchedKeywords: [],
    suggestions: [],
  },

  customization: {
    fontFamily: "Inter",
    fontSize: "medium",
    accentColor: "#7c3aed",
    spacing: "normal",
  },
};

export default defaultResume;