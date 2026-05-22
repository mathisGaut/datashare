import { useState } from "react";

import Header from "./Header";
import MobileDrawer from "./MobileDrawer";
import Sidebar from "./Sidebar";

export default function Layout({
  children,
  onLogout,
  onAddFiles,
  userName,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-ds-cream">
      <Sidebar />

      <MobileDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onAddFiles={onAddFiles}
        onLogout={onLogout}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onLogout={onLogout}
          onAddFiles={onAddFiles}
          onOpenMenu={() => setMenuOpen(true)}
          userName={userName}
        />
        <main className="flex-1 px-4 py-6 lg:px-10 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
