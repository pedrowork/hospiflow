"use client";
type Props = {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  working?: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
};

export default function ConfirmModal({
  open,
  title = "Confirmar",
  message = "Tem certeza?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  working = false,
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-[92%] max-w-md rounded-xl border border-slate-700 bg-slate-900 text-slate-50 p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm opacity-80 mb-3">{message}</p>
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1 rounded border border-slate-600" onClick={onCancel} disabled={working}>{cancelText}</button>
          <button className="px-3 py-1 rounded bg-rose-600 text-white disabled:opacity-50" onClick={() => onConfirm()} disabled={working}>{working ? 'Executando...' : confirmText}</button>
        </div>
      </div>
    </div>
  );
}


