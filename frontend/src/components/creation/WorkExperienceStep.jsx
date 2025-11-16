const WorkExperienceStep = ({
  workExperiences,
  inputClasses,
  textAreaClasses,
  onChange,
  onAdd,
  onRemove,
}) => {
  return (
    <div className="space-y-8">
      {workExperiences.map((experience, index) => (
        <div
          key={`work-${index}`}
          className="rounded-3xl border border-gray-900/70 bg-gray-1000/60 p-4 sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
            <p className="font-semibold text-gray-200">
              Work Experience #{index + 1}
            </p>
            {workExperiences.length > 1 && (
              <button
                type="button"
                className="text-xs uppercase tracking-wide text-red-300 hover:text-red-200"
                onClick={() => onRemove(index)}
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-300">
                Job title
              </span>
              <input
                type="text"
                className={inputClasses}
                placeholder="Lead Frontend Engineer"
                value={experience.jobTitle}
                onChange={onChange(index, "jobTitle")}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-300">
                Company
              </span>
              <input
                type="text"
                className={inputClasses}
                placeholder="Northwind Labs"
                value={experience.company}
                onChange={onChange(index, "company")}
              />
            </label>
          </div>
          <label className="mt-4 block space-y-2">
            <span className="text-sm font-semibold text-gray-300">Dates</span>
            <input
              type="text"
              className={inputClasses}
              placeholder="Aug 2021 – Present"
              value={experience.dates}
              onChange={onChange(index, "dates")}
            />
          </label>
          <label className="mt-5 block space-y-2">
            <span className="text-sm font-semibold text-gray-300">
              Key responsibilities
            </span>
            <textarea
              className={`${textAreaClasses} min-h-[180px]`}
              placeholder="• Built component library adopted by 6 squads\n• Partnered with PMs to deliver experiments for enterprise onboarding"
              value={experience.responsibilities}
              onChange={onChange(index, "responsibilities")}
            />
            <span className="text-xs text-gray-500">
              Use quick bullet sentences. Lead with strong verbs (Led, Built,
              Optimized, Partnered).
            </span>
          </label>
        </div>
      ))}
      <button
        type="button"
        className="button inline-flex items-center justify-center gap-2 px-4 py-2 text-xs uppercase tracking-wide"
        onClick={onAdd}
      >
        + Add work experience
      </button>
    </div>
  );
};

export default WorkExperienceStep;
