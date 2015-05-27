var rmh=require('./rumah.js')

// rmh.rumah(
// 		{
// 			fileName: 'data/senayan',
// 	    	page: 1,
// 	    	daerah: ['patal senayan', 'senayan', 'permata hijau'],
// 	    	jenis: 'RUMAH',
// 	    	kota: 'Jakarta Selatan'
// 		}
// 	)
// 	.fetchMulti(1,10)
// 	.end()
// 	.then(function result(r){
// 		console.log(r);
// 	})


var r = require('./tocsv.js')
var rcsv = r.rumahcsv('data/senayan','senayan.csv')
rcsv.toCsv=function(csvline){
	console.log('csvline:'+csvline)
}
rcsv.convertToCsv(1,10)