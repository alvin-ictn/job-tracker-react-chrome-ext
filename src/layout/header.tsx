import { usePopupStore } from "../store/use-popup-store";

export default function Header() {
  const { config } = usePopupStore();

  console.log('config', config)
  return (
    <header className="pl-2 flex items-center top-0 h-10 w-full border-b border-slate-200 dark:border-slate-700/20 font-medium text-xl bg-white dark:bg-slate-950 dark:text-white transition-colors">{config.title}</header>
  );
}
