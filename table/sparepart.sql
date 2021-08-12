CREATE TABLE `sparepart` (
  `uuid` varchar(32) NOT NULL DEFAULT uuid(),
  `autonumber` int(11) NOT NULL,
  `part_number` varchar(50) NOT NULL,
  `part_desc` varchar(50) NOT NULL,
  `price_sale` int(11) NOT NULL,  
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` varchar(50) NOT NULL,
  `created_ts` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(50) NOT NULL,
  `updated_ts` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

ALTER TABLE `sparepart`
  ADD PRIMARY KEY (`autonumber`);

ALTER TABLE `sparepart`
  MODIFY `autonumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;