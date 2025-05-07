import classNames from "classnames";
import { usePopupStore } from "../store/use-popup-store";
import { motion } from "framer-motion";
import { PowerCircle } from "lucide-react";

export default function Sidebar() {
  const { config, setConfig } = usePopupStore();

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={classNames(
        "sticky top-0 left-0 h-[calc(100dvh-16px)] w-[150px] max-h-[384px] flex flex-col justify-between border-r",
        "border-slate-200 dark:border-slate-700/30 bg-white dark:bg-slate-950 text-sm px-3 py-2"
      )}
    >
      <div>
        <div className="border-b border-slate-200 dark:border-slate-700/20 pb-2 mb-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            JobTracker
          </h2>
        </div>

        <div className="space-y-4">
          <ul className="space-y-1 ">
            {[
              { id: "linkedin", label: "LinkedIn" },
              { id: "lever", label: "Lever" },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() =>
                    setConfig({ menu: item.id, title: `Draft - ${item.label}` })
                  }
                  className={classNames(
                    "w-full text-left rounded px-2 py-1.5 transition-colors",
                    config.menu === item.id
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="border-b border-slate-200 dark:border-slate-700/20" />

          <ul className="space-y-1 ">
            <li>
              <button
                onClick={() =>
                  setConfig({ menu: "jobtracker", title: "Saved - JobTracker" })
                }
                className={classNames(
                  "w-full text-left rounded px-2 py-1.5 transition-colors",
                  config.menu === "jobtracker"
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                )}
              >
                JobTracker
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <button className="flex gap-2 items-center justify-center cursor-pointer w-full rounded-md py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white transition-colors">
          <PowerCircle />
          <span>LOG OUT</span>
        </button>
      </div>
    </motion.nav>
  );
}
