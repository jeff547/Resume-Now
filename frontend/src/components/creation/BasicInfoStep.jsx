const BasicInfoStep = ({ formData, handleChange, inputClasses }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <label className="space-y-2">
        <span className="text-sm font-semibold text-gray-300">Full name</span>
        <input
          type="text"
          className={inputClasses}
          placeholder="Jordan Rivera"
          value={formData.fullName}
          onChange={handleChange("fullName")}
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-semibold text-gray-300">Email</span>
        <input
          type="email"
          className={inputClasses}
          placeholder="jordan@email.com"
          value={formData.email}
          onChange={handleChange("email")}
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-semibold text-gray-300">
          Phone number
        </span>
        <input
          type="tel"
          className={inputClasses}
          placeholder="+1 (555) 555-5555"
          value={formData.phone}
          onChange={handleChange("phone")}
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-semibold text-gray-300">
          Location
          <span className="pl-1 text-xs text-gray-500">
            (City, State or Country)
          </span>
        </span>
        <input
          type="text"
          className={inputClasses}
          placeholder="Austin, TX · USA"
          value={formData.location}
          onChange={handleChange("location")}
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-semibold text-gray-300">
          LinkedIn (optional)
        </span>
        <input
          type="url"
          className={inputClasses}
          placeholder="linkedin.com/in/j.rivera"
          value={formData.linkedIn}
          onChange={handleChange("linkedIn")}
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-semibold text-gray-300">
          GitHub (optional)
        </span>
        <input
          type="url"
          className={inputClasses}
          placeholder="github.com/jordanrivera"
          value={formData.github}
          onChange={handleChange("github")}
        />
      </label>
      <label className="space-y-2 md:col-span-2">
        <span className="text-sm font-semibold text-gray-300">
          Personal site or portfolio (optional)
        </span>
        <input
          type="url"
          className={inputClasses}
          placeholder="jordandesigns.com"
          value={formData.website}
          onChange={handleChange("website")}
        />
      </label>
    </div>
  );
};

export default BasicInfoStep;
