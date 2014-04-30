-- phpMyAdmin SQL Dump
-- version 3.3.9.2
-- http://www.phpmyadmin.net
--
-- Värd: localhost
-- Skapad: 30 april 2014 kl 23:14
-- Serverversion: 5.5.9
-- PHP-version: 5.3.5

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Databas: `cf_storage`
--

-- --------------------------------------------------------

--
-- Struktur för tabell `shoes`
--

CREATE TABLE `shoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `color` int(11) NOT NULL,
  `size` int(11) NOT NULL,
  `in_stock` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=17 ;

--
-- Data i tabell `shoes`
--

INSERT INTO `shoes` VALUES(1, 'Mimer', 10, 20, 30);
INSERT INTO `shoes` VALUES(2, 'Mimer', 10, 24, 8);
INSERT INTO `shoes` VALUES(3, 'Madicken', 40, 19, 20);
INSERT INTO `shoes` VALUES(15, 'Mimer', 50, 22, 3);
