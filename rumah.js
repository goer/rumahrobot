//rumah.js

var unirest = require('unirest')
var Q = require('q')
var sleep = require('sleep')
var S = require("underscore.string")

var rumah = function(params) {

	var d = Q.defer();

	//var target = "url=http%3A%2F%2Frumahdijual.com%2Fcarirumah.php%3Ftransaksi%3DBELI%26jenis%3DRUMAH%26kota%3DJakarta%2BSelatan%26q%3Dantasari%252C%2Bampera%252C%2Bcilandak%252C%2Bcipete%252C%2Bfatmawati%252C%2Bgandaria%252C%2Bkebayoran%2Bbaru%252C%2Bkemang%252C%2Blebak%2Bbulus%252C%2Bpanglima%2Bpolim%252C%2Bpondok%2Bindah%252C%2Bpondok%2Blabu%252C%2Bpondok%2Bpinang"
	var api_key = "&_user=f22b2064-d01b-491a-9c93-6e1874244120&_apikey=f22b2064-d01b-491a-9c93-6e1874244120:l2ZjBM7qPTIPFhoNzaNuwhA7p6mxbhBU2/LFBGoA24m23ipkJLfg/pwydfhXMIe9hyYsWqyeUI8ykzCLU4/dwQ=="

	//var tpl = 'http://rumahdijual.com/carirumah.php?transaksi=BELI&jenis=RUMAH&kota=Jakarta+Selatan&x=39&y=16&minprice=&maxprice=3500000000&ltmin=100&ktmin=&q=antasari,+ampera,+cilandak,+cipete,+fatmawati,+gandaria,+kebayoran+baru,+kemang,+lebak+bulus,+panglima+polim,+pondok+indah,+pondok+labu,+pondok+pinang&sort=0'


    var targetUrl = "http://rumahdijual.com/carirumah.php?transaksi=BELI";
    var url = "https://api.import.io/store/data/85fd9d8f-71ff-4531-a0c3-226790fca313/_query?input/webpage/" 

    var default_params = {

	    jenis: 'RUMAH',
	    kota: 'Jakarta Selatan',
	    price_max: '',
	    lt_min: '',
	    daerah: '',
	    page: 0,
	    fileName : 'data/jaksel'

	}

	var params = params;
	if (!params) params = default_params;

	var cnt=0;

	var	funcs = {

		save : function(response){

			var jf = require('jsonfile')
            var util = require('util')

            console.log('Saving : ' + cnt)
            jf.writeFileSync( ( params.fileName || defult_params.fileName )+ '_' + cnt + '.json', response.body)
            d.resolve('OK:'+cnt);
            sleep.sleep(1)

            return this;

        },

        createTargetUrl: function() {

            if (params.jenis) {
                targetUrl += '&jenis=' + (params.jenis || default_params.jenis);
            }
            if (params.kota) {
                targetUrl += '&kota=' + S.replaceAll((params.kota || default_params.kota),' ','+');
            }
            if (params.price_max) {
                targetUrl += '&maxprice=' + (params.price_max || default_params.price_max);
            }
            if (params.lt_min) {
                targetUrl += '&ltmin=' + (params.lt_min || default_params.lt_min);
            }
            if (params.daerah) {
                targetUrl += '&q=';
                
                for (var z = 0; z < params.daerah.length; z++) {
                    if (z > 0)
                       targetUrl += "%2C"
                    targetUrl  += S.replaceAll(' '+params.daerah[z],' ','+');
                }
                
            }
            if (params.page) {
                targetUrl += '&p=' + (params.page || default_params.page);
            }

            console.log('target url: '+targetUrl)
            //encodeURIComponent();
            return this;

        },

        end : function(){

        	return d.promise;

        },
        fetch : function(i){

        	    console.log('Fetching : ' + i)
        	    
        	    targetUrl = "http://rumahdijual.com/carirumah.php?transaksi=BELI";
    			url = "https://api.import.io/store/data/85fd9d8f-71ff-4531-a0c3-226790fca313/_query?input/webpage/url=" 
    			//url = "https://api.import.io/store/connector/d50aff7b-ad19-4f64-ab1a-1e8f9a1bb249/_query?input=webpage/url:"

                params.page=i;
                this.createTargetUrl();
                console.log('----> targetQuery: '+targetUrl)
                url += encodeURIComponent(targetUrl) + api_key
                console.log('url : ' + url)

                unirest.get(url)
                .headers({
                    'Accept': 'application/json'
                })
                .strictSSL(false)
                .end(function(response) {
                	funcs.save(response);
                	cnt++;
                })

                return this;

        },
        fetchMulti: function(xfrom,xto) {

            cnt = xfrom

            for (var i=xfrom; i < xto + 1; i++) {
            	this.fetch(i);
            	sleep.sleep(2);
            }

            return this;

        }

    }

    return funcs;
}

exports.rumah = rumah;

