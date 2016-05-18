-- phpMyAdmin SQL Dump
-- version 4.0.10.14
-- http://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: May 18, 2016 at 01:41 AM
-- Server version: 5.5.45-cll-lve
-- PHP Version: 5.4.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `zdujkpdi_avatar`
--

-- --------------------------------------------------------

--
-- Table structure for table `frames`
--

CREATE TABLE IF NOT EXISTS `frames` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8 NOT NULL,
  `url` varchar(255) NOT NULL,
  `value` varchar(50) NOT NULL,
  `created_at` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=16 ;

--
-- Dumping data for table `frames`
--

INSERT INTO `frames` (`id`, `title`, `url`, `value`, `created_at`) VALUES
(13, 'Ch&agrave;o Má»«ng 85 Th&agrave;nh Láº­p Äo&agrave;n TNCS Há»“ Ch&iacute; Minh', '/img/frame/avatar85hutech.png', 'avatar85hutech.png', 1463549671),
(14, 'Ch&agrave;o Má»«ng 21 NÄƒm Th&agrave;nh Láº­p HUTECH', '/img/frame/21namhutech.png', '21namhutech.png', 1463549782),
(15, 'M&ugrave;a H&egrave; Xanh 2016', '/img/frame/mhx2016.png', 'mhx2016.png', 1463549796);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(32) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `access_token` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `fullname`, `access_token`) VALUES
(1, 'admin', 'd8b8ed36104188bcb8ee6eb3151f2b6c', 'Duy Cao', ''),
(2, 'quanganh', '45405651cb1441712a4f2d3c3a88244a', 'Quang Anh', '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
