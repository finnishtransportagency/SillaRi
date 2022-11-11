alter table sillari.permit add column if not exists customer_uses_sillari boolean DEFAULT null;
comment on column sillari.permit.customer_uses_sillari is 'Does customer company use SillaRi to plan transports';
