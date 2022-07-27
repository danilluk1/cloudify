TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE folders CASCADE;
TRUNCATE TABLE user_folders CASCADE;
TRUNCATE TABLE files CASCADE;


/*get user folders*/
WITH RECURSIVE r AS(
	SELECT id, parent_id, name
	FROM folders
	WHERE parent_id = 2
	
	UNION
	
	SELECT folders.id, folders.parent_id, folders.name
	FROM folders
		JOIN r
			ON folders.parent_id = r.id
)
SELECT * from r;

SELECT folders.id as "folder_id", folders.name as "folder_name", files.name, files.size, files.id as "file_id" from folders
JOIN files ON files.folder_id=folders.id;
