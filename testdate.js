var moment = require('./moment-with-locale.js')

var d='21 Mei 2015'

moment.locale('id')
var x=moment(d,'DD MMM YYYY')
var r=new Date(x)

console.log('D:'+d+' R:'+r)


var url="http://rumahdijual.com/carirumah.php?transaksi=BELI&jenis=RUMAH&kota=Jakarta+Selatan&x=39&y=16&minprice=&maxprice=3500000000&ltmin=100&ktmin=&q=antasari%2C+ampera%2C+cilandak%2C+cipete%2C+fatmawati%2C+gandaria%2C+kebayoran+baru%2C+kemang%2C+lebak+bulus%2C+panglima+polim%2C+pondok+indah%2C+pondok+labu%2C+pondok+pinang&sort=0"
console.log('url: '+unescape(url))

var func = function(){

	var x = function(){
			console.log('x')
			return this;
	}

	var y = function(){
			console.log('-- y')
			this.x();
			return this;
	}


	return {
		x : x,
		y : y
	};

}

var z=func()
z.x=function(){
	console.log('modified')
}
z.x()
z.y()