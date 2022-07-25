CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  is_activated boolean DEFAULT false,
  password VARCHAR NOT NULL,
  refresh_token VARCHAR DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  space_available bigint DEFAULT 16,106,127,360,000
);

CREATE TABLE folders
(
  name VARCHAR NOT NULL,
  parent_id INTEGER NOT NULL DEFAULT 0,
  id SERIAL PRIMARY KEY
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
  
  name VARCHAR,
  id SERIAL PRIMARY KEY,
  size bigint NOT NULL
);