"use client";
import { useEffect, useState } from 'react';
import { createEpisode, createEvent, listEpisodes, listEvents, resetEpisodes, updateEventNotes, type Episode } from '@/lib/api';
import { NurseIcon, TechIcon, DoctorIcon, LabIcon, UltrasoundIcon, XRayIcon, ProcedureIcon, NoteIcon } from '@/components/icons';
import EditNoteModal from '@/components/EditNoteModal';
import RetroStartModal from '@/components/RetroStartModal';
import StatsChart from '@/components/StatsChart';
import ConfirmModal from '@/components/ConfirmModal';

export default function Home() {
  const [userId, setUserId] = useState<string>("Usuário Demo");
  const [hospitalName, setHospitalName] = useState<string>("Hospital Demo");
  const [type, setType] = useState<string>("clinica");
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string>("");
  const [events, setEvents] = useState<any[]>([]);
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [modal, setModal] = useState<{ open: boolean; title?: string; targetId?: string; initial?: string; saving?: boolean }>({ open: false });
  const [retro, setRetro] = useState<{ open: boolean; key?: string; working?: boolean }>({ open: false });
  const [confirmReset, setConfirmReset] = useState<{ open: boolean; working?: boolean }>({ open: false });

  useEffect(() => {
    (async () => {
      try {
        setError("");
        const eps = await listEpisodes(userId);
        setEpisodes(eps);
      } catch (e: any) {
        setError(e?.message || 'Falha ao carregar');
      }
    })();
  }, [userId]);

  const createEp = async () => {
    try {
      setBusy(true); setError("");
      const ep = await createEpisode({ userId, hospitalName, type });
      setEpisodes([ep, ...episodes]);
      setSelectedEpisodeId(ep.id);
    } catch (e: any) {
      setError(e?.message || 'Erro ao criar episódio');
    } finally {
      setBusy(false);
    }
  };

  const loadEvents = async (episodeId: string) => {
    try {
      setBusy(true); setError("");
      const list = await listEvents(episodeId);
      setEvents(list);
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar eventos');
    } finally {
      setBusy(false);
    }
  };

  const quickEvent = async (key: string) => {
    if (!selectedEpisodeId) return;
    // abrir modal obrigatório para descrição breve ao iniciar
    const tempId = `pending-${Date.now()}`; // marcador interno
    setModal({ open: true, title: 'Descrição do evento', targetId: tempId, initial: '' });
    // handler de salvar será interceptado no modal global abaixo
    (window as any)._pendingEvent = { key };
  };

  // Pair start->end mapping for timeline durations
  const eventPairs: Record<string, string> = {
    call_nurse: 'nurse_arrived',
    tech_call: 'tech_arrived',
    doctor_call: 'doctor_arrived',
    lab_collect: 'lab_result',
    ultrasound_done: 'ultrasound_result',
    xray_done: 'xray_result',
    exam_req: 'exam_result',
    procedure_start: 'procedure_end',
  };

  const getCategory = (key: string): string => {
    if (key.startsWith('call_nurse') || key.startsWith('nurse_')) return 'nursing';
    if (key.startsWith('tech_')) return 'tech';
    if (key.startsWith('doctor_')) return 'doctor';
    if (key.startsWith('lab_') || key.startsWith('exam_')) return 'lab';
    if (key.startsWith('ultrasound_')) return 'ultrasound';
    if (key.startsWith('xray_')) return 'xray';
    if (key.startsWith('procedure')) return 'procedure';
    return 'note';
  };

  const getVariant = (key: string): 'call' | 'arrive' | 'single' => {
    if (['nurse_arrived', 'tech_arrived', 'doctor_arrived', 'lab_result', 'ultrasound_result', 'xray_result', 'exam_result', 'procedure_end'].includes(key)) return 'arrive';
    if (['call_nurse', 'tech_call', 'doctor_call', 'lab_collect', 'ultrasound_done', 'xray_done', 'exam_req', 'procedure_start'].includes(key)) return 'call';
    return 'single';
  };

  const categoryStyles: Record<string, { call: string; arrive: string; single: string }> = {
    nursing: { call: 'bg-blue-900 text-blue-100 border-blue-500', arrive: 'bg-blue-600 text-white border-blue-600', single: 'bg-blue-800 text-white border-blue-500' },
    tech: { call: 'bg-violet-900 text-violet-100 border-violet-500', arrive: 'bg-violet-600 text-white border-violet-600', single: 'bg-violet-800 text-white border-violet-500' },
    doctor: { call: 'bg-emerald-900 text-emerald-100 border-emerald-500', arrive: 'bg-emerald-600 text-white border-emerald-600', single: 'bg-emerald-800 text-white border-emerald-500' },
    lab: { call: 'bg-amber-900 text-amber-100 border-amber-500', arrive: 'bg-amber-500 text-black border-amber-500', single: 'bg-amber-700 text-black border-amber-500' },
    ultrasound: { call: 'bg-cyan-900 text-cyan-100 border-cyan-500', arrive: 'bg-cyan-600 text-white border-cyan-600', single: 'bg-cyan-800 text-white border-cyan-500' },
    xray: { call: 'bg-indigo-900 text-indigo-100 border-indigo-500', arrive: 'bg-indigo-600 text-white border-indigo-600', single: 'bg-indigo-800 text-white border-indigo-500' },
    procedure: { call: 'bg-rose-900 text-rose-100 border-rose-500', arrive: 'bg-rose-600 text-white border-rose-600', single: 'bg-rose-800 text-white border-rose-500' },
    note: { call: 'bg-slate-800 text-white border-slate-600', arrive: 'bg-slate-600 text-white border-slate-600', single: 'bg-slate-700 text-white border-slate-600' },
  };

  const badgeClasses = (key: string) => {
    const cat = getCategory(key);
    const variant = getVariant(key);
    return `px-2 py-1 rounded border ${categoryStyles[cat][variant]}`;
  };

  const formatDuration = (ms: number) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return [h && `${h}h`, (m || h) && `${m}m`, `${sec}s`].filter(Boolean).join(' ');
  };

  // Build paired timeline items (ascending time)
  const timeline = (() => {
    const sorted = [...events].sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());
    const used = new Set<number>();
    const items: Array<any> = [];
    for (let i = 0; i < sorted.length; i++) {
      if (used.has(i)) continue;
      const ev = sorted[i];
      const endType = eventPairs[ev.type];
      if (endType) {
        const j = sorted.findIndex((e, idx) => idx > i && !used.has(idx) && e.type === endType);
        if (j !== -1) {
          const startAt = new Date(ev.occurredAt);
          const endAt = new Date(sorted[j].occurredAt);
          items.push({ kind: 'pair', start: ev, end: sorted[j], durationMs: endAt.getTime() - startAt.getTime() });
          used.add(i); used.add(j);
          continue;
        }
      }
      items.push({ kind: 'single', ev });
      used.add(i);
    }
    return items.reverse(); // newest first on screen
  })();

  function download(name: string, content: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const exportTxt = () => {
    const ep = episodes.find(e => e.id === selectedEpisodeId);
    const header = `Relatório do Episódio\nHospital: ${ep?.hospitalName ?? ''}\nTipo: ${ep?.type ?? ''}\nInício: ${ep ? new Date(ep.startedAt).toLocaleString() : ''}\n`;
    const lines: string[] = [];
    for (const item of timeline as any[]) {
      if (item.kind === 'pair') {
        lines.push(`\n${item.start.type} -> ${item.end.type}`);
        lines.push(`Início: ${new Date(item.start.occurredAt).toLocaleString()} | Fim: ${new Date(item.end.occurredAt).toLocaleString()} | Duração: ${formatDuration(item.durationMs)}`);
        const note = item.start.notes || item.end.notes; if (note) lines.push(`Descrição: ${note}`);
      } else {
        lines.push(`\n${item.ev.type}`);
        lines.push(`Quando: ${new Date(item.ev.occurredAt).toLocaleString()}`);
        if (item.ev.notes) lines.push(`Descrição: ${item.ev.notes}`);
      }
    }
    download(`episodio_${selectedEpisodeId}.txt`, header + '\n' + lines.join('\n'), 'text/plain;charset=utf-8');
  };

  const exportCsv = () => {
    const rows: string[][] = [[
      'tipo', 'inicio', 'fim', 'duracao_min', 'descricao'
    ]];
    for (const item of timeline as any[]) {
      if (item.kind === 'pair') {
        const durMin = (item.durationMs / 60000).toFixed(2);
        const desc = (item.start.notes || item.end.notes || '').replaceAll('"', '""');
        rows.push([
          `${item.start.type}->${item.end.type}`,
          new Date(item.start.occurredAt).toISOString(),
          new Date(item.end.occurredAt).toISOString(),
          durMin,
          `"${desc}"`
        ]);
      } else {
        const desc = (item.ev.notes || '').replaceAll('"', '""');
        rows.push([
          item.ev.type,
          new Date(item.ev.occurredAt).toISOString(),
          '',
          '',
          `"${desc}"`
        ]);
      }
    }
    const content = rows.map(r => r.join(',')).join('\n');
    download(`episodio_${selectedEpisodeId}.csv`, content, 'text/csv;charset=utf-8');
  };

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">HospiFlow</h1>
      <p className="opacity-80 mb-6">Sistema para monitorar a experiência de internação</p>

      <section className="space-y-2 mb-6">
        <h2 className="text-xl font-semibold">Novo Episódio</h2>
        <div className="grid sm:grid-cols-3 gap-4 color-red-500">
          <input className="border rounded px-3 py-2" value={userId} onChange={e => setUserId(e.target.value)} placeholder="userId" />
          <input className="border rounded px-3 py-2" value={hospitalName} onChange={e => setHospitalName(e.target.value)} placeholder="Hospital" />
          <select className="border rounded px-3 py-2" value={type} onChange={e => setType(e.target.value)}>
            <option value="hospital">Hospital</option>
            <option value="maternidade">Maternidade</option>
            {/* <option value="pediatrica">Pediátrica</option>
            <option value="clinica">Clínica</option> */}
          </select>
        </div>
        <button disabled={busy} onClick={createEp} className="mt-2 px-4 py-2 rounded bg-sky-600 text-white disabled:opacity-50">Criar Episódio</button>
      </section>

      <section className="mb-6 color-red-500">
        <h2 className="text-xl font-semibold">Episódios</h2>
        <div className="flex flex-wrap gap-2 mt-2 items-center">
          {episodes.map(ep => (
            <button key={ep.id} onClick={() => { setSelectedEpisodeId(ep.id); loadEvents(ep.id); }} className={`px-3 py-1 rounded border ${selectedEpisodeId === ep.id ? 'bg-sky-100 border-sky-400' : 'border-slate-300'}`}>
              {ep.userId} · {ep.hospitalName} · {ep.type} · {new Date(ep.startedAt).toLocaleDateString()}
            </button>
          ))}
          <button className="px-3 py-1 rounded bg-rose-700 text-white" onClick={() => setConfirmReset({ open: true })}>Resetar episódios</button>
        </div>
      </section>

      {selectedEpisodeId && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Eventos Rápidos</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <h4 className="text-sm opacity-70 mb-1">Enfermagem</h4>
              <div className="flex gap-2 flex-wrap">
                {[
                  ['call_nurse', 'chamada da enfermagem', <NurseIcon key="i" width={16} height={16} />],
                  ['nurse_arrived', 'chegada da enfermagem', <NurseIcon key="i" width={16} height={16} />],
                ].map(([key, label, icon]) => (
                  <button key={key as string} disabled={busy} onClick={() => {
                    if (key === 'nurse_arrived') {
                      // validar existência do start
                      const hasStart = events.some(e => e.type === 'call_nurse');
                      if (!hasStart) { setRetro({ open: true, key: 'call_nurse' }); return; }
                    }
                    quickEvent(key as string);
                  }} className={`px-3 py-2 rounded border disabled:opacity-50 flex items-center gap-2 ${badgeClasses(key as string)}`}>{icon}{label as string}</button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm opacity-70 mb-1">Técnico(a)</h4>
              <div className="flex gap-2 flex-wrap">
                {[
                  ['tech_call', 'chamada da técnico(a)', <TechIcon key="i" width={16} height={16} />],
                  ['tech_arrived', 'chegada da técnico(a)', <TechIcon key="i" width={16} height={16} />],
                ].map(([key, label, icon]) => (
                  <button key={key as string} disabled={busy} onClick={() => {
                    if (key === 'tech_arrived') {
                      const hasStart = events.some(e => e.type === 'tech_call');
                      if (!hasStart) { setRetro({ open: true, key: 'tech_call' }); return; }
                    }
                    quickEvent(key as string);
                  }} className={`px-3 py-2 rounded border disabled:opacity-50 flex items-center gap-2 ${badgeClasses(key as string)}`}>{icon}{label as string}</button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm opacity-70 mb-1">Médico(a)</h4>
              <div className="flex gap-2 flex-wrap">
                {[
                  ['doctor_call', 'chamada do médico(a)', <DoctorIcon key="i" width={16} height={16} />],
                  ['doctor_arrived', 'chegada do médico(a)', <DoctorIcon key="i" width={16} height={16} />],
                ].map(([key, label, icon]) => (
                  <button key={key as string} disabled={busy} onClick={() => {
                    if (key === 'doctor_arrived') {
                      const hasStart = events.some(e => e.type === 'doctor_call');
                      if (!hasStart) { setRetro({ open: true, key: 'doctor_call' }); return; }
                    }
                    quickEvent(key as string);
                  }} className={`px-3 py-2 rounded border disabled:opacity-50 flex items-center gap-2 ${badgeClasses(key as string)}`}>{icon}{label as string}</button>
                ))}
              </div>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-sm opacity-70 mb-1">Exames e Procedimentos</h4>
              <div className="flex gap-2 flex-wrap">
                {[
                  ['lab_collect', 'laboratório - coleta', <LabIcon key="i" width={16} height={16} />],
                  ['lab_result', 'laboratório - resultado', <LabIcon key="i" width={16} height={16} />],
                  ['exam_req', 'exame solicitado', <LabIcon key="i" width={16} height={16} />],
                  ['exam_result', 'exame - resultado', <LabIcon key="i" width={16} height={16} />],
                  ['ultrasound_done', 'ultrassom - realizado', <UltrasoundIcon key="i" width={16} height={16} />],
                  ['ultrasound_result', 'ultrassom - resultado', <UltrasoundIcon key="i" width={16} height={16} />],
                  ['xray_done', 'rx - realizado', <XRayIcon key="i" width={16} height={16} />],
                  ['xray_result', 'rx - resultado', <XRayIcon key="i" width={16} height={16} />],
                  ['procedure_start', 'procedimento - início', <ProcedureIcon key="i" width={16} height={16} />],
                  ['procedure_end', 'procedimento - término', <ProcedureIcon key="i" width={16} height={16} />],
                  ['note', 'nota', <NoteIcon key="i" width={16} height={16} />]
                ].map(([key, label, icon]) => (
                  <button key={key as string} disabled={busy} onClick={() => {
                    const needStart: Record<string, string> = { lab_result: 'lab_collect', exam_result: 'exam_req', ultrasound_result: 'ultrasound_done', xray_result: 'xray_done', procedure_end: 'procedure_start' };
                    const startKey = needStart[key as string];
                    if (startKey) {
                      const hasStart = events.some(e => e.type === startKey);
                      if (!hasStart) { setRetro({ open: true, key: startKey }); return; }
                    }
                    quickEvent(key as string);
                  }} className={`px-3 py-2 rounded border disabled:opacity-50 flex items-center gap-2 ${badgeClasses(key as string)}`}>{icon}{label as string}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <h3 className="font-medium">Linha do Tempo</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs rounded border" onClick={exportTxt} disabled={!selectedEpisodeId}>Exportar TXT</button>
              <button className="px-3 py-1 text-xs rounded border" onClick={exportCsv} disabled={!selectedEpisodeId}>Exportar Excel (CSV)</button>
            </div>
          </div>
          <ul className="space-y-2">
            {timeline.map((item: any, idx: number) => {
              if (item.kind === 'pair') {
                return (
                  <li key={idx} className="text-sm border-b py-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium flex items-center gap-2">
                        <span className={badgeClasses(item.start.type)}>{item.start.type}</span>
                        <span>→</span>
                        <span className={badgeClasses(item.end.type)}>{item.end.type}</span>
                      </span>
                      <span className="opacity-70">{formatDuration(item.durationMs)}</span>
                    </div>
                    <div className="text-xs opacity-70">{new Date(item.start.occurredAt).toLocaleString()} → {new Date(item.end.occurredAt).toLocaleString()}</div>
                    {(item.start.notes || item.end.notes) && (
                      <div className="text-xs mt-1 opacity-80">{item.start.notes || item.end.notes}</div>
                    )}
                    <div className="mt-2 flex gap-2">
                      <button className="px-2 py-1 text-xs rounded border" onClick={() => setModal({ open: true, title: 'Editar descrição (início)', targetId: item.start.id, initial: item.start.notes || '' })}>Editar início</button>
                      <button className="px-2 py-1 text-xs rounded border" onClick={() => setModal({ open: true, title: 'Editar descrição (fim)', targetId: item.end.id, initial: item.end.notes || '' })}>Editar fim</button>
                    </div>
                  </li>
                );
              }
              return (
                <li key={idx} className="text-sm border-b py-2">
                  <div className="flex items-center justify-between">
                    <span className={badgeClasses(item.ev.type)}>{item.ev.type}</span>
                    <span className="opacity-70 text-xs">{new Date(item.ev.occurredAt).toLocaleString()}</span>
                  </div>
                  {item.ev.notes && <div className="text-xs mt-1 opacity-80">{item.ev.notes}</div>}
                  <div className="mt-2">
                    <button className="px-2 py-1 text-xs rounded border" onClick={() => setModal({ open: true, title: 'Editar descrição', targetId: item.ev.id, initial: item.ev.notes || '' })}>Editar</button>
                  </div>
                </li>
              );
            })}
          </ul>
          <h3 className="mt-6 font-medium">Métricas</h3>
          <StatsChart events={events} />
        </section>
      )}

      {error && <p className="mt-4 text-red-600">{error}</p>}
      <EditNoteModal
        open={modal.open}
        title={modal.title}
        initialText={modal.initial}
        saving={modal.saving}
        onCancel={() => setModal({ open: false })}
        onSave={async (text) => {
          if (!selectedEpisodeId) return;
          try {
            setModal((m) => ({ ...m, saving: true }));
            // Se a origem for criação de evento imediato
            const pending = (window as any)._pendingEvent as { key: string } | undefined;
            if (pending) {
              await createEvent({ episodeId: selectedEpisodeId, type: pending.key, notes: text || undefined });
              (window as any)._pendingEvent = undefined;
            } else if (modal.targetId) {
              await updateEventNotes(modal.targetId, text || null);
            }
            await loadEvents(selectedEpisodeId);
            setModal({ open: false });
          } finally {
            setModal({ open: false });
          }
        }}
      />

      <RetroStartModal
        open={retro.open}
        title="Início não registrado"
        initialDate={new Date()}
        initialNotes={''}
        onCancel={() => setRetro({ open: false })}
        onConfirm={async (iso, notes) => {
          if (!retro.key || !selectedEpisodeId) return;
          try {
            setRetro((r) => ({ ...r, working: true }));
            await createEvent({ episodeId: selectedEpisodeId, type: retro.key, occurredAt: iso, notes });
            setRetro({ open: false });
          } finally {
            await loadEvents(selectedEpisodeId);
          }
        }}
      />

      <ConfirmModal
        open={confirmReset.open}
        title="Resetar episódios"
        message={`Apagar TODOS os episódios e eventos do usuário "${userId}"? Esta ação não pode ser desfeita.`}
        confirmText="Apagar tudo"
        working={confirmReset.working}
        onCancel={() => setConfirmReset({ open: false })}
        onConfirm={async () => {
          try {
            setConfirmReset({ open: true, working: true });
            await resetEpisodes(userId);
            setEpisodes([]);
            setSelectedEpisodeId('');
            setEvents([]);
          } catch (e: any) {
            setError(e?.message || 'Erro ao resetar');
          } finally {
            setConfirmReset({ open: false });
          }
        }}
      />
    </main>
  );
}
