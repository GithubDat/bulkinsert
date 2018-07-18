var csv = require('fast-csv');
var mongoose = require('mongoose');
var Voucher = require('./voucher');

exports.post = function (req, res) {
	if (!req.
		
		files)
		return res.status(400).send('No files were uploaded.');
	
	var voucherFile = req.files.file;

	var vouchers = [];
		
	csv
	 .fromString(voucherFile.data.toString(), {
		 headers: true,
		 ignoreEmpty: true
	 })
	 .on("data", function(data){
		 var chunk_size = 100;
		 var results = [];

		 if (data.length> 100) {	 
			while (data.length) {
				data['_id'] = new mongoose.Types.ObjectId();
				results.push(data.splice(0, chunk_size));
			}
		 }else {
			data['_id'] = new mongoose.Types.ObjectId();			
			results= data;
		 }		 
		 vouchers.push(results);
	 })
	 .on("end", function(){
		 Voucher.create(vouchers, function(err, documents) {
			if (err) throw err;
			
			res.send(vouchers.length + ' vouchers have been successfully uploaded.');
		 });
	 });
};