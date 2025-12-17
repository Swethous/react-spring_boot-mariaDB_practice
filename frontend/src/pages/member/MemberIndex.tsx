// src/pages/member/MemberLayout.tsx
import { Outlet } from "react-router-dom";

const MemberLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default MemberLayout;
