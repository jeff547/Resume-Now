const SkillsStep = ({
  formData,
  skillInput,
  onSkillInputChange,
  handleAddSkill,
  handleRemoveSkill,
  filteredSuggestions,
  textAreaClasses,
  handleChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-sm font-semibold text-gray-300">
          Technical skills
          <span className="pl-1 text-xs text-gray-500">(press Enter to add)</span>
        </span>
        <div className="bg-gray-1100/70 rounded-2xl border border-gray-900/80">
          <div className="flex flex-wrap gap-2 px-4 py-3">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-700/70 to-purple-500/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-50"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-gray-200/80 hover:text-white"
                  aria-label={`Remove ${skill}`}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              className="min-w-[120px] flex-1 bg-transparent px-1 py-1 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none"
              placeholder="Add React, AWS, etc."
              value={skillInput}
              onChange={(event) => onSkillInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleAddSkill(skillInput.trim());
                }
              }}
            />
          </div>
          {filteredSuggestions.length > 0 && (
            <div className="bg-gray-1000/60 border-t border-gray-900/60">
              <p className="px-4 pt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Suggested tags
              </p>
              <div className="flex flex-wrap gap-2 px-4 py-3">
                {filteredSuggestions.slice(0, 6).map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className="rounded-full border border-purple-500/40 px-3 py-1 text-xs text-purple-200 hover:bg-purple-600/40"
                    onClick={() => handleAddSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <label className="space-y-2">
        <span className="text-sm font-semibold text-gray-300">
          Soft skills or languages
        </span>
        <textarea
          className={textAreaClasses}
          placeholder="Client storytelling · Empathetic leadership · English (native), Spanish (professional)"
          value={formData.softSkills}
          onChange={handleChange("softSkills")}
        />
      </label>
    </div>
  );
};

export default SkillsStep;
