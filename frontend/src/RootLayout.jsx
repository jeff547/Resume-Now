import { Outlet } from "react-router-dom";
import HashLink from "./components/common/HashLink";

const RootLayout = () => {
  return (
    <div>
      <HashLink />
      <Outlet />
    </div>
  );
};

export default RootLayout;
