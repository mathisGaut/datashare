import SidebarContent from "./SidebarContent";

export default function Sidebar() {
  return (
    <aside className="hidden w-[260px] shrink-0 flex-col bg-gradient-to-b from-ds-sidebar-top to-ds-sidebar-bottom px-6 py-8 lg:flex">
      <SidebarContent />
    </aside>
  );
}
