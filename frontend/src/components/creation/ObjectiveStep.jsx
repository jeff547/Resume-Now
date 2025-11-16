const ObjectiveStep = ({ formData, handleChange, textAreaClasses }) => {
  return (
    <div className="space-y-4">
      <label className="space-y-2">
        <span className="text-sm font-semibold text-gray-300">
          What role are you targeting?
        </span>
        <textarea
          className={textAreaClasses}
          placeholder="Senior Product Designer focused on B2B SaaS · looking for growth-stage startups"
          value={formData.jobObjective}
          onChange={handleChange("jobObjective")}
        />
      </label>
      <p className="text-sm text-gray-500">
        Tip: include industry (fintech, healthtech, manufacturing), seniority,
        or location preference. We’ll adapt the tone around it.
      </p>
    </div>
  );
};

export default ObjectiveStep;
