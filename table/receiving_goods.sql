CREATE TABLE `receiving_goods` (
  `uuid` varchar(32) NOT NULL DEFAULT uuid(),
  `autonumber` int(11) NOT NULL,
  `trans_number` varchar(50) NOT NULL,
  `trans_date` varchar(50) NOT NULL,
  `supplier_id` int(11) NOT NULL,  
  `created_by` varchar(50) NOT NULL,
  `created_ts` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(50) NOT NULL,
  `updated_ts` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

ALTER TABLE `receiving_goods`
  ADD PRIMARY KEY (`autonumber`);

ALTER TABLE `receiving_goods`
  MODIFY `autonumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;