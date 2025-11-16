const ProjectsStep = ({
  projects,
  inputClasses,
  textAreaClasses,
  onChange,
  onAdd,
  onRemove,
}) => {
  return (
    <div className="space-y-8">
      {projects.map((project, index) => (
        <div
          key={`project-${index}`}
          className="rounded-3xl border border-gray-900/70 bg-gray-1000/60 p-4 sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
            <p className="font-semibold text-gray-200">Project #{index + 1}</p>
            {projects.length > 1 && (
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
                Project name
              </span>
              <input
                type="text"
                className={inputClasses}
                placeholder="Intelligent Interview Assistant"
                value={project.name}
                onChange={onChange(index, "name")}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-300">
                Technologies
              </span>
              <input
                type="text"
                className={inputClasses}
                placeholder="React, LangChain, FastAPI, AWS Lambda"
                value={project.technologies}
                onChange={onChange(index, "technologies")}
              />
            </label>
          </div>
          <label className="mt-4 block space-y-2">
            <span className="text-sm font-semibold text-gray-300">
              Description
            </span>
            <textarea
              className={textAreaClasses}
              placeholder="60-second AI prep sessions that summarize job descriptions and generate mock questions."
              value={project.description}
              onChange={onChange(index, "description")}
            />
          </label>
          <label className="mt-4 block space-y-2">
            <span className="text-sm font-semibold text-gray-300">
              Role & outcome
            </span>
            <textarea
              className={textAreaClasses}
              placeholder="Drove roadmap, trained the LLM prompt library, and shipped V1 that shortened recruiter prep time by 35%."
              value={project.role}
              onChange={onChange(index, "role")}
            />
          </label>
        </div>
      ))}
      <button
        type="button"
        className="button inline-flex items-center justify-center gap-2 px-4 py-2 text-xs uppercase tracking-wide"
        onClick={onAdd}
      >
        + Add project
      </button>
    </div>
  );
};

export default ProjectsStep;
