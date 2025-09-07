const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

export type Episode = {
  id: string;
  userId: string;
  hospitalName: string;
  type: string;
  startedAt: string;
  endedAt?: string | null;
};

export async function listEpisodes(userId: string): Promise<Episode[]> {
  const url = new URL('/episodes', API_BASE_URL);
  url.searchParams.set('userId', userId);
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error('Falha ao listar episódios');
  return res.json();
}

export async function createEpisode(input: {
  userId: string;
  hospitalName: string;
  type: string;
  startedAt?: string;
  isMotherBaby?: boolean;
}): Promise<Episode> {
  const res = await fetch(`${API_BASE_URL}/episodes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Falha ao criar episódio');
  return res.json();
}

export async function listEvents(episodeId: string) {
  const url = new URL('/events', API_BASE_URL);
  url.searchParams.set('episodeId', episodeId);
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error('Falha ao listar eventos');
  return res.json();
}

export async function createEvent(input: {
  episodeId: string;
  type: string;
  occurredAt?: string;
  notes?: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Falha ao criar evento');
  return res.json();
}

export async function resetEpisodes(userId: string): Promise<{ deletedEpisodes: number }> {
  const url = new URL('/episodes/reset', API_BASE_URL);
  url.searchParams.set('userId', userId);
  const res = await fetch(url.toString(), { method: 'DELETE' });
  if (!res.ok) throw new Error('Falha ao resetar episódios');
  return res.json();
}

export async function updateEventNotes(id: string, notes: string | null) {
  const res = await fetch(`${API_BASE_URL}/events/${id}/notes`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes }),
  });
  if (!res.ok) throw new Error('Falha ao atualizar descrição');
  return res.json();
}

export async function seedDemo(userId: string): Promise<{ ok: boolean; userId: string; episodeId: string }> {
  const res = await fetch(`${API_BASE_URL}/dev/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error('Falha ao carregar dados demo');
  return res.json();
}


