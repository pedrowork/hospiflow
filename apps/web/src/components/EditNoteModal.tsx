"use client";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  title?: string;
  initialText?: string;
  max?: number;
  saving?: boolean;
  onCancel: () => void;
  onSave: (text: string) => Promise<void> | void;
};

export default function EditNoteModal({ open, title = "Editar descrição", initialText = "", max = 240, saving = false, onCancel, onSave }: Props) {
  const [text, setText] = useState<string>(initialText);
  useEffect(() => setText(initialText), [initialText, open]);
  if (!open) return null;
  const remaining = max - text.length;
  const invalid = text.length > max;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-[92%] max-w-md rounded-xl border border-slate-700 bg-slate-900 text-slate-50 p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <textarea
          className="w-full h-32 resize-none rounded border border-slate-700 bg-slate-950 p-2 text-sm outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={max + 1}
          placeholder="Escreva uma descrição breve (até 240 caracteres)"
          autoFocus
        />
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className={invalid ? "text-rose-400" : "opacity-70"}>{remaining} caracteres restantes</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border border-slate-600" onClick={onCancel} disabled={saving}>Cancelar</button>
            <button
              className="px-3 py-1 rounded bg-sky-600 text-white disabled:opacity-50"
              onClick={async () => { if (!invalid) await onSave(text.trim()); }}
              disabled={invalid || saving}
            >{saving ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}


