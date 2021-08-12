CREATE TABLE `stock_detail` (
  `uuid` varchar(32) NOT NULL DEFAULT uuid(),
  `autonumber` int(11) NOT NULL,
  `trans_source` varchar(50) NOT NULL,
  `trans_id` varchar(50) NOT NULL,
  `part_id` int(11) NOT NULL,  
  `qty_in` int(11) NOT NULL,  
  `qty_out` int(11) NOT NULL,  
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` varchar(50) NOT NULL,
  `created_ts` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(50) NOT NULL,
  `updated_ts` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

ALTER TABLE `stock_detail`
  ADD PRIMARY KEY (`autonumber`);

ALTER TABLE `stock_detail`
  MODIFY `autonumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;