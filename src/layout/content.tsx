import classNames from "classnames";
import { ReactNode } from "react";

export default function MainContent({ children }: { children: ReactNode }) {
  return (
    <main
      className={classNames(
        "bg-slate-100  text-slate-800 dark:bg-slate-800  dark:text-white transition-colors",
        "p-2 overflow-y-scroll h-[344px] w-[450px] break-words",
        "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      )}
    >
      {children}
    </main>
  );
}
