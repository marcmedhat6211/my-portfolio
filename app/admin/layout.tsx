"use client";
import { Fragment, useState } from "react";
import SideBar from "../components/admin/layout/SideBar";
import styles from "./RootLayout.module.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // states
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  return (
    <Fragment>
      <SideBar open={sidePanelOpen} setOpen={setSidePanelOpen} />
      <main
        className={`${styles["content-container"]} ${
          sidePanelOpen ? styles["side-panel-open"] : ""
        }`}
      >
        {children}
      </main>
    </Fragment>
  );
}
