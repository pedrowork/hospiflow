# Rastro Clínico — remete a trilha/auditoria de eventos clínicos.


# Next features (hospiflow) — roadmap de escalabilidade e qualidade

## 1) Banco e dados
- [ ] Migrar prod para PostgreSQL gerenciado com Prisma
- [ ] Índices e paginação server-side (composite indexes para timeline e filtros)
- [ ] Redis para cache (KPIs/timeline) e filas (BullMQ) para PDF, mídia e webhooks
- [ ] S3 + CDN (presigned URLs), ciclo de vida e limpeza de objetos
- [ ] Idempotência em writes (chave de dedup) e versionamento otimista (updatedAt)
- [ ] Multi-tenant/contas (future-proof): `account_id`, isolamento lógico

## 2) Resiliência e performance
- [ ] Rate limit por IP/usuário, backpressure e circuit breaker no app
- [ ] Offline-first robusto: fila de sync com backoff e resolução de conflitos
- [ ] HTTP caching (ETag/Cache-Control) + cache Redis para agregações
- [ ] Geração de relatórios/PDF assíncrona com polling/webhook

## 3) Segurança e compliance
- [ ] Secret Manager e rotação de chaves; TLS obrigatório
- [ ] PII minimizada e criptografia em repouso (colunas sensíveis)
- [ ] LGPD: rotas de export/remoção, data retention e auditoria (quem fez o quê)
- [ ] Assinatura de links/mídia (escopo, expiração)

## 4) Observabilidade e qualidade
- [ ] SLOs, métricas (Prometheus), tracing (OpenTelemetry) e Sentry para erros
- [ ] Logs estruturados (pino) com correlação (request-id/trace-id)
- [ ] Testes: unit, integração, E2E (Detox), contrato (OpenAPI), smoke pós-deploy
- [ ] ADRs, lint/pre-commit e OpenAPI documentado

## 5) Entrega e operação
- [ ] CI/CD (GitHub Actions): build, testes, lint, migrações, blue/green/rollback
- [ ] Ambientes dev/stage/prod, feature flags, migrações seguras (expand/contract)
- [ ] Infra como código e backups testados (RPO/RTO)

## 6) PWA e mobile
- [ ] Service Worker com runtime caching, background sync e fallback offline
- [ ] Web vitals + perfil de performance das telas críticas
- [ ] Push notifications (FCM/APNs/OneSignal) e deep links (futuro)

## 7) API e contratos
- [ ] Padronização de erros (RFC 7807), OpenAPI 3, versionamento de API
- [ ] Limites de payload, upload streaming, validação zod/celebrate
- [ ] Auth com refresh rotativo, expirações curtas e device binding; RBAC em fases futuras

## 8) Produto e UX
- [ ] Filtros e busca avançada na timeline; export CSV/JSON
- [ ] Métricas avançadas: p95, média móvel, heatmap por hora
- [ ] Acessibilidade WCAG 2.2 AA e i18n

> Para priorizar: Postgres + Redis + S3/CDN + BullMQ + observabilidade + OpenAPI + índices/paginação + idempotência/rate limiting.
