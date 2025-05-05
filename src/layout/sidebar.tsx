import classNames from "classnames";
import { usePopupStore } from "../store/use-popup-store";

export default function Sidebar() {
  const { config, setConfig } = usePopupStore();

  return (
    <nav
      className="left-0 top-0 h-[calc(100dvh-16px)] w-[150px] sticky flex flex-col justify-between max-h-[384px]
after:content-[''] after:absolute after:-top-2 after:right-0 after:w-[1px] after:h-[calc(100%+16px)] after:bg-slate-700/5
    "
    >
      <div>
        <div className="border-b border-slate-700/15 mb-2 h-10 mr-4">
          <h2 className="text-xl font-extrabold">JobTracker</h2>
        </div>
        <div className="mr-4">
          <div className="border-b border-slate-700/15 mb-2">
            <ul>
              <li>
                <button
                  className={classNames(
                    "cursor-pointer",
                    config.menu === "linkedin"
                      ? "bg-slate-800/80 text-slate-100/80 hover:text-slate-300/80"
                      : "text-slate-600/50 hover:text-slate-900",
                    "w-full text-left"
                  )}
                  onClick={() =>
                    setConfig({
                      menu: "linkedin",
                      title: "Draft - LinkedIn",
                    })
                  }
                >
                  <span
                    className={classNames(" py-1 px-2 text-base font-medium")}
                  >
                    LinkedIn
                  </span>
                </button>
              </li>
              <li>
                <button
                  className={classNames(
                    "cursor-pointer",
                    config.menu === "lever"
                      ? "bg-slate-800/80 text-slate-100/80 hover:text-slate-300/80"
                      : "text-slate-600/50 hover:text-slate-900",
                    "w-full text-left"
                  )}
                  onClick={() =>
                    setConfig({
                      menu: "lever",
                      title: "Draft - Lever",
                    })
                  }
                >
                  <span
                    className={classNames(" py-1 px-2 text-base font-medium")}
                  >
                    Lever
                  </span>
                </button>
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li>
                <button
                  className={classNames(
                    "cursor-pointer",
                    config.menu === "jobtracker"
                      ? "bg-slate-800/80 text-slate-100/80 hover:text-slate-300/80"
                      : "text-slate-600/50 hover:text-slate-900",
                    "w-full text-left"
                  )}
                  onClick={() =>
                    setConfig({
                      menu: "jobtracker",
                      title: "Saved - JobTracker",
                    })
                  }
                >
                  <span
                    className={classNames("py-1 px-2 text-base font-medium")}
                  >
                    JobTracker
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mr-4">
        <button className="w-full bg-red-600 text-white rounded p-2 hover:bg-red-700 cursor-pointer mb-2 px-2">
          LOG OUT
        </button>
      </div>
    </nav>
  );
}
