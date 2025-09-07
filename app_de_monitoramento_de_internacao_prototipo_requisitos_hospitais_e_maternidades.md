# Rastro Clínico — remete a trilha/auditoria de eventos clínicos.


# Visão
Aplicativo mobile para **pacientes e acompanhantes** monitorarem, em tempo real, a experiência de internação em **hospitais e maternidades**, registrando eventos objetivos (tempos, procedimentos, conforto, comunicação, segurança), gerando **provas/evidências**, relatórios e fluxos de **ouvidoria/cobrança qualificada**. Não substitui prontuário médico.

---

## Objetivos
- **MVP:** Registrar fatos objetivos da internação com carimbo de data, hora e local; compilar em relatório PDF/CSV; exportar para hospital/convênio/ouvidoria.
- **Experiência:** Simples para leigos, com linguagem clara, checklists orientados e lembretes automáticos.
- **Segurança:** Privacidade LGPD, criptografia e controle de consentimento.

---

## Personas e Papéis
- **Acompanhante/Paciente (padrão):** registra eventos, fotos, tempos, checklists, solicitações e gera relatório.
- **Profissional Convidado (opcional):** pode validar um evento (ex.: enfermeiro confirma medicação), sem acesso a dados sensíveis.
- **Administrador de Conta (usuário avançado):** configura templates, times, integrações e exportações.
- **Ouvidoria/Atendimento (externo):** recebe link do relatório/evidências (somente leitura) com expiração.

---

## Escopo Funcional (Requisitos Funcionais)
### 1) Acesso e Conta
1.1 Cadastro por e-mail/telefone/conta social.
1.2 Login com 2FA (SMS/Authenticator) – opcional.
1.3 Modo rápido **sem conta** (guest) com armazenamento local e opção de vincular depois.

### 2) Episódio de Internação
2.1 Criar **Episódio** (hospital, setor, leito, paciente, acompanhante, data/hora admissão, tipo: clínica/obstétrica/pediátrica/maternidade).
2.2 Suporte a **mãe-bebê** (pareamento do binômio, dados do RN, Apgar, alojamento conjunto).
2.3 Encerrar episódio (alta/transferência/óbito), com resumo automático.

### 3) Linha do Tempo de Eventos
3.1 Registrar **eventos** com um toque: "chamou enfermagem", "enfermagem chegou", "medicação aplicada", "visita médica", "exame solicitado/realizado", "refeição recebida", "troca de curativo", "banho", "dor", "queda de energia", etc.
3.2 Cada evento possui: **timestamp**, local (GPS aproximado/opcional e setor/leito), **tipo**, **responsável** (se conhecido), **observação livre**.
3.3 **Temporizadores** automáticos (start/stop) para medir tempos de espera (campainha→atendimento, pedido→realização, prescrição→administração).
3.4 **Checklist** por contexto (Segurança, Conforto, Comunicação, Maternidade, Aleitamento) – ver seção Checklists.
3.5 **Evidências**: foto/video (com aviso de privacidade), áudio curto, anexo de etiqueta/exame; hash de integridade; marca d’água temporal.
3.6 **Validação opcional**: profissional convidado pode confirmar que o ato ocorreu (botão “validar”).

### 4) Medicações e Prescrições (Opcional no MVP)
4.1 Cadastro manual simples do **horário previsto** de medicações (nome, dose, via, intervalo).
4.2 Lembretes e registro do **horário real** de administração.
4.3 Foto da **prescrição** com OCR básico (rótulo “rascunho”, revisão pelo usuário).

### 5) Comunicação e Solicitações
5.1 Registro de **solicitações** (ex.: trocar curativo, dor ≥7/10, refeição atrasada) com SLA local.
5.2 **Escalonamento** manual: se SLA do setor estourar, permitir marcar como “pendente crítico” e anotar tentativa de contato.
5.3 **Notas diárias**: resumo de evolução em linguagem simples.

### 6) Maternidade – Fluxos Específicos
6.1 Checklist pré-parto/parto/pós-parto imediato; presença de acompanhante no parto; analgesia; contato pele a pele.
6.2 Aleitamento: pega, dor, intercorrências, acesso a consultoria de amamentação.
6.3 RN: temperatura, amamentação, evacuações, triagens (otoemissões, teste do coraçãozinho), UTI Neo (se houver).

