alter table sillari.supervision add column if not exists supervisor text;
comment on column sillari.supervision.supervisor is 'Supervising transport company or area contractor business ID';
