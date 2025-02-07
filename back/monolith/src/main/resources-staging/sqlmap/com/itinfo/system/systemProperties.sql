--
CREATE TABLE IF NOT EXISTS system_properties (
	property            VARCHAR(50) PRIMARY KEY NOT NULL
	, property_value    VARCHAR(200)          NOT NULL
);

MERGE INTO system_properties KEY (property) VALUES ('id',                      'admin');
MERGE INTO system_properties KEY (property) VALUES ('password',                'admin!123');
MERGE INTO system_properties KEY (property) VALUES ('ip',                      '192.168.0.50');
MERGE INTO system_properties KEY (property) VALUES ('vnc_ip',                  '192.168.0.50');
MERGE INTO system_properties KEY (property) VALUES ('vnc_port',                '9999');
MERGE INTO system_properties KEY (property) VALUES ('cpu_threshold',           '80');
MERGE INTO system_properties KEY (property) VALUES ('memory_threshold',        '78');
MERGE INTO system_properties KEY (property) VALUES ('grafana_uri',             'https://192.168.0.50:3000/d-solo/8CzwBk1mk/vm-metrics');
MERGE INTO system_properties KEY (property) VALUES ('deepLearning_uri',        'https://192.168.0.50:25000/symphony/makeLearning');
MERGE INTO system_properties KEY (property) VALUES ('symphony_power_controll', false);
MERGE INTO system_properties KEY (property) VALUES ('login_limit',             '5');