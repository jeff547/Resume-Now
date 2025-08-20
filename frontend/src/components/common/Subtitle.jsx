const Subtitle = ({ children, classNames }) => {
  return (
    <h1 className={`${classNames} cursor-default text-base font-light`}>
      {children}
    </h1>
  );
};
export default Subtitle;
