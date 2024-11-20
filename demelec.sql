-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-11-2024 a las 16:54:58
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- Base de datos: `demelec`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admin`
--

CREATE TABLE `admin` (
  `id_admin` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre_admin` VARCHAR(1000) NOT NULL,
  `apellido_admin` VARCHAR(1000) NOT NULL,
  `cedula` VARCHAR(1000) NOT NULL,
  `correo_admin` VARCHAR(1000) NOT NULL,
  `contra_admin` VARCHAR(1000) NOT NULL,
  `fecha_naci` DATE DEFAULT NULL,
  `fecha_creacion` DATE DEFAULT NULL,
  PRIMARY KEY (`id_admin`),
  UNIQUE KEY `cedula` (`cedula`),
  UNIQUE KEY `correo_admin` (`correo_admin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `admin` (`id_admin`, `nombre_admin`, `apellido_admin`, `cedula`, `correo_admin`, `contra_admin`, `fecha_naci`, `fecha_creacion`) VALUES
(1, 'Jesus', 'Linares', '8-979-1507', 'jesuslinares@gmail.com', 'Panama2025$', '2014-11-01', '0000-00-00'),
(2, 'Jesus', 'Linares', '8-979-1506', 'jesuslinares963@gmail.com', 'Panama2025$', NULL, NULL);

-- Crear tabla `partidopolitico`
CREATE TABLE `partidopolitico` (
  `id_pp` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre_pp` VARCHAR(1000) NOT NULL,
  `correo_pp` VARCHAR(1000) NOT NULL,
  `lugar_pp` VARCHAR(1000) NOT NULL,
  `fecha_creacion` DATE DEFAULT NULL,
  `fecha_modificacion` DATE DEFAULT NULL,
  PRIMARY KEY (`id_pp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `partidopolitico` (`id_pp`, `nombre_pp`, `correo_pp`, `lugar_pp`, `fecha_creacion`, `fecha_modificacion`) VALUES
(1, 'partido1', 'jesuslinares963@gmail.com', 'San Antonio', '0000-00-00', NULL);

-- Crear tabla `candidatos`
CREATE TABLE `candidatos` (
  `id_candidato` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre_c` VARCHAR(1000) NOT NULL,
  `cedula_c` VARCHAR(1000) NOT NULL,
  `edad` INT(11) NOT NULL,
  `id_pp` INT(11) NOT NULL,
  `correo` VARCHAR(1000) NOT NULL,
  `fecha_creacion` DATE DEFAULT NULL,
  `creado_por` INT(11) DEFAULT NULL,
  PRIMARY KEY (`id_candidato`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `cedula_c` (`cedula_c`),
  KEY `id_pp` (`id_pp`),
  KEY `id_admin` (`creado_por`),
  CONSTRAINT `fk_candidatos_pp` FOREIGN KEY (`id_pp`) REFERENCES `partidopolitico` (`id_pp`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `candidatos` (`id_candidato`, `nombre_c`, `cedula_c`, `edad`, `id_pp`, `correo`, `fecha_creacion`, `creado_por`) VALUES
(1, 'Juan', '89-223-32', 32, 1, 'jesuslinares963@gmail.com', NULL, NULL);

-- Crear tabla `elecciones`
CREATE TABLE `elecciones` (
  `id_elecciones` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(1000) NOT NULL,
  `año` VARCHAR(1000) NOT NULL,
  `fecha` DATE NOT NULL,
  `fecha_creacion` DATE NOT NULL,
  `creado_por` INT(11) NOT NULL,
  PRIMARY KEY (`id_elecciones`),
  KEY `id_admin` (`creado_por`),
  CONSTRAINT `fk_elecciones_admin` FOREIGN KEY (`creado_por`) REFERENCES `admin` (`id_admin`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear tabla `eleccion_candidato`
CREATE TABLE `eleccion_candidato` (
  `id_eleccion_candidato` INT(11) NOT NULL AUTO_INCREMENT,
  `id_elecccion` INT(11) NOT NULL,
  `id_candidato` INT(11) NOT NULL,
  PRIMARY KEY (`id_eleccion_candidato`),
  KEY `id_eleccion` (`id_elecccion`),
  KEY `id_candidato` (`id_candidato`),
  CONSTRAINT `fk_eleccion_candidato_eleccion` FOREIGN KEY (`id_elecccion`) REFERENCES `elecciones` (`id_elecciones`) ON DELETE CASCADE,
  CONSTRAINT `fk_eleccion_candidato_candidato` FOREIGN KEY (`id_candidato`) REFERENCES `candidatos` (`id_candidato`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear tabla `modificacion_candidatos`
CREATE TABLE `modificacion_candidatos` (
  `id_candidatos_mod` INT(11) NOT NULL AUTO_INCREMENT,
  `id_candidato` INT(11) NOT NULL,
  `fecha_modificacion` DATE DEFAULT NULL,
  `modificado_por` INT(11) NOT NULL,
  PRIMARY KEY (`id_candidatos_mod`),
  KEY `id_admin` (`modificado_por`),
  KEY `id_candidato` (`id_candidato`),
  CONSTRAINT `fk_modificacion_candidatos_candidato` FOREIGN KEY (`id_candidato`) REFERENCES `candidatos` (`id_candidato`) ON DELETE CASCADE,
  CONSTRAINT `fk_modificacion_candidatos_admin` FOREIGN KEY (`modificado_por`) REFERENCES `admin` (`id_admin`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear tabla `modificacion_elecciones`
CREATE TABLE `modificacion_elecciones` (
  `id_eleccciones_mod` INT(11) NOT NULL AUTO_INCREMENT,
  `fecha_modificacion` DATE DEFAULT NULL,
  `modificado_por` INT(11) NOT NULL,
  `id_eleccion` INT(11) NOT NULL,
  PRIMARY KEY (`id_eleccciones_mod`),
  KEY `id_admin` (`modificado_por`),
  KEY `id_eleccion` (`id_eleccion`),
  CONSTRAINT `fk_modificacion_elecciones_admin` FOREIGN KEY (`modificado_por`) REFERENCES `admin` (`id_admin`) ON DELETE CASCADE,
  CONSTRAINT `fk_modificacion_elecciones_eleccion` FOREIGN KEY (`id_eleccion`) REFERENCES `elecciones` (`id_elecciones`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear tabla `votante`
CREATE TABLE `votante` (
  `id_votante` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre_v` VARCHAR(1000) NOT NULL,
  `apellido_v` VARCHAR(1000) NOT NULL,
  `cedula_v` VARCHAR(1000) NOT NULL,
  `fecha_naci` DATE NOT NULL,
  `correo` VARCHAR(1000) NOT NULL,
  `contraseña` VARCHAR(1000) NOT NULL,
  `fecha_creacion` DATE DEFAULT NULL,
  `mod` DATE DEFAULT NULL,
  `votacion_realizada` TINYINT(1) DEFAULT NULL,
  `fecha_votacion` DATE DEFAULT NULL,
  PRIMARY KEY (`id_votante`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear tabla `votos`
CREATE TABLE `votos` (
  `id_voto` INT(11) NOT NULL AUTO_INCREMENT,
  `id_elecciones` INT(11) NOT NULL,
  `id_candidato` INT(11) NOT NULL,
  `cantidad_votos` INT(11) NOT NULL DEFAULT 0,
  `fecha_voto` DATE NOT NULL,
  PRIMARY KEY (`id_voto`),
  KEY `id_elecciones` (`id_elecciones`),
  KEY `id_candidato` (`id_candidato`),
  CONSTRAINT `fk_votos_elecciones` FOREIGN KEY (`id_elecciones`) REFERENCES `elecciones` (`id_elecciones`) ON DELETE CASCADE,
  CONSTRAINT `fk_votos_candidato` FOREIGN KEY (`id_candidato`) REFERENCES `candidatos` (`id_candidato`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Finalizar la transacción
COMMIT;
