const ExtrasStep = ({ formData, handleChange, textAreaClasses }) => (
  <div className="space-y-4">
    <label className="space-y-2">
      <span className="text-sm font-semibold text-gray-300">
        Awards, volunteering, certifications
      </span>
      <textarea
        className={textAreaClasses}
        placeholder="Google UX Design Certification · Grace Hopper Conference Scholar · Mentor, BuiltByGirls"
        value={formData.extras}
        onChange={handleChange("extras")}
      />
    </label>
    <p className="text-sm text-gray-500">
      This section helps highlight leadership and community impact. Share
      anything memorable even if it is outside of work.
    </p>
  </div>
);

export default ExtrasStep;