### 7) Relatórios e Cobrança Qualificada
7.1 **Relatório PDF/CSV** com linha do tempo, tempos médios, itens fora do padrão, fotos (miniaturas), e **sumário executivo**.
7.2 Geração de **link seguro** (read-only, expira) para compartilhamento com hospital/convênio/ouvidoria.
7.3 **Classificação de severidade** (baixo/médio/alto) por categoria (Segurança, Comunicação, Conforto, Processo, Maternidade).
7.4 Exportar **dados brutos** (JSON/CSV) para análise externa.

### 8) Privacidade, Consentimento e LGPD
8.1 Consentimento explícito para captura de mídia em ambiente hospitalar; aviso de não registrar outros pacientes sem autorização.
8.2 **Controle de escopo**: o usuário escolhe o que entra no relatório compartilhado.
8.3 Solicitação de **anonimização** do hospital/profissionais (opção), mantendo fatos e horários.
8.4 Rotina de **exclusão** (direito ao apagamento) e portabilidade.

### 9) Configurações e Personalização
9.1 Templates de checklists por **tipo de internação**.
9.2 Preferências de notificação; linguagem simples/avançada.
9.3 Modo **offline-first** com sincronização posterior.

### 10) Integrações (Fase 2+)
10.1 Padrões de interoperabilidade (ex.: **HL7 FHIR** – observações e episódios, quando/onde disponível).
10.2 Exportar para e-mail/WhatsApp como link seguro.
10.3 API pública para que hospitais consumam relatórios (webhook de novo relatório).

---

## Não Funcionais (NFR)
- **Segurança & LGPD:**
  - Criptografia **em trânsito TLS 1.3** e **em repouso AES‑256**.
  - **PII minimizada**; segregação de dados sensíveis; chaves rotacionadas.
  - **Controle de consentimento** e trilha de auditoria (quem viu, quando, o quê).
  - Retenção configurável; padrão 12 meses (MVP) com avisos antes da expiração.
- **Disponibilidade & Confiabilidade:** 99,5% (MVP) → 99,9% (fase 2). Backups diários; RPO 24h, RTO 4h.
- **Desempenho:** abertura da linha do tempo ≤ 2s (até 500 eventos locais); geração de PDF ≤ 15s.
- **Offline-first:** dados críticos operam localmente (SQLite), fila de sync resiliente.
- **Acessibilidade:** **WCAG 2.2 AA**, textos grandes, alto contraste, voice-over e toques grandes.
- **Usabilidade:** onboarding ≤ 3 min; jargões traduzidos para linguagem leiga; tooltips.
- **Compatibilidade:** Android 8+, iOS 13+; telas 4,7" até 7".
- **Observabilidade:** logs de app (sem PII), métricas de falha de sync, geração de relatórios.

---

## Métricas de Sucesso (KPIs)
- ≥ 80% dos usuários concluem um relatório completo no primeiro episódio.
- Redução de **tempo médio de espera** (campainha→atendimento) reportado entre episódios de um mesmo hospital.
- Taxa de relatórios com evidências ≥ 60%.
- NPS ≥ 60 do recurso de relatório.

---

