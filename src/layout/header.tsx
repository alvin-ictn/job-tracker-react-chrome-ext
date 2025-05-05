import { usePopupStore } from "../store/use-popup-store";

export default function Header() {
  const { config } = usePopupStore();

  console.log('config', config)
  return (
    <header className="top-0 h-10 w-full border-b border-slate-700/15 font-medium text-xl">{config.title}</header>
  );
}
