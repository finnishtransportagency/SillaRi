ALTER TABLE sillari.bridge_image DROP COLUMN IF EXISTS taken;
ALTER TABLE sillari.bridge_image ADD COLUMN IF NOT EXISTS filetype text;