"use client";
import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferred(e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 mx-auto w-full max-w-md">
      <div className="rounded-xl border border-slate-700 bg-slate-900/90 backdrop-blur p-4 shadow">
        <div className="text-sm mb-3">Instale o app na sua tela inicial</div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-2 rounded bg-slate-700 text-white"
            onClick={() => setVisible(false)}
          >
            Agora não
          </button>
          <button
            className="px-3 py-2 rounded bg-sky-600 text-white"
            onClick={async () => {
              if (!deferred) return;
              deferred.prompt();
              const { outcome } = await deferred.userChoice;
              // ocultar após escolha
              setVisible(false);
              setDeferred(null);
              console.log("PWA install outcome:", outcome);
            }}
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
}


