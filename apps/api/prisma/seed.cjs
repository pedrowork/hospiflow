// Simple Prisma seed for SQLite dev
// Run: npm run seed (in apps/api)

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function minutesAgo(n) {
  return new Date(Date.now() - n * 60 * 1000);
}

async function main() {
  // Users
  const users = [
    { id: 'demo-user-1', email: 'demo-user-1@local', name: 'Demo User 1' },
    { id: 'demo-user-2', email: 'demo-user-2@local', name: 'Demo User 2' },
  ];
  for (const u of users) {
    await prisma.user.upsert({ where: { id: u.id }, update: {}, create: { ...u, passwordHash: 'seed' } });
  }

  // Episodes
  const ep1 = await prisma.episode.create({
    data: {
      userId: 'demo-user-1',
      hospitalName: 'Hospital Demo',
      sector: 'Clínica Geral',
      bed: 'A12',
      patientName: 'Maria Demo',
      type: 'clinica',
      startedAt: minutesAgo(240),
    },
  });

  const ep2 = await prisma.episode.create({
    data: {
      userId: 'demo-user-2',
      hospitalName: 'Maternidade Modelo',
      sector: 'Alojamento conjunto',
      bed: 'M05',
      patientName: 'Joana Demo',
      type: 'maternidade',
      startedAt: minutesAgo(720),
      endedAt: minutesAgo(60),
      isMotherBaby: true,
    },
  });

  // Helpers
  async function addEvent(episodeId, type, minAgo, notes, plannedMinAgo) {
    return prisma.event.create({
      data: {
        episodeId,
        type,
        occurredAt: minutesAgo(minAgo),
        notes: notes || null,
        plannedAt: typeof plannedMinAgo === 'number' ? minutesAgo(plannedMinAgo) : null,
      },
    });
  }

  async function addPairWithTimer(episodeId, startType, endType, startMinAgo, durationMin, startNotes, endNotes) {
    const start = await addEvent(episodeId, startType, startMinAgo, startNotes);
    const end = await addEvent(episodeId, endType, startMinAgo - durationMin, endNotes);
    await prisma.timer.create({
      data: {
        episodeId,
        name: `${startType}→${endType}`,
        startEventId: start.id,
        stopEventId: end.id,
        durationSec: durationMin * 60,
      },
    });
  }

  // Episode 1 samples
  await addPairWithTimer(ep1.id, 'call_nurse', 'nurse_arrived', 120, 3, 'Campainha', 'Atendimento iniciado');
  await addPairWithTimer(ep1.id, 'doctor_call', 'doctor_arrived', 90, 12, 'Solicitada avaliação', 'Médico no leito');
  await addPairWithTimer(ep1.id, 'lab_collect', 'lab_result', 80, 45, 'Coleta: hemograma', 'Laudo disponível');
  await addPairWithTimer(ep1.id, 'xray_done', 'xray_result', 40, 15, 'RX tórax AP', 'Sem alterações agudas');
  await addPairWithTimer(ep1.id, 'procedure_start', 'procedure_end', 25, 20, 'Curativo iniciado', 'Curativo finalizado');
  // Notes only
  await addEvent(ep1.id, 'note', 110, 'Paciente referiu dor 6/10');
  await addEvent(ep1.id, 'note', 70, 'Hidratação orientada');

  // Requests (SLA)
  await prisma.request.createMany({
    data: [
      { episodeId: ep1.id, category: 'nursing', title: 'Trocar curativo', createdAt: minutesAgo(30), status: 'pending', slaMinutes: 60 },
      { episodeId: ep1.id, category: 'meal', title: 'Refeição atrasada', createdAt: minutesAgo(100), closedAt: minutesAgo(80), status: 'closed', slaMinutes: 45 },
    ],
  });

  // Checklists
  await prisma.checklist.createMany({
    data: [
      { episodeId: ep1.id, templateKey: 'safety', itemKey: 'id_bracelet', label: 'Pulseira conferida', answer: 'yes', answeredAt: minutesAgo(200) },
      { episodeId: ep1.id, templateKey: 'communication', itemKey: 'daily_update', label: 'Atualização diária dada', answer: 'no', answeredAt: minutesAgo(100) },
    ],
  });

  // Evidences (placeholders)
  const evForPhoto = await addEvent(ep1.id, 'note', 60, 'Foto do curativo adicionada');
  await prisma.evidence.create({ data: { episodeId: ep1.id, eventId: evForPhoto.id, kind: 'photo', url: 'https://example.com/photo.jpg', hashSha256: 'demo', createdAt: minutesAgo(60) } });

  // Episode 2 (maternidade)
  await addPairWithTimer(ep2.id, 'call_nurse', 'nurse_arrived', 600, 4, 'Apoio aleitamento', 'Enfermeira presente');
  await addPairWithTimer(ep2.id, 'ultrasound_done', 'ultrasound_result', 540, 35, 'USG obstétrica', 'Laudo liberado');
  await prisma.checklist.createMany({
    data: [
      { episodeId: ep2.id, templateKey: 'maternity', itemKey: 'skin_to_skin', label: 'Pele a pele', answer: 'yes', answeredAt: minutesAgo(700) },
      { episodeId: ep2.id, templateKey: 'breastfeeding', itemKey: 'latch', label: 'Pega adequada', answer: 'yes', answeredAt: minutesAgo(680) },
    ],
  });

  console.log('Seed completed. Episodes:', ep1.id, ep2.id);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });


