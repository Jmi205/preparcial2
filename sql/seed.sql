-- ============================================================================
--  LIMPIEZA DE TABLAS
-- ============================================================================
DELETE FROM user_entity_roles_role_entity;
DELETE FROM user_entity;
DELETE FROM role_entity;

-- ============================================================================
--  INSERCIÓN DE ROLES
-- ============================================================================

INSERT INTO role_entity (role_name, description)
VALUES
  ('admin',  'Administrador del sistema'),
  ('paciente',   'Usuario estándar'),
  ('doctor',   'Profesional de la salud');

-- ============================================================================
--  INSERCIÓN DE USUARIOS
--  CONTRASEÑAS BCRYPT (10 ROUNDS):
--     admin123  -> $2b$10$25Zgr--qXd6e1sYyN9E6fOZgzE86SUFTjrQ6yNAwD1TYyzixa.dsW
--     user123   -> $2b$10$zClxoKP0Y6PZNV/sgQr.R.XvuqEwrMgmxKJfaHL5Uskf7EY3Tnc3m
-- ============================================================================

INSERT INTO user_entity (email, password, name, phone, is_active)
VALUES
  (
    'admin1@example.com',
    '$2a$10$Wpqv6yCVinpaZA9ITBgmyupVrV9cVJ2VDscrIkB8y2YoKUpdBTlBS',
    'Administrador Uno',
    '3001112233',
    TRUE
  ),
  (
    'admin2@example.com',
    '$2a$10$Wpqv6yCVinpaZA9ITBgmyupVrV9cVJ2VDscrIkB8y2YoKUpdBTlBS',
    'Administrador Dos',
    '3004445566',
    TRUE
  ),
  (
    'user1@example.com',
    '$2a$10$Wpqv6yCVinpaZA9ITBgmyupVrV9cVJ2VDscrIkB8y2YoKUpdBTlBS',
    'Usuario Normal 1',
    '3029988776',
    TRUE
  ),
  (
    'user2@example.com',
    '$2a$10$Wpqv6yCVinpaZA9ITBgmyupVrV9cVJ2VDscrIkB8y2YoKUpdBTlBS',
    'Usuario Normal 2',
    '3021122334',
    TRUE
  ),
  (
    'doc1@example.com',
    '$2a$10$Wpqv6yCVinpaZA9ITBgmyupVrV9cVJ2VDscrIkB8y2YoKUpdBTlBS',
    'Doctor Uno',
    '1216465',
    TRUE
  ),
  (
    'doc2@example.com',
    '$2a$10$Wpqv6yCVinpaZA9ITBgmyupVrV9cVJ2VDscrIkB8y2YoKUpdBTlBS',
    'Doctor Dos',
    '645612321',
    TRUE
  ),;

-- ============================================================================
--  ASIGNACIÓN DE ROLES (MANY-TO-MANY)
--
--  Mapa final:
--   - admin1@example.com  -> admin
--   - admin2@example.com  -> admin
--   - user1@example.com   -> user
--   - user2@example.com   -> user
-- ============================================================================

INSERT INTO public.user_entity_roles_role_entity(
	"userEntityId", "roleEntityId")
	VALUES 
  (
    (SELECT id FROM user_entity WHERE email = 'admin1@example.com'),
    (SELECT id FROM role_entity WHERE role_name = 'admin')
  ),
  (
    (SELECT id FROM user_entity WHERE email = 'admin2@example.com'),
    (SELECT id FROM role_entity WHERE role_name = 'admin')
  ),
  (
    (SELECT id FROM user_entity WHERE email = 'user1@example.com'),
    (SELECT id FROM role_entity WHERE role_name = 'user')
  ),
  (
    (SELECT id FROM user_entity WHERE email = 'user2@example.com'),
    (SELECT id FROM role_entity WHERE role_name = 'user')
  ),
  (
    (SELECT id FROM user_entity WHERE email = 'doc1@example.com'),
    (SELECT id FROM role_entity WHERE role_name = 'doctor')
  ),
  (
    (SELECT id FROM user_entity WHERE email = 'doc2@example.com'),
    (SELECT id FROM role_entity WHERE role_name = 'doctor')
  );

-- ============================================================================
--  FIN DEL SCRIPT
-- ============================================================================