## Modelagem de Dados (DBML – base para PostgreSQL)
```dbml
Table users {
  id uuid [pk]
  name text
  email text [unique]
  phone text
  password_hash text
  created_at timestamptz
}

Table episodes {
  id uuid [pk]
  user_id uuid [ref: > users.id]
  hospital_name text
  sector text
  bed text
  patient_name text
  patient_birth date
  type text // clinica, obstetrica, pediatrica, maternidade
  started_at timestamptz
  ended_at timestamptz
  is_mother_baby bool
}

Table events {
  id uuid [pk]
  episode_id uuid [ref: > episodes.id]
  type text // call_nurse, nurse_arrived, med_admin, doctor_round, exam_req, exam_done, meal, bath, curative, pain, note, custom
  planned_at timestamptz
  occurred_at timestamptz
  location_label text // setor/leito
  gps_lat double
  gps_lng double
  severity text // low, medium, high
  notes text
}

Table timers {
  id uuid [pk]
  episode_id uuid [ref: > episodes.id]
  name text
  start_event_id uuid [ref: > events.id]
  stop_event_id uuid [ref: > events.id]
  duration_sec int
}

Table checklists {
  id uuid [pk]
  episode_id uuid [ref: > episodes.id]
  template_key text // safety, comfort, communication, maternity, breastfeeding
  item_key text
  label text
  answer text // yes/no/na/scale
  answered_at timestamptz
}

Table requests {
  id uuid [pk]
  episode_id uuid [ref: > episodes.id]
  category text // nursing, medical, meal, hygiene, admin
  title text
  created_at timestamptz
  closed_at timestamptz
  status text // open, pending, escalated, closed
  sla_minutes int
}

Table evidences {
  id uuid [pk]
  episode_id uuid [ref: > episodes.id]
  event_id uuid [ref: > events.id]
  kind text // photo, video, audio, doc
  url text // storage location
  hash_sha256 text
  created_at timestamptz
}

Table reports {
  id uuid [pk]
  episode_id uuid [ref: > episodes.id]
  summary text
  pdf_url text
  csv_url text
  created_at timestamptz
}

Table shares {
  id uuid [pk]
  report_id uuid [ref: > reports.id]
  token text [unique]
  expires_at timestamptz
  scope jsonb // quais seções/anonimizações
}
```

---

## Tipos de Evento (catálogo inicial)
```json
[
  { "key": "call_nurse", "label": "Campainha acionada" },
  { "key": "nurse_arrived", "label": "Enfermagem chegou" },
  { "key": "med_admin", "label": "Medicação aplicada" },
  { "key": "doctor_round", "label": "Visita médica" },
  { "key": "exam_req", "label": "Exame solicitado" },
  { "key": "exam_done", "label": "Exame realizado" },
  { "key": "meal", "label": "Refeição recebida" },
  { "key": "curative", "label": "Curativo/troca" },
  { "key": "bath", "label": "Banho" },
  { "key": "pain", "label": "Dor (escala 0–10)" },
  { "key": "note", "label": "Nota livre" },
  { "key": "custom", "label": "Evento personalizado" }
]
```

---

## Checklists (exemplos resumidos)
**Segurança do Paciente**
- Puls. identificação conferida antes de medicamentos? (sim/não)
- Higienização de mãos observada? (sim/não)
- Piso e corrimãos seguros? (sim/não)
- Queda/risco registrado? (sim/não)

**Comunicação**
- Profissional explicou procedimento de forma clara? (sim/não)
- Informações diárias sobre evolução foram dadas? (sim/não)

**Conforto**
- Refeição no horário e dieta correta? (sim/não)
- Leito limpo e posição adequada? (sim/não)

**Maternidade**
- Acompanhante presente no parto? (sim/não)
- Contato pele a pele realizado? (sim/não)
- Aleitamento iniciado nas primeiras horas? (sim/não)

---

## Arquitetura de Referência
- **App Mobile:** React Native (Expo), **SQLite** local (expo-sqlite/watermelondb), storage seguro para mídia (criptografia local, upload via HTTPS).
- **Backend:** **NestJS** (Node.js), **PostgreSQL**, Prisma ORM; filas BullMQ (Redis) para geração de PDF e links; **S3** compatível para mídia.
- **Auth:** JWT + Refresh tokens; optional OAuth; rate limiting.
- **Relatórios:** serviço worker para compor PDF (Puppeteer/Playwright) e CSV; hash de integridade.
- **Sync:** estratégia delta (events, evidences, checklists, timers); resolução de conflitos “last-write-wins” no MVP.
- **Observabilidade:** OpenTelemetry, logs estruturados, sentry-like para erros.

### Endpoints REST (exemplo)
- `POST /auth/signup|login|refresh`
- `POST /episodes` `GET /episodes/:id`
- `POST /events` `GET /episodes/:id/events`
- `POST /timers/start` `POST /timers/stop`
- `POST /checklists` `GET /episodes/:id/checklists`
- `POST /requests` `PATCH /requests/:id`
- `POST /evidences` (upload URL pré-assinado)
- `POST /reports` `GET /reports/:id`
- `POST /shares` `GET /shares/:token`

