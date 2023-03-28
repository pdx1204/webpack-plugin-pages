import React from "react";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <section>
      <h1>Layout</h1>
      <Outlet />
    </section>
  );
}

export default React.memo(Layout);
