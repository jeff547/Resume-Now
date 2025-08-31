const Modal = ({ open, onClose, children }) => {
  return (
    // Close on background click
    <div
      onClick={onClose}
      className={`z-5 fixed inset-0 flex justify-center items-center transition-colors ${open ? "visible bg-black/40" : "invisible"}`}
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-gray-900 rounded-xl shadow p-6 transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
