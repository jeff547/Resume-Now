import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import CreationHeader from "../components/creation/CreationHeader";
import RoadmapSidebar from "../components/creation/RoadmapSidebar";
import BasicInfoStep from "../components/creation/BasicInfoStep";
import ObjectiveStep from "../components/creation/ObjectiveStep";
import EducationStep from "../components/creation/EducationStep";
import SkillsStep from "../components/creation/SkillsStep";
import WorkExperienceStep from "../components/creation/WorkExperienceStep";
import ProjectsStep from "../components/creation/ProjectsStep";
import ExtrasStep from "../components/creation/ExtrasStep";
import { techSuggestions } from "../components/creation/TechSuggestions";
import useApiAuth from "../hooks/useApiAuth";

const steps = [
  {
    title: "Basic Info",
    instructions:
      "What’s your full name, email, phone number, and preferred location? Add links to LinkedIn, GitHub, or a personal site so we can include them in the header.",
  },
  {
    title: "Job Objective",
    instructions:
      "What kind of job or role are you applying for? Share the industry or field so our AI can tailor the summary.",
  },
  {
    title: "Education",
    instructions:
      "List your degree, GPA (optional), school name, and graduation year.",
  },
  {
    title: "Skills",
    instructions:
      "Add technical skills (use tags for the stack) and any soft skills or languages to highlight.",
  },
  {
    title: "Work Experience",
    instructions:
      "Describe your job title, company, dates, key responsibilities, and any quantified achievements.",
  },
  {
    title: "Projects",
    instructions:
      "Share a project name, its purpose, technologies used, and your specific role and measurable outcome.",
  },
  {
    title: "Extras",
    instructions:
      "Awards, volunteering, certifications, or anything else worth celebrating.",
  },
];

const initialFormState = {
  fullName: "",
  email: "",
  phone: "",
  linkedIn: "",
  github: "",
  website: "",
  location: "",
  jobObjective: "",
  degree: "",
  school: "",
  graduationYear: "",
  skills: [],
  softSkills: "",
  workExperiences: [
    {
      jobTitle: "",
      company: "",
      dates: "",
      responsibilities: "",
    },
  ],
  projects: [
    {
      name: "",
      technologies: "",
      description: "",
      role: "",
    },
  ],
  extras: "",
};

const inputClasses =
  "w-full rounded-2xl border border-gray-900/80 bg-gray-1100/70 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-800/40";
const textAreaClasses = `${inputClasses} min-h-[120px] resize-none`;

const CreationPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormState);
  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiAuth = useApiAuth();
  const navigate = useNavigate();

  const progress = Math.round(((currentStep + 1) / steps.length) * 100);
  const isLastStep = currentStep === steps.length - 1;

  const filteredSuggestions = useMemo(() => {
    const normalized = skillInput.trim().toLowerCase();
    if (!normalized) return [];
    return techSuggestions.filter(
      (skill) =>
        skill.toLowerCase().includes(normalized) &&
        !formData.skills.includes(skill),
    );
  }, [skillInput, formData.skills]);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const setStep = (stepIndex) => {
    setCurrentStep(Math.max(0, Math.min(stepIndex, steps.length - 1)));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0: // Basic Info
        if (!formData.fullName.trim()) return "Full Name is required.";
        if (!formData.email.trim()) return "Email is required.";
        return true;

      case 1: // Objective
        if (!formData.jobObjective.trim())
          return "Please enter a job objective.";
        return true;

      case 2: // Education
        if (!formData.school.trim()) return "School name is required.";
        return true;

      case 3: // Skills
        if (formData.skills.length === 0)
          return "Please add at least one skill.";
        return true;

      case 4: // Work Experience
        if (formData.workExperiences.length > 0) {
          const firstJob = formData.workExperiences[0];
          if (!firstJob.company.trim() && !firstJob.jobTitle.trim()) {
            return "Please add at least one work experience or remove the empty entry.";
          }
        }
        return true;

      case 5: // Projects
        if (formData.projects.length > 0) {
          const firstProject = formData.projects[0];
          if (!firstProject.name.trim()) return "Project Name is required.";
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    const isValid = validateStep();

    if (typeof isValid === "string") {
      alert(isValid);
      return;
    }

    if (isLastStep) {
      handleSubmit();
    } else {
      setStep(currentStep + 1);
    }
  };

  const handlePrevious = () => setStep(currentStep - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const payload = {
      title: `${formData.fullName || "Untitled"}'s Resume`,
      input_data: formData,
    };

    try {
      const response = await apiAuth.post("/resumes/", payload);

      console.log("✅ Success! Server Response:", response.data);
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Resume creation submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSkill = (skill) => {
    if (!skill) return;
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleWorkExperienceChange = (index, field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => {
      const nextExperiences = [...prev.workExperiences];
      nextExperiences[index] = { ...nextExperiences[index], [field]: value };
      return { ...prev, workExperiences: nextExperiences };
    });
  };

  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperiences: [
        ...prev.workExperiences,
        { jobTitle: "", company: "", dates: "", responsibilities: "" },
      ],
    }));
  };

  const removeWorkExperience = (index) => {
    setFormData((prev) => {
      if (prev.workExperiences.length === 1) return prev;
      const nextExperiences = prev.workExperiences.filter(
        (_, i) => i !== index,
      );
      return { ...prev, workExperiences: nextExperiences };
    });
  };

  const handleProjectChange = (index, field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => {
      const nextProjects = [...prev.projects];
      nextProjects[index] = { ...nextProjects[index], [field]: value };
      return { ...prev, projects: nextProjects };
    });
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: "", technologies: "", description: "", role: "" },
      ],
    }));
  };

  const removeProject = (index) => {
    setFormData((prev) => {
      if (prev.projects.length === 1) return prev;
      const nextProjects = prev.projects.filter((_, i) => i !== index);
      return { ...prev, projects: nextProjects };
    });
  };

  const renderStepFields = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            formData={formData}
            handleChange={handleChange}
            inputClasses={inputClasses}
          />
        );
      case 1:
        return (
          <ObjectiveStep
            formData={formData}
            handleChange={handleChange}
            textAreaClasses={textAreaClasses}
          />
        );
      case 2:
        return (
          <EducationStep
            formData={formData}
            handleChange={handleChange}
            inputClasses={inputClasses}
          />
        );
      case 3:
        return (
          <SkillsStep
            formData={formData}
            handleChange={handleChange}
            skillInput={skillInput}
            onSkillInputChange={setSkillInput}
            handleAddSkill={handleAddSkill}
            handleRemoveSkill={handleRemoveSkill}
            filteredSuggestions={filteredSuggestions}
            textAreaClasses={textAreaClasses}
          />
        );
      case 4:
        return (
          <WorkExperienceStep
            workExperiences={formData.workExperiences}
            inputClasses={inputClasses}
            textAreaClasses={textAreaClasses}
            onChange={handleWorkExperienceChange}
            onAdd={addWorkExperience}
            onRemove={removeWorkExperience}
          />
        );
      case 5:
        return (
          <ProjectsStep
            projects={formData.projects}
            inputClasses={inputClasses}
            textAreaClasses={textAreaClasses}
            onChange={handleProjectChange}
            onAdd={addProject}
            onRemove={removeProject}
          />
        );
      case 6:
      default:
        return (
          <ExtrasStep
            formData={formData}
            handleChange={handleChange}
            textAreaClasses={textAreaClasses}
          />
        );
    }
  };

  return (
    <div className="from-gray-1100 via-gray-1000 font-roboto relative h-screen overflow-hidden bg-gradient-to-b to-gray-950 text-gray-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,56,255,0.3),_transparent_55%)]" />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10">
        <CreationHeader
          currentStep={currentStep}
          stepsLength={steps.length}
          progress={progress}
        />

        <div className="flex min-h-0 flex-1 gap-6 overflow-hidden">
          <RoadmapSidebar
            steps={steps}
            currentStep={currentStep}
            onSelectStep={setStep}
          />

          <main className="bg-gray-1000/80 min-h-0 flex-1 overflow-y-auto rounded-3xl border border-gray-900/60 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:p-8">
            <div className="mb-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:hidden">
              <span>Your roadmap</span>
              <span>
                Step {currentStep + 1} / {steps.length}
              </span>
            </div>
            <div className="space-y-2 pb-6">
              <p className="text-xs uppercase tracking-wide text-purple-200">
                Step {currentStep + 1}
              </p>
              <h2 className="text-2xl font-semibold">
                {steps[currentStep].title}
              </h2>
              <p className="text-sm text-gray-400">
                {steps[currentStep].instructions}
              </p>
            </div>
            <div className="space-y-8">{renderStepFields()}</div>

            <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`rounded-2xl border border-gray-800 px-6 py-3 text-sm font-semibold transition ${
                  currentStep === 0
                    ? "cursor-not-allowed text-gray-600"
                    : "text-gray-200 hover:border-gray-600 hover:text-white"
                }`}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting} // Prevents double submission
                className={`button flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm uppercase tracking-wide transition-all ${
                  isSubmitting
                    ? "cursor-wait bg-purple-900/50 text-gray-400" // Style when saving
                    : "bg-purple-600 text-white shadow-lg shadow-purple-900/20 hover:bg-purple-500" // Normal style
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span>Saving...</span>
                    <FontAwesomeIcon icon={faSpinner} spin />
                  </>
                ) : (
                  <>
                    {isLastStep ? "Finish setup" : "Next step"}
                    {!isLastStep && <FontAwesomeIcon icon={faChevronRight} />}
                  </>
                )}
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CreationPage;
