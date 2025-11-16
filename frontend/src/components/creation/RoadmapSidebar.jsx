import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const RoadmapSidebar = ({ steps, currentStep, onSelectStep }) => {
  return (
    <aside className="bg-gray-1000/80 hidden w-56 flex-shrink-0 flex-col overflow-hidden rounded-3xl border border-gray-900/60 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:flex">
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-gray-500">
        <span>Your roadmap</span>
        <span>
          {currentStep + 1}/{steps.length}
        </span>
      </div>
      <div className="mt-3 flex flex-col gap-2 overflow-y-auto pr-1">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          return (
            <button
              key={step.title}
              type="button"
              onClick={() => onSelectStep(index)}
              className={`flex flex-col gap-1 rounded-2xl border px-3 py-2 text-left text-[11px] transition ${
                isActive
                  ? "border-purple-400/70 bg-purple-600/30 text-gray-100"
                  : "border-gray-900/80 text-gray-400 hover:border-gray-700 hover:text-gray-100"
              }`}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                  isCompleted
                    ? "bg-purple-500/80 text-white"
                    : isActive
                      ? "border border-purple-300 text-gray-100"
                      : "border border-gray-700 text-gray-500"
                }`}
              >
                {isCompleted ? <FontAwesomeIcon icon={faCheck} /> : index + 1}
              </span>
              <span className="leading-tight">{step.title}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default RoadmapSidebar;
