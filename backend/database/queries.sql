CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(500) NOT NULL,
);