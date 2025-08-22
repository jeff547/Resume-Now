const ErrorMessage = ({ errRef, errMsg }) => {
  return (
    <p
      ref={errRef}
      className={
        errMsg
          ? "text-red-500 text-center font-semibold py-4 bg-red-300 rounded-sm px-8"
          : "offscreen"
      }
      aria-live="assertive"
    >
      {errMsg}
    </p>
  );
};
export default ErrorMessage;
