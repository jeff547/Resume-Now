const Title = ({ children, classNames }) => {
  return (
    <h3 className={`${classNames} cursor-default font-medium`}>{children}</h3>
  );
};
export default Title;
