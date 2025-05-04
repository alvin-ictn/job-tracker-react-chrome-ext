import { ReactNode } from "react";

export default function MainContent({ children }: {children: ReactNode}) {
  return <main className="overflow-y-scroll h-80 w-[450px] break-words">{children}</main>;
}
