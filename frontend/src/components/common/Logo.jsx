import logo from "../../assets/images/logo.png";

const Logo = () => {
  return (
    <h1 className="font-roboto flex cursor-pointer items-center text-xl font-medium">
      <img src={logo} alt="logo" className="mr-2 inline w-6" />
      ResumeNow
    </h1>
  );
};

export default Logo;
