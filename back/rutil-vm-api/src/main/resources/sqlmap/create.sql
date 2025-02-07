CREATE TABLE IF NOT EXISTS refresh_token (
	uuid UUID PRIMARY KEY NOT NULL
	, external_id VARCHAR(512) NOT NULL
	, refresh_token VARCHAR(200) NOT NULL
);
