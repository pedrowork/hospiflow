"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  title?: string;
  initialDate?: Date;
  initialNotes?: string;
  working?: boolean;
  onCancel: () => void;
  onConfirm: (occurredAtISO: string, notes: string) => Promise<void> | void;
};

export default function RetroStartModal({ open, title = 'Informar início do evento', initialDate = new Date(), initialNotes = '', working = false, onCancel, onConfirm }: Props) {
  const [dt, setDt] = useState<string>(toLocalInputValue(initialDate));
  const [notes, setNotes] = useState<string>(initialNotes);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { setDt(toLocalInputValue(initialDate)); setNotes(initialNotes); }, [open, initialDate, initialNotes]);
  useEffect(() => { if (open) notesRef.current?.focus(); }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-[92%] max-w-md rounded-xl border border-slate-700 bg-slate-900 text-slate-50 p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <label className="text-xs opacity-80">Data e hora do início</label>
        <input type="datetime-local" className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2 text-sm outline-none text-slate-50" value={dt} onChange={(e)=>setDt(e.target.value)} />
        <label className="text-xs opacity-80 mt-3 block">Descrição breve</label>
        <textarea ref={notesRef} className="mt-1 w-full h-28 resize-none rounded border border-slate-700 bg-slate-950 p-2 text-sm outline-none text-slate-50 placeholder-slate-400" value={notes} onChange={(e)=>setNotes(e.target.value)} maxLength={240} placeholder="Ex.: Procedimento X iniciado na sala Y" />
        <div className="mt-3 flex justify-end gap-2">
          <button className="px-3 py-1 rounded border border-slate-600" onClick={onCancel} disabled={working}>Cancelar</button>
          <button className="px-3 py-1 rounded bg-sky-600 text-white disabled:opacity-50" disabled={working || !dt} onClick={() => onConfirm(fromLocalInputValue(dt), notes.trim())}>{working ? 'Salvando...' : 'Salvar início'}</button>
        </div>
      </div>
    </div>
  );
}

function toLocalInputValue(d: Date) {
  const pad = (n: number) => `${n}`.padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function fromLocalInputValue(v: string) {
  // v é local (datetime-local). Basta criar Date(v) (interpreta em horário local)
  // e serializar para ISO (UTC) sem aplicar offset manual (evita dupla compensação).
  return new Date(v).toISOString();
}


