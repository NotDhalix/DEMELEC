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


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `demelec`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admin`
--

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Crear tabla `admin` (sin dependencias)
CREATE TABLE `admin` (
  `id_admin` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_admin` varchar(1000) NOT NULL,
  `apellido_admin` varchar(1000) NOT NULL,
  `cedula` varchar(1000) NOT NULL,
  `correo_admin` varchar(1000) NOT NULL,
  `contra_admin` varchar(1000) NOT NULL,
  `fecha_naci` date DEFAULT NULL,
  `fecha_creacion` date DEFAULT NULL,
  PRIMARY KEY (`id_admin`),
  UNIQUE KEY `cedula` (`cedula`),
  UNIQUE KEY `correo_admin` (`correo_admin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `admin` (`id_admin`, `nombre_admin`, `apellido_admin`, `cedula`, `correo_admin`, `contra_admin`, `fecha_naci`, `fecha_creacion`) VALUES
(1, 'Jesus', 'Linares', '8-979-1507', 'jesuslinares@gmail.com', 'Panama2025$', '2014-11-01', '0000-00-00'),
(2, 'Jesus', 'Linares', '8-979-1506', 'jesuslinares963@gmail.com', 'Panama2025$', NULL, NULL);

-- Crear tabla `partidopolitico` (sin dependencias)
CREATE TABLE `partidopolitico` (
  `id_pp` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_pp` varchar(1000) NOT NULL,
  `correo_pp` varchar(1000) NOT NULL,
  `lugar_pp` varchar(1000) NOT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `fecha_modificacion` date DEFAULT NULL,
  PRIMARY KEY (`id_pp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `partidopolitico` (`id_pp`, `nombre_pp`, `correo_pp`, `lugar_pp`, `fecha_creacion`, `fecha_modificacion`) VALUES
(1, 'partido1', 'jesuslinares963@gmail.com', 'San Antonio', '0000-00-00', NULL);

-- Crear tabla `candidatos` (con clave foránea `id_pp`)
CREATE TABLE `candidatos` (
  `id_candidato` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_c` varchar(1000) NOT NULL,
  `cedula_c` varchar(1000) NOT NULL,
  `edad` int(11) NOT NULL,
  `id_pp` int(11) NOT NULL,
  `correo` varchar(1000) NOT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_candidato`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `cedula_c` (`cedula_c`),
  KEY `id_pp` (`id_pp`),
  KEY `id_admin` (`creado_por`),
  CONSTRAINT `fk_candidatos_pp` FOREIGN KEY (`id_pp`) REFERENCES `partidopolitico` (`id_pp`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `candidatos` (`id_candidato`, `nombre_c`, `cedula_c`, `edad`, `id_pp`, `correo`, `fecha_creacion`, `creado_por`) VALUES
(1, 'Juan', '89-223-32', 32, 1, 'jesuslinares963@gmail.com', NULL, NULL);

-- Crear tabla `elecciones` (con clave foránea `creado_por`)
CREATE TABLE `elecciones` (
  `id_elecciones` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(1000) NOT NULL,
  `año` varchar(1000) NOT NULL,
  `fecha` date NOT NULL,
  `fecha_creacion` date NOT NULL,
  `creado_por` int(11) NOT NULL,
  PRIMARY KEY (`id_elecciones`),
  KEY `id_admin` (`creado_por`),
  CONSTRAINT `fk_elecciones_admin` FOREIGN KEY (`creado_por`) REFERENCES `admin` (`id_admin`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear tabla `eleccion_candidato` (con claves foráneas `id_elecccion` e `id_candidato`)
CREATE TABLE `eleccion_candidato` (
  `id_eleccion_candidato` int(11) NOT NULL AUTO_INCREMENT,
  `id_elecccion` int(11) NOT NULL,
  `id_candidato` int(11) NOT NULL,
  PRIMARY KEY (`id_eleccion_candidato`),
  KEY `id_eleccion` (`id_elecccion`),
  KEY `id_candidato` (`id_candidato`),
  CONSTRAINT `fk_eleccion_candidato_eleccion` FOREIGN KEY (`id_elecccion`) REFERENCES `elecciones` (`id_elecciones`) ON DELETE CASCADE,
  CONSTRAINT `fk_eleccion_candidato_candidato` FOREIGN KEY (`id_candidato`) REFERENCES `candidatos` (`id_candidato`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear tabla `modificacion_candidatos` (con claves foráneas `id_candidato` y `modificado_por`)
CREATE TABLE `modificacion_candidatos` (
  `id_candidatos_mod` int(11) NOT NULL AUTO_INCREMENT,
  `id_candidato` int(11) NOT NULL,
  `fecha_modificacion` date DEFAULT NULL,
  `modificado_por` int(11) NOT NULL,
  PRIMARY KEY (`id_candidatos_mod`),
  KEY `id_admin` (`modificado_por`),
  KEY `id_candidato` (`id_candidato`),
  CONSTRAINT `fk_modificacion_candidatos_candidato` FOREIGN KEY (`id_candidato`) REFERENCES `candidatos` (`id_candidato`) ON DELETE CASCADE,
  CONSTRAINT `fk_modificacion_candidatos_admin` FOREIGN KEY (`modificado_por`) REFERENCES `admin` (`id_admin`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear tabla `modificacion_elecciones` (con claves foráneas `id_eleccion` y `modificado_por`)
CREATE TABLE `modificacion_elecciones` (
  `id_eleccciones_mod` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_modificacion` date DEFAULT NULL,
  `modificado_por` int(11) NOT NULL,
  `id_eleccion` int(11) NOT NULL,
  PRIMARY KEY (`id_eleccciones_mod`),
  KEY `id_admin` (`modificado_por`),
  KEY `id_eleccion` (`id_eleccion`),
  CONSTRAINT `fk_modificacion_elecciones_admin` FOREIGN KEY (`modificado_por`) REFERENCES `admin` (`id_admin`) ON DELETE CASCADE,
  CONSTRAINT `fk_modificacion_elecciones_eleccion` FOREIGN KEY (`id_eleccion`) REFERENCES `elecciones` (`id_elecciones`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear tabla `votante` (sin dependencias)
CREATE TABLE `votante` (
  `id_votante` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_v` varchar(1000) NOT NULL,
  `apellido_v` varchar(1000) NOT NULL,
  `cedula_v` varchar(1000) NOT NULL,
  `fecha_naci` date NOT NULL,
  `correo` varchar(1000) NOT NULL,
  `contraseña` varchar(1000) NOT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `mod` date DEFAULT NULL,
  `votacion_realizada` tinyint(1) DEFAULT NULL,
  `fecha_votacion` date DEFAULT NULL,
  PRIMARY KEY (`id_votante`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear tabla `votos` (con claves foráneas `id_elecciones` e `id_candidato`)
CREATE TABLE `votos` (
  `id_voto` int(11) NOT NULL AUTO_INCREMENT,
  `id_elecciones` int(11) NOT NULL,
  `id_candidato` int(11) NOT NULL,
  `cantidad_votos` int(11) NOT NULL DEFAULT 0,
  `fecha_voto` date NOT NULL,
  PRIMARY KEY (`id_voto`),
  KEY `id_elecciones` (`id_elecciones`),
  KEY `id_candidato` (`id_candidato`),
  CONSTRAINT `fk_votos_eleccion` FOREIGN KEY (`id_elecciones`) REFERENCES `elecciones` (`id_elecciones`) ON DELETE CASCADE,
  CONSTRAINT `fk_votos_candidato` FOREIGN KEY (`id_candidato`) REFERENCES `candidatos` (`id_candidato`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;
