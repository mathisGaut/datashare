import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CloudUpload } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = () => {
    navigate("/login", {
      state: { message: "Connectez-vous pour partager votre fichier." },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#f3b08d] via-[#ea8c7d] to-[#e56b6f] px-5 py-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ds-ink">DataShare</h1>

        <Link
          to="/login"
          className="rounded-xl bg-ds-btn-dark px-4 py-2 text-sm font-medium text-white"
        >
          Se connecter
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-16 text-center">
        <p className="mb-12 max-w-xs text-lg font-medium text-ds-ink">
          Tu veux partager un fichier ?
        </p>

        <button
          type="button"
          onClick={handleUploadClick}
          className="group relative flex h-36 w-36 items-center justify-center"
          aria-label="Choisir un fichier à partager"
        >
          <span className="absolute inset-0 rounded-full bg-ds-btn-dark/20 transition group-active:scale-95" />
          <span className="absolute inset-4 rounded-full bg-ds-btn-dark/30" />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-ds-btn-dark text-white shadow-lg">
            <CloudUpload size={36} strokeWidth={1.75} />
          </span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelected}
        />
      </main>
    </div>
  );
}
