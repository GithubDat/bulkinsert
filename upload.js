var csv = require('fast-csv');
var mongoose = require('mongoose');
var Voucher = require('./voucher');

const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('a', function(arg) {
	console.log('ev emitted', arg.length);
	Voucher.create(arg, function(err, documents){
		if (err) throw err;
	});
	});

exports.post = function (req, res) {
	if (!req.files)
		return res.status(400).send('No files were uploaded.');
	
	var voucherFile = req.files.file;
	var vouchers = [];
	var results = [];
		
	csv
	 .fromString(voucherFile.data.toString(), {
		 headers: true,
		 ignoreEmpty: true
	 })
	 .on("data", function(data){
		const chunk_size = 1000;
		data['_id'] = new mongoose.Types.ObjectId();
		results.push(data);		
		if(results && results.length> 0){
			if(results.length % chunk_size === 0){
				emitter.emit('a', results);
				results = [];
				vouchers = [];
			} else { 
			// if (count > chunk_size){
			// 	console.log("Entered else if with count", count);				
				
			// 	while (results.em !== null || results !== '') {
			// 	console.log("Entered while wit results", results.length);				
			}		 
		} else {}
	 })
	 .on("end", function(){
		console.log("Entered end");
		if(results && results.length > 0){
			Voucher.create(results, function(err, documents){
				if (err) throw err;
			});
		} else {}
		res.send(' vouchers have been successfully uploaded.');
	 });
};