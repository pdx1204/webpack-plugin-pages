import React from "react";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <section>
      <Outlet />
    </section>
  );
}

export default React.memo(Layout);