---

## Fluxos Principais (User Flows)
1. **Criar Episódio →** preencher hospital/setor/leito → escolher tipo (maternidade?) → iniciar.
2. **Registrar Evento →** tocar no atalho → (opcional) foto/áudio → salvar → aparece na timeline.
3. **Medir Tempo de Espera →** “Campainha” (start) → “Enfermagem chegou” (stop) → tempo calculado.
4. **Solicitação com SLA →** abrir card → escolher categoria → iniciar cronômetro → marcar resolvido/escalonado.
5. **Checklist Diário →** app lembra e apresenta itens → respostas rápidas → indicadores do dia.
6. **Gerar Relatório →** escolher seções/evidências → anonimizar nomes (opção) → gerar PDF/CSV → compartilhar link.

---

## Wireframes (descrição)
- **Home (Episódio ativo):** cards de atalhos (Evento rápido, Solicitação, Checklist, Relatório), KPIs do dia (espera média, medicações atrasadas registradas, solicitações abertas).
- **Timeline:** lista cronológica com ícones por tipo, chips de tempo entre marcos, filtros (tipo/severidade). FAB “+”.
- **Novo Evento:** picker de tipo, notas, mídia; toggle de severidade; local (setor/leito).
- **Solicitações:** kanban simples (aberto/pendente/crítico/fechado) com cronômetro e SLA.
- **Checklists:** agrupados por categoria; respostas one-tap; barra de progresso do dia.
- **Relatório:** pré-visualização; seleção de conteúdo; botão “Gerar e Compartilhar”.
- **Configurações:** privacidade/consentimento, idioma, templates.

---

## Critérios de Aceite (amostra)
- **Evento rápido:** usuário consegue registrar “Campainha” em ≤ 3 toques; evento aparece imediatamente na timeline com horário correto.
- **Temporizador:** ao marcar “Enfermagem chegou”, tempo entre eventos é calculado e exibido em chip.
- **Checklist diário:** notificação dispara no horário configurado e permite responder sem abrir o app (quick actions).
- **Relatório PDF:** contém sumário com 5 métricas (total de eventos, SLA médio, nº solicitações críticas, atrasos de medicação, checklists incompletos) + linha do tempo compacta + anexo de miniaturas.
- **Compartilhamento:** link expira no tempo configurado; abre visão somente leitura, sem download de originais (apenas PDF).

---

## Roadmap
- **MVP (4–6 semanas equivalentes):** Episódio, Timeline, Eventos rápidos, Temporizadores, Checklists básicos, Relatório PDF, Compartilhamento, Offline básico.
- **Fase 2:** Medicações (OCR rascunho), Solicitações com SLA, Anonimização avançada, Painel web do relatório, Internacionalização completa.
- **Fase 3:** Integração FHIR, validação por profissional, analytics comparativos, templates por hospital.

---

## Riscos & Mitigações
- **Captação indevida de imagem** → avisos contextuais + máscaras de rosto (beta) + campo de consentimento.
- **Latência de upload em 4G** → compressão de mídia + fila offline + reenvio com backoff.
- **Conflitos de edição** → estratégia LWW no MVP, evoluir para CRDT em fases futuras.
- **Adoção por leigos** → UX com microtextos, ícones claros, linguagem não técnica.

---

## Testes (amostra)
- **Unitários:** criação de evento, cálculo de durações, filtros.
- **Integração:** geração de PDF com mídia, expiração de link.
- **E2E:** fluxo completo de um dia de internação simulada; modo offline→sync.
- **Acessibilidade:** navegação por leitor de tela e contraste.

---

## Política de Privacidade (resumo para o app)
- Dado coletado **somente** para montar o relatório de experiência.
- Usuário controla o que compartilha; pode excluir tudo a qualquer momento.
- Mídia armazenada com criptografia; links expiram; logs sem PII.

---

### Observação Legal
Este aplicativo **não substitui** o prontuário oficial, nem orienta conduta clínica. Objetivo: **documentar fatos** para melhoria de processos e canais de ouvidoria.

