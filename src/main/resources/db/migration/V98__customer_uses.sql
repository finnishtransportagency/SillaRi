alter table sillari.permit add column if not exists customer_uses_sillari boolean;
comment on column sillari.route.ordinal is 'Does customer company use SillaRi to plan transports';
