import { Fragment } from "react/jsx-runtime";
import Header from "./header";
import Sidebar from "./sidebar";
import MainContent from "./content";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <Fragment>
      <Sidebar></Sidebar>
      <div>
        <Header></Header>
        <MainContent>{children}</MainContent>
      </div>
    </Fragment>
  );
}
