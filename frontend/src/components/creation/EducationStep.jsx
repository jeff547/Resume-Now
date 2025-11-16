const EducationStep = ({ formData, handleChange, inputClasses }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <label className="space-y-2">
        <span className="text-sm font-semibold text-gray-300">Degree & GPA</span>
        <input
          type="text"
          className={inputClasses}
          placeholder="B.S. Computer Science · 3.7 GPA"
          value={formData.degree}
          onChange={handleChange("degree")}
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-semibold text-gray-300">School name</span>
        <input
          type="text"
          className={inputClasses}
          placeholder="University of Texas at Austin"
          value={formData.school}
          onChange={handleChange("school")}
        />
      </label>
      <label className="space-y-2 md:col-span-2">
        <span className="text-sm font-semibold text-gray-300">
          Graduation year
        </span>
        <input
          type="text"
          className={inputClasses}
          placeholder="2022"
          value={formData.graduationYear}
          onChange={handleChange("graduationYear")}
        />
      </label>
    </div>
  );
};

export default EducationStep;
