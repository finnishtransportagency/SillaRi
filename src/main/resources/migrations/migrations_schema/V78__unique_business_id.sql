ALTER TABLE company ALTER business_id SET NOT NULL;
ALTER TABLE company ADD CONSTRAINT unique_business_id UNIQUE(business_id);
