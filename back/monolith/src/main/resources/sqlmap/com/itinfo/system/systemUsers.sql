CREATE TABLE IF NOT EXISTS system_users (
	no                  int AUTO_INCREMENT PRIMARY KEY  NOT NULL
	, id                VARCHAR(30)                     NOT NULL
	, password          VARCHAR(200)                    NOT NULL
	, administrative    BOOLEAN
	, name              VARCHAR(100)                    NOT NULL
	, last_name         VARCHAR(100)
	, principal         VARCHAR(100)
	, namespace         VARCHAR(100)
	, email             VARCHAR(50)
	, auth_provider     VARCHAR(100)
	, role_id           VARCHAR(100)
	, login_count       INT
	, block_time        VARCHAR(14)
);

INSERT INTO system_users (
    no, id, password, administrative, name
    , last_name, principal, namespace, email, auth_provider
    , role_id, login_count, block_time
) SELECT
    1, 'admin', '1000:08b8ee8e392be3758eb3e6da5162e63f536b9baef34ecd6a:39d1ca299c9eb764c18a722d221e0e77f6156280f056b9b0', true, 'administrator'
    , '', '', '*', '', 'internal-authz'
    , '', 0, ''
FROM
    DUAL
WHERE NOT EXISTS (
    SELECT
        no, id, password, administrative, name
        , last_name, principal, namespace, email, auth_provider
        , role_id, login_count, block_time
    FROM
        system_users
    WHERE 1=1
    AND no = 1
);