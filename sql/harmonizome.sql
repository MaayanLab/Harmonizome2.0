# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.17)
# Database: Harmonizome2.0
# Generation Time: 2018-02-26 16:04:01 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table associations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `associations`;

CREATE TABLE `associations` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `dataset` varchar(120) DEFAULT NULL,
  `attribute` varchar(120) DEFAULT NULL,
  `gene` varchar(50) DEFAULT NULL,
  `weight` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table categories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) DEFAULT NULL,
  `stat` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table citations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `citations`;

CREATE TABLE `citations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `resource` varchar(200) DEFAULT NULL,
  `citation` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_citations_citation` (`citation`),
  KEY `ix_citations_resource` (`resource`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table data_set
# ------------------------------------------------------------

DROP TABLE IF EXISTS `data_set`;

CREATE TABLE `data_set` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(120) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  `measurement` varchar(120) DEFAULT NULL,
  `association` varchar(250) DEFAULT NULL,
  `category` varchar(120) DEFAULT NULL,
  `sub_category` varchar(120) DEFAULT NULL,
  `resource` varchar(120) DEFAULT NULL,
  `views` int(11) DEFAULT NULL,
  `numb_genes` int(11) DEFAULT NULL,
  `numb_associations` int(11) DEFAULT NULL,
  `numb_gene_associations` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_data_set_association` (`association`),
  KEY `ix_data_set_numb_gene_associations` (`numb_gene_associations`),
  KEY `ix_data_set_category` (`category`),
  KEY `ix_data_set_name` (`name`),
  KEY `ix_data_set_resource` (`resource`),
  KEY `ix_data_set_description` (`description`),
  KEY `ix_data_set_numb_genes` (`numb_genes`),
  KEY `ix_data_set_numb_associations` (`numb_associations`),
  KEY `ix_data_set_measurement` (`measurement`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table files
# ------------------------------------------------------------

DROP TABLE IF EXISTS `files`;

CREATE TABLE `files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `dataset` varchar(200) DEFAULT NULL,
  `file_type` varchar(60) DEFAULT NULL,
  `external_link` varchar(500) DEFAULT NULL,
  `date_submission` varchar(120) DEFAULT NULL,
  `submitter` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_files_external_link` (`external_link`),
  KEY `ix_files_file_type` (`file_type`),
  KEY `ix_files_dataset` (`dataset`),
  KEY `ix_files_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table gene
# ------------------------------------------------------------

DROP TABLE IF EXISTS `gene`;

CREATE TABLE `gene` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `symbol` varchar(64) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `old_symbol` varchar(200) DEFAULT NULL,
  `old_name` varchar(600) DEFAULT NULL,
  `synonyms` varchar(200) DEFAULT NULL,
  `name_synonyms` varchar(600) DEFAULT NULL,
  `chromosome` varchar(64) DEFAULT NULL,
  `accession_numbers` varchar(64) DEFAULT NULL,
  `entrez_gene_id` varchar(64) DEFAULT NULL,
  `ensembl_gene_id` varchar(64) DEFAULT NULL,
  `pubmed_ids` varchar(64) DEFAULT NULL,
  `refseq_ids` varchar(200) DEFAULT NULL,
  `uniprot_id` varchar(400) DEFAULT NULL,
  `description` varchar(4000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_gene_symbol` (`symbol`),
  KEY `ix_gene_uniprot_id` (`uniprot_id`),
  KEY `ix_gene_old_name` (`old_name`),
  KEY `ix_gene_entrez_gene_id` (`entrez_gene_id`),
  KEY `ix_gene_synonyms` (`synonyms`),
  KEY `ix_gene_ensembl_gene_id` (`ensembl_gene_id`),
  KEY `ix_gene_name` (`name`),
  KEY `ix_gene_name_synonyms` (`name_synonyms`),
  KEY `ix_gene_pubmed_ids` (`pubmed_ids`),
  KEY `ix_gene_chromosome` (`chromosome`),
  KEY `ix_gene_refseq_ids` (`refseq_ids`),
  KEY `ix_gene_old_symbol` (`old_symbol`),
  KEY `ix_gene_accession_numbers` (`accession_numbers`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table migrate_version
# ------------------------------------------------------------

DROP TABLE IF EXISTS `migrate_version`;

CREATE TABLE `migrate_version` (
  `repository_id` varchar(250) NOT NULL,
  `repository_path` text,
  `version` int(11) DEFAULT NULL,
  PRIMARY KEY (`repository_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table resources
# ------------------------------------------------------------

DROP TABLE IF EXISTS `resources`;

CREATE TABLE `resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `external_link` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table sub_categories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sub_categories`;

CREATE TABLE `sub_categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) DEFAULT NULL,
  `category` varchar(120) DEFAULT NULL,
  `stat` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(60) DEFAULT NULL,
  `_password` varchar(60) DEFAULT NULL,
  `email` varchar(60) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;