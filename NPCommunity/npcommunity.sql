-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-06-2024 a las 17:55:40
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `npcommunity`
--
CREATE DATABASE IF NOT EXISTS `npcommunity` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `npcommunity`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chat`
--

CREATE TABLE `chat` (
  `id` int(5) NOT NULL,
  `id_usuario_1` int(5) NOT NULL,
  `id_usuario_2` int(5) NOT NULL,
  `id_producto` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `chat`
--

INSERT INTO `chat` (`id`, `id_usuario_1`, `id_usuario_2`, `id_producto`) VALUES
(1, 7, 11, 2),
(14, 10, 7, 1),
(17, 8, 11, 2),
(45, 7, 8, 3),
(48, 9, 8, 3),
(49, 10, 8, 6),
(50, 10, 7, 4),
(51, 10, 11, 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentario`
--

CREATE TABLE `comentario` (
  `id` int(5) NOT NULL,
  `id_usuario` int(5) NOT NULL,
  `id_post` int(5) NOT NULL,
  `tipo` varchar(10) DEFAULT NULL,
  `contenido` varchar(300) NOT NULL,
  `fecha_hora` timestamp NOT NULL DEFAULT current_timestamp()
) ;

--
-- Volcado de datos para la tabla `comentario`
--

INSERT INTO `comentario` (`id`, `id_usuario`, `id_post`, `tipo`, `contenido`, `fecha_hora`) VALUES
(1, 10, 1, NULL, 'Ese es mi jugador fav ????', '2024-05-31 19:14:36'),
(2, 9, 1, NULL, 'Ese era un chupon no valia pa naaa', '2024-05-31 19:15:47'),
(3, 11, 1, NULL, 'Que va a mi tambien me gusta', '2024-05-31 19:16:04'),
(4, 8, 1, NULL, 'ese quie es??', '2024-05-31 19:16:14'),
(5, 9, 5, NULL, 'vaya coche feo, ajajajajaja si digo de que parece me llevan preso... ajaajjajaajaj ????', '2024-06-01 09:50:05'),
(6, 9, 6, NULL, 'Pues si macho, yo creo que te han engañado, mala suerte. Me apruebas???=)', '2024-06-01 09:50:42'),
(7, 9, 4, NULL, 'que vaaaaa ese es kebin duradero no??', '2024-06-01 09:55:35'),
(8, 9, 3, NULL, 'rataaaa', '2024-06-02 11:06:03'),
(9, 7, 9, NULL, 'friki.', '2024-06-02 12:37:04'),
(10, 10, 10, NULL, 'Que va, no tines ni ideaaaaa, la mejor es la de KDA sin ninguna duda', '2024-06-02 12:49:03'),
(11, 10, 9, NULL, 'la verdad es que si, willy es mucho mejor', '2024-06-02 12:54:55'),
(12, 9, 9, NULL, 'viva wigetta', '2024-06-02 13:09:53'),
(13, 8, 11, NULL, 'si digo lo que opino me llevan presa... y posiblemente me hagas repetir otra vez', '2024-06-02 13:11:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupo`
--

CREATE TABLE `grupo` (
  `id` int(5) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `id_usu_creador` int(5) NOT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `grupo`
--

INSERT INTO `grupo` (`id`, `nombre`, `id_usu_creador`, `foto_perfil`, `descripcion`) VALUES
(1, 'NBA', 7, 'nba.png', 'Este grupo es para subir jugadores de la nba'),
(2, 'Pokemon', 11, 'pokemon.png', 'En este grupo podeis subir vuestro pokemon favorito y curiosidades sobre ellos =)\r\n'),
(3, 'Cocheees', 9, 'coches.jpg', 'Subir buestros mejores coches y opino a ver si son mejor que el mio, tambien podeis subir otro tipo de vehiculos'),
(4, 'Minecraft', 7, 'minecraft-logo.jpg', 'Se pueden subir novedades sobre este juegazo'),
(5, 'Tartariense', 8, 'tartaria.jpeg', 'Pues no se, publicar aqui lo que os de la gana'),
(6, 'Lol', 11, 'lol-logo.jpg', 'Lig of leyens. este juego es una drogaaaaaa'),
(7, 'GTA V Roleplay', 9, 'roleplay.jpg', 'Aqui ire subiendo lo que me pase en esta nueva aventura\r\n');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupo_seguido`
--

CREATE TABLE `grupo_seguido` (
  `id` int(5) NOT NULL,
  `id_grupo` int(5) NOT NULL,
  `id_usuario` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `grupo_seguido`
--

INSERT INTO `grupo_seguido` (`id`, `id_grupo`, `id_usuario`) VALUES
(1, 2, 8),
(3, 1, 9),
(8, 5, 7),
(14, 4, 8),
(15, 6, 10),
(16, 4, 10),
(17, 3, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensaje`
--

CREATE TABLE `mensaje` (
  `id` int(5) NOT NULL,
  `id_chat` int(5) NOT NULL,
  `id_usu_emisor` int(5) NOT NULL,
  `id_usu_receptor` int(5) NOT NULL,
  `contenido` varchar(300) NOT NULL DEFAULT '0',
  `fecha_hora` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `mensaje`
--

INSERT INTO `mensaje` (`id`, `id_chat`, `id_usu_emisor`, `id_usu_receptor`, `contenido`, `fecha_hora`) VALUES
(1, 1, 7, 11, 'Hola', '2024-05-31 19:20:34'),
(4, 1, 7, 11, 'los has usadoo?', '2024-05-31 19:27:05'),
(5, 1, 7, 11, '?', '2024-05-31 19:27:26'),
(6, 1, 11, 7, 'No estan nuevos', '2024-05-31 19:27:42'),
(7, 1, 7, 11, 'no estan nuevos o no, estan nuevos', '2024-05-31 19:28:47'),
(8, 1, 11, 7, 'No, estan nuevos', '2024-05-31 19:31:48'),
(22, 14, 10, 7, 'a', '2024-05-31 20:22:41'),
(25, 14, 10, 7, 'a', '2024-05-31 20:23:10'),
(26, 14, 10, 7, 'a', '2024-05-31 20:23:14'),
(27, 14, 10, 7, 's', '2024-05-31 20:23:17'),
(28, 17, 8, 11, 'Holaaaaa', '2024-06-01 09:27:49'),
(30, 17, 8, 11, 'estan muy caretes no??', '2024-06-01 09:28:49'),
(89, 45, 7, 8, 'hola', '2024-06-02 12:06:39'),
(92, 45, 7, 8, 'hola', '2024-06-02 12:07:08'),
(93, 45, 7, 8, 'caracola', '2024-06-02 12:07:12'),
(94, 48, 9, 8, 'siuuu', '2024-06-02 12:07:39'),
(95, 48, 9, 8, 'holaaaaa', '2024-06-02 12:07:48'),
(96, 45, 8, 7, 'holaaaa', '2024-06-02 12:08:56'),
(97, 45, 8, 7, 'holaaaa', '2024-06-02 12:09:00'),
(98, 45, 8, 7, 'holaa', '2024-06-02 12:09:06'),
(99, 49, 10, 8, 'ya me jodería, ajaajjaajajaj, te han echadoooooo', '2024-06-02 13:23:54'),
(100, 50, 10, 7, 'Ojiito esta bien chula ehhh, a cuanto me la dejas?', '2024-06-02 13:24:24'),
(101, 51, 10, 11, 'te has pasado con el precio macho', '2024-06-02 13:24:49'),
(104, 50, 7, 10, 'hola', '2024-06-02 13:26:56'),
(109, 50, 7, 10, 'pues si me apruebasss...', '2024-06-02 13:28:40'),
(110, 50, 7, 10, '2.5 €', '2024-06-02 13:28:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificacion`
--

CREATE TABLE `notificacion` (
  `id` int(5) NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `id_tipo_not` int(5) NOT NULL,
  `id_emisor` int(5) NOT NULL,
  `id_receptor` int(5) NOT NULL,
  `fecha_hora` timestamp NOT NULL DEFAULT current_timestamp()
) ;

--
-- Volcado de datos para la tabla `notificacion`
--

INSERT INTO `notificacion` (`id`, `tipo`, `id_tipo_not`, `id_emisor`, `id_receptor`, `fecha_hora`) VALUES
(1, 'mensaje', '89', 7, 8, '2024-06-03 12:19:45'),
(2, 'mensaje', '92', 7, 8, '2024-06-03 12:19:48'),
(3, 'seguidor', '8', 7, 8, '2024-06-04 10:25:10'),
(4, 'respuesta', '5', 9, 8, '2024-06-04 10:26:59'),
(5, 'respuesta', '7', 9, 8, '2024-06-04 10:27:29'),
(6, 'respuesta', '8', 9, 8, '2024-06-04 10:28:03'),
(7, 'respuesta', '9', 7, 8, '2024-06-04 10:31:06'),
(8, 'respuesta', '11', 10, 8, '2024-06-04 10:31:06'),
(9, 'respuesta', '12', 9, 8, '2024-06-04 10:31:06'),
(10, 'publicacion', '8', 7, 8, '2024-06-04 11:12:39');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `post`
--

CREATE TABLE `post` (
  `id` int(5) NOT NULL,
  `id_usuario` int(5) NOT NULL,
  `id_grupo` int(5) NOT NULL,
  `tipo` varchar(10) DEFAULT NULL,
  `contenido` varchar(1000) NOT NULL,
  `fecha_hora` timestamp NOT NULL DEFAULT current_timestamp(),
  `foto` varchar(225) DEFAULT NULL,
  `archivo` varchar(255) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `post`
--

INSERT INTO `post` (`id`, `id_usuario`, `id_grupo`, `tipo`, `contenido`, `fecha_hora`, `foto`, `archivo`) VALUES
(1, 7, 1, NULL, 'F en el chat, era bueno el tio este eeeehh, mejor con el 24 que con el 8', '2024-05-31 19:11:05', 'kobe.jpg', 'kobe.jpg'),
(2, 11, 2, NULL, 'El dormilon, nunca supe como se llama, pero esta to guapo, es to tanque y pega galletones como panes\r\n', '2024-06-01 09:22:29', 'snorlax.jpg', ''),
(3, 8, 2, NULL, 'La rata electricaaaa, pika pikaaaaaaa', '2024-06-01 09:31:07', 'pikachu.jpg', 'pikachu.jpg'),
(4, 8, 1, NULL, 'Este es maikle yordan no???', '2024-06-01 09:35:49', 'lebron.jpg', ''),
(5, 8, 3, NULL, 'Mi coche tiene muchos colorines a que molaaaaaa, bueno es el de mi hermano, ajjajajajaaj', '2024-06-01 09:45:38', 'coche-colores.jpg', ''),
(6, 10, 3, NULL, 'La semana pasada me compree este coche y creo que me han engañado. Me gaste 3500€ y ya hace un sonido raro, lo peor es que el tio me dijo que estaba nuevo y que tenia me nos de 10.000km', '2024-06-01 09:48:50', 'coche-antiguo.jpg', ''),
(7, 9, 1, NULL, 'Boooof el mejor de la historia, el GOAT(greit of ol of taims)\r\n(nunca supe come se escribe ?)', '2024-06-01 09:54:59', 'jordan.jpg', ''),
(8, 7, 5, NULL, 'Tal cual hermano, tal cual, el cubo de fornite paso hace 47años.\r\n(47-4+2-9)/3=13. Casualidad?', '2024-06-02 12:28:23', 'tal-cual-hermanojpg.jpg', ''),
(9, 8, 4, NULL, 'NUEVA SERIEEEEEEEE AAAA. No me lo puedo creer, estoy soñando??\r\nadjunto link para ver el video', '2024-06-02 12:36:55', 'vegetta.jpg', 'rickroll.jpg'),
(10, 11, 6, NULL, 'lo que me acaba de tocaaar, es la mejor skin de akaliiiii y solo me he dejado 25€, lets gooooo', '2024-06-02 12:48:24', 'Akali.jpg', ''),
(11, 10, 4, NULL, 'ya tengo desfraz para la siguiente gaymerGY. puntuen en lo comentarios', '2024-06-02 12:54:31', 'creeper.jpg', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id` int(5) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `id_usuario` int(5) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `precio` varchar(10) NOT NULL,
  `foto` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id`, `nombre`, `id_usuario`, `descripcion`, `precio`, `foto`) VALUES
(1, 'Cami de pokemon', 7, 'Camisea de pokemon nueva, Talla S ', '11', 'cami-pok.png'),
(2, 'Pantacas', 11, 'Pantalones de la maraca \"marca\", talla L', '25,44', 'pantalones.jpg'),
(3, 'Sudadera to waaaaapa', 8, 'Esta muy usada y huele bastante mal, Talla M', '15', 'sudadera-karasuno.png'),
(4, 'Camiseta del señor a', 7, 'Cami del chico araña de tirantes, perfecta para ir al gym. Talla S', '15,4', 'camiseta-araña.jpg'),
(5, 'Camiseta de lebron j', 7, 'Camiseton oficial de la NBA, esta poco usada, cualquier pregunta escribeeee', '75', 'camiseta-nba.jpg'),
(6, 'Equipacion voleibol', 8, 'equipacion de mi antiguo equipo de voley.\r\n(si me han echado ?)', '12,2', 'equipacion_volei.jpg'),
(7, 'Zapatillas Converse', 11, 'Las robe las el ultimo dia antes de dejar de trabajar estan nuevas y son talla 38', '30', 'converse.jpg'),
(8, 'Jordan 4 sb', 11, 'Me tocaron en el sorteo de nike, no son fake, tengo el ticket', '450', 'Retro4.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(5) NOT NULL,
  `nom_usuario` varchar(20) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `apellidos` varchar(20) NOT NULL,
  `correo` varchar(50) NOT NULL,
  `clave` varchar(50) NOT NULL,
  `rol` int(1) NOT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `emailValidado` int(11) NOT NULL DEFAULT 0,
  `codigoRecuperacion` varchar(20) NOT NULL,
  `baneado` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nom_usuario`, `nombre`, `apellidos`, `correo`, `clave`, `rol`, `foto_perfil`, `bio`, `emailValidado`, `codigoRecuperacion`, `baneado`) VALUES
(7, 'miguel', 'Miguelito', 'Bourdette Collado', 'miguel@gmail.com', '1234', 1, 'russ.jpg', 'biografia bio bio biografia bio bio biograf ia bio bio biog rafia bio bio biografia bio bio bio rafia bio bio biograf ia bio bio bio grafia bio bio ', 1, 0, 0),
(8, 'laura', '', '', 'laura@correo.com', '1234', 0, 'haikiu.jpg', 'no tengo bio =(', 1, 0, 0),
(9, 'alex', '', '', 'alex@correo.com', '1234', 0, 'vaca.jpg', 'Muevo vacas =0', 1, 0, 0),
(10, 'dani', '', '', 'dani@gmail.com', '1234', 0, 'eevee.png', NULL, 1, 0, 0),
(11, 'kavi', '', '', 'kavi@gmail.com', '1234', 0, 'scuirtle.jpg', NULL, 1, 0, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `USU_1_FK` (`id_usuario_1`),
  ADD KEY `USU_2_FK` (`id_usuario_2`),
  ADD KEY `CHAT_PROD_FK` (`id_producto`);

--
-- Indices de la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ID_USU_FK` (`id_usuario`),
  ADD KEY `ID_PST_FK` (`id_post`);

--
-- Indices de la tabla `grupo`
--
ALTER TABLE `grupo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `USU_CREADOR_FK` (`id_usu_creador`);

--
-- Indices de la tabla `grupo_seguido`
--
ALTER TABLE `grupo_seguido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `GRUPO_FK` (`id_grupo`),
  ADD KEY `USUARIO_FK` (`id_usuario`);

--
-- Indices de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD PRIMARY KEY (`id`),
  ADD KEY `CHAT_FK` (`id_chat`),
  ADD KEY `USU_EMI_FK` (`id_usu_emisor`),
  ADD KEY `USU_RECE_FK` (`id_usu_receptor`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `EMISOR` (`id_emisor`),
  ADD KEY `RECEPTOR` (`id_receptor`);

--
-- Indices de la tabla `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `USU_FK` (`id_usuario`),
  ADD KEY `GRP_FK` (`id_grupo`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `USU_PROD_FK` (`id_usuario`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT de la tabla `comentario`
--
ALTER TABLE `comentario`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `grupo`
--
ALTER TABLE `grupo`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `grupo_seguido`
--
ALTER TABLE `grupo_seguido`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificacion`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `post`
--
ALTER TABLE `post`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `CHAT_PROD_FK` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `USU_1_FK` FOREIGN KEY (`id_usuario_1`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `USU_2_FK` FOREIGN KEY (`id_usuario_2`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD CONSTRAINT `ID_PST_FK` FOREIGN KEY (`id_post`) REFERENCES `post` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ID_USU_FK` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `grupo`
--
ALTER TABLE `grupo`
  ADD CONSTRAINT `USU_CREADOR_FK` FOREIGN KEY (`id_usu_creador`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `grupo_seguido`
--
ALTER TABLE `grupo_seguido`
  ADD CONSTRAINT `GRUPO_FK` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `USUARIO_FK` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD CONSTRAINT `CHAT_FK` FOREIGN KEY (`id_chat`) REFERENCES `chat` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `USU_EMI_FK` FOREIGN KEY (`id_usu_emisor`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `USU_RECE_FK` FOREIGN KEY (`id_usu_receptor`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificacion`
  ADD CONSTRAINT `TIPOS` CHECK (`tipo` IN ('mensaje', 'publicacion', 'respuesta', 'seguidor')),
  ADD CONSTRAINT `EMISOR` FOREIGN KEY (`id_emisor`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `RECEPTOR` FOREIGN KEY (`id_receptor`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `GRP_FK` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `USU_FK` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `USU_PROD_FK` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
