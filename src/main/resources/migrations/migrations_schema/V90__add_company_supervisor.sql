alter table sillari.supervision add column if not exists supervisor_company text;
comment on column sillari.supervision.supervisor_company is 'Supervising transport company or area contractor business ID';
