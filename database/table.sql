CREATE TABLE user_rating (id TEXT, emoji TEXT, author VARCHAR(255), created BIGINT, FOREIGN KEY (account) REFERENCES accounts(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE);