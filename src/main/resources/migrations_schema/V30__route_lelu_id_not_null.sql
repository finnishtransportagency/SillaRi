-- make route.lelu_id not null because it comes from lelu interface and is's mandatory there
-- we need to update lelu_id to existing test data routes

CREATE SEQUENCE IF NOT EXISTS todo_remove_test_lelu_id_seq;

SELECT setval('todo_remove_test_lelu_id_seq', 998877, true);  --random start value, hope that doesn't clash with lelu vals
UPDATE sillari.route SET lelu_id = nextval('todo_remove_test_lelu_id_seq') WHERE lelu_id IS NULL;

DROP SEQUENCE IF EXISTS todo_remove_test_lelu_id_seq;

alter table sillari.route alter column lelu_id set not null;
