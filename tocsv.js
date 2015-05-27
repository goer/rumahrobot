var jf = require('jsonfile')
var util = require('util')
var _ = require("underscore")
var s = require("underscore.string")
var moment = require('./moment-with-locale.js')
moment.locale(['id', 'en'])
var json2csv = require('json2csv');
var Q = require('q');
var fs = require('fs')

var fileName = fileName
var outputFile = outputFile    

var filter = function(data) {

        if (s.include(data.price, 'miliar')) {
            //console.log('transform miliar:' + data.price)
            data.price = s.replaceAll(data.price, 'miliar', '')
            var n = s.toNumber(data.price, 1)
                //console.log('number:' + n)
            data.price = n * (1000 * 1000 * 1000);
            //console.log('now:' + data.price);
        }

        if (s.include(data.price, 'juta')) {
            //console.log('transform juta:' + data.price)
            data.price = s.replaceAll(data.price, 'juta', '')
            var n = s.toNumber(data.price, 1)
                //console.log('number:' + n)
            data.price = n * (1000 * 1000);
            //console.log('now:' + data.price);
        }

        if (s.include(data.lt, 'm 2 tanah')) {
            //console.log('transform m 2 tanah:' + data.lt)
            var m = s.replaceAll(data.lt, 'm 2 tanah', '')
            var n = s.toNumber(m, 1)
                //console.log('number:' + n)
            data.lt = n;
            //console.log('now:' + data.lt);
        }

        if (s.include(data.lb, 'm 2 bangunan')) {
            //console.log('transform m 2 bangunan:' + data.lb)
            var m = s.replaceAll(data.lb, 'm 2 bangunan', '')
            var n = s.toNumber(m, 1)
                //console.log('number:' + n)
            data.lb = n;
            //console.log('now:' + data.lb);
        }


        //console.log('Convert str date to date: ' + data.date2)
        var ds = s.words(data.date2)
            //console.log('to:' + ds)
        moment.locale('id')
        var m = moment(data.date2, "DD MMM YYYY");
        //console.log('date: ' + m.toDate())
        data.date2 = m.toDate()

        // if < 100jt it means price per m2
        if (data.price < (100 * 1000 * 1000)) {
            data.price = data.price * data.lt
        }
        //per m2 tanah
        data.perlt = data.price / data.lt
        data.perltlb = (data.price - (data.lb * 1000000)) / data.lt



    }

var toCSV = function(csvline) {
        var fields = [
            'image',
            'title',
            'description',
            'price',
            'lt',
            'lb',
            'perlt',
            'perltlb',
            'kt',
            'km',
            'region',
            // 'agent',
            // 'hp', 
            'date2'
        ]

        json2csv({
            data: csvline,
            fields: fields,
            hasCSVColumnTitle: false
        }, function(err, c) {
            if (err) {
                console.error(err)
                throw err;
            }
            //console.log('csv:' + c);
            fs.appendFile(outputFile, c, function(err) {})
        })

    }    

var convertToCsv = function(xfrom, xto) {
        var d = Q.defer();

        var y = xfrom;
        var ymax = xto;
        for (var i = y; i <= ymax; i++) {

            var fn = fileName + '_' + i + '.json';
            console.log('============= FileName:' + fn)
            jf.readFile(fn, function(err, obj) {

                if (obj != null) {

                    var csvline = [];
                    var datas = obj.results;
                    console.log('DATA LEN:' + datas.length)


                    _.each(datas, function(data) {
                        filter(data)
                        csvline.push(data)
                    })

                    toCSV(csvline);
                }

            })

        }

        return d.promise;
    }    



var rumahcsv = function(fn, of) {

    fileName = fn
    outputFile = of

    return {

    	convertToCsv : convertToCsv,
    	toCSV : toCSV,
    	filter : filter,

    };

}

exports.rumahcsv = rumahcsv