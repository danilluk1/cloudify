CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  is_activated boolean DEFAULT false,
  password VARCHAR NOT NULL,
  refresh_token VARCHAR DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  space_available bigint DEFAULT 16106127360,
  max_space bigint DEFAULT 16106127360
);

CREATE TABLE folders
(
  name VARCHAR NOT NULL,
  parent_id INTEGER NOT NULL DEFAULT 0,
  id SERIAL PRIMARY KEY,
  is_root boolean DEFAULT false,
  path VARCHAR NOT NULL,
  local_path VARCHAR NOT NULL
);

CREATE TABLE user_folders
(
  user_id INTEGER,
    CONSTRAINT fk_user
      FOREIGN KEY (user_id)
        REFERENCES users(id),
  
  folder_id INTEGER,
    CONSTRAINT fk_folder
      FOREIGN KEY (folder_id)
        REFERENCES folders(id)
);

CREATE TABLE files
(
  folder_id INTEGER,
    CONSTRAINT fk_folder
      FOREIGN KEY (folder_id)
        REFERENCES folders(id),
  original_name VARCHAR,
  name VARCHAR,
  id SERIAL PRIMARY KEY,
  size bigint NOT NULL,
  path VARCHAR NOT NULL,
  type VARCHAR NOT NULL
);