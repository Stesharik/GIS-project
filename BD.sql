-- Создание базы данных
CREATE DATABASE IF NOT EXISTS `Point`;

-- Использование базы данных
USE `Point`;

-- Создание таблицы Complex
CREATE TABLE IF NOT EXISTS Complex (
  `id_points` INT NOT NULL AUTO_INCREMENT,
  `Name1` VARCHAR(45) NOT NULL,
  `CoordX` DOUBLE NOT NULL,
  `CoordY` DOUBLE NOT NULL,
  `Note` VARCHAR(255),
  PRIMARY KEY (`id_points`)
);

-- Создание таблицы Sensor
CREATE TABLE IF NOT EXISTS Sensor (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_complex` INT NOT NULL,
  `id_parametr` INT NOT NULL,
  `number` INT NOT NULL,
  `note` VARCHAR(255),
  PRIMARY KEY (`id`),
  INDEX (`id_parametr`), -- Добавлен индекс к столбцу id_parametr
  FOREIGN KEY (`id_complex`) REFERENCES `Complex`(`id_points`)
);

-- Создание таблицы Data
CREATE TABLE IF NOT EXISTS Data (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_sensor` INT NOT NULL,
  `value` DOUBLE NOT NULL,
  `date` DATE NOT NULL,
  `note` VARCHAR(255),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_sensor`) REFERENCES `Sensor`(`id`)
);

-- Создание таблицы Values
CREATE TABLE IF NOT EXISTS `Values` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` varchar(255) NOT NULL,
  primary key(`value`),
  foreign key (`id`) references `Sensor`(`id_parametr`)
);


INSERT INTO `Complex` (Name1, CoordX, CoordY, Note)
VALUES 
('Метеостанция Томск', 56.447260, 84.974563, '2002-04-21'),
('Метеостанция Кемерово', 55.296239, 86.430657, '2000-02-10'),
('Общежитие', 56.460337,84.961591, '1605-10-05'),
('10 TPU', 56.456294,84.950362, '1970-05-15');

INSERT INTO Sensor (id_complex, id_parametr, number, note)
VALUES 
(1, 1, 1, 'Датчик температуры'),
(1, 2, 2, 'Датчик влажности'),
(1, 3, 3, 'Датчик давления'),
(2, 1, 1, 'Датчик температуры'),	
(2, 2, 2, 'Датчик влажности'),
(2, 3, 3, 'Датчик давления'),
(3, 1, 1, 'Датчик температуры'),
(3, 2, 2, 'Датчик влажности'),
(3, 3, 3, 'Датчик давления'),
(4, 1, 1, 'Датчик температуры'),
(4, 2, 2, 'Датчик влажности'),
(4, 3, 3, 'Датчик давления');

-- Заполнение таблицы Data с учетом давления
INSERT INTO Data (id_sensor, value, date, note)
VALUES 
(1, 25.5, '2024-01-10', 'Температура воздуха'),
(2, 60, '2024-01-10', 'Влажность воздуха'),
(3, 1000, '2024-01-10', 'Давление воздуха'),
(4, 23, '2024-02-10', 'Температура воздуха'),
(5, 55, '2024-02-10', 'Влажность воздуха'),
(6, 1005, '2024-02-10', 'Давление воздуха'),
(7, 24, '2024-03-10', 'Температура воздуха'),
(8, 58, '2024-03-10', 'Влажность воздуха'),
(9, 1010, '2024-03-10', 'Давление воздуха'),
(10, 26, '2024-04-10', 'Температура воздуха'),
(11, 62, '2024-04-10', 'Влажность воздуха'),
(12, 1015, '2024-04-10', 'Давление воздуха');

-- Заполнение таблицы Values с учетом давления
INSERT INTO `Values` (value, id)
VALUES 
('Температура', 1),
('Влажность', 2),
('Давление', 3);


