import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/images/logo.png";

const CreationHeader = ({ currentStep, stepsLength, progress }) => {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-gray-100"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to dashboard
        </Link>
        <div className="hidden h-6 w-px bg-gray-800 sm:block" aria-hidden />
        <img src={logo} alt="ResumeNow logo" className="h-7 w-7" />
        <p className="text-lg font-semibold">Create your resume</p>
      </div>
      <div className="space-y-2 text-right">
        <p className="text-xs uppercase tracking-wide text-gray-500">
          Step {currentStep + 1} of {stepsLength}
        </p>
        <div className="h-2 w-48 overflow-hidden rounded-full bg-gray-900">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-purple-400 to-blue-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </header>
  );
};

export default CreationHeader;
