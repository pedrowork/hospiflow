"use client";
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';

type Props = { events: Array<{ type: string; occurredAt: string }>; };

export default function StatsChart({ events }: Props) {
  const buckets = useMemo(() => buildStats(events), [events]);
  const max = Math.max(1, ...Object.values(buckets.counts));
  const types = Object.keys(buckets.counts);
  return (
    <div className="border rounded p-3">
      <h4 className="font-medium mb-2">Métricas rápidas</h4>
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <div className="text-sm opacity-80 mb-1">Contagem por tipo</div>
          <ul className="space-y-1">
            {types.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <div className="w-32 text-xs truncate">{t}</div>
                <div className="flex-1 h-3 bg-slate-800 rounded">
                  <div className="h-3 bg-sky-600 rounded" style={{ width: `${(buckets.counts[t] / max) * 100}%` }} />
                </div>
                <div className="w-8 text-right text-xs">{buckets.counts[t]}</div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm opacity-80 mb-1">Tempos médios (min)</div>
          <ul className="space-y-1">
            {Object.keys(buckets.avgMinutes).map((k) => (
              <li key={k} className="flex items-center justify-between text-xs">
                <span>{k}</span>
                <span>{buckets.avgMinutes[k].toFixed(1)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm opacity-80 mb-1">Séries temporais (duração, minutos)</div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={buckets.series} margin={{ left: 8, right: 16, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="t" tick={{ fontSize: 10 }} minTickGap={24} />
              <YAxis tick={{ fontSize: 10 }} width={30} />
              <Tooltip formatter={(v:any)=>`${v.toFixed? v.toFixed(1): v} min`} labelFormatter={(l:any)=>new Date(l).toLocaleString()} />
              {Object.keys(buckets.seriesKeys).map((k, i) => (
                <Line key={k} type="monotone" dataKey={k} stroke={colors[i%colors.length]} strokeWidth={2} dot={false} isAnimationActive={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function buildStats(events: Array<{ type: string; occurredAt: string }>) {
  const counts: Record<string, number> = {};
  for (const e of events) counts[e.type] = (counts[e.type] ?? 0) + 1;

  const pairs: Record<string, string> = {
    call_nurse: 'nurse_arrived',
    tech_call: 'tech_arrived',
    doctor_call: 'doctor_arrived',
    lab_collect: 'lab_result',
    ultrasound_done: 'ultrasound_result',
    xray_done: 'xray_result',
    exam_req: 'exam_result',
    procedure_start: 'procedure_end',
  };
  const avgMinutes: Record<string, number> = {};
  const series: Array<any> = [];
  const seriesKeys: Record<string, true> = {};
  const acc: Record<string, { totalMs: number; n: number }> = {};
  const sorted = [...events].sort((a,b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());
  for (let i = 0; i < sorted.length; i++) {
    const start = sorted[i];
    const endType = pairs[start.type];
    if (!endType) continue;
    const j = sorted.findIndex((e, idx) => idx > i && e.type === endType);
    if (j === -1) continue;
    const ms = new Date(sorted[j].occurredAt).getTime() - new Date(start.occurredAt).getTime();
    const key = `${start.type}→${endType}`;
    acc[key] = { totalMs: (acc[key]?.totalMs ?? 0) + ms, n: (acc[key]?.n ?? 0) + 1 };
    const entry = { t: sorted[j].occurredAt, [key]: ms / 60000 } as any;
    series.push(entry);
    seriesKeys[key] = true;
  }
  for (const [k, v] of Object.entries(acc)) avgMinutes[k] = v.totalMs / v.n / 60000;
  return { counts, avgMinutes, series, seriesKeys };
}

const colors = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#a78bfa', '#06b6d4'];


