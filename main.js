const request=require('request');
const fs=require('fs');
const yargs=require('yargs');
const argv = yargs.argv;

var googleKey = "AIzaSyCOHWQeslpAf1avsCha6xODKhEX9dKxj8s";
var darkskyKey = "0052d90410b78b92bebefef86f2b4fe4";

var address = argv.address;
var encodedAddress = encodeURIComponent(address);

request({

		url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${googleKey}`,
		json: true
		}, (error,response,body) => {
        
        var lat = body.results[0].geometry.location.lat;
        var lng = body.results[0].geometry.location.lng;
		var formatted_address = body.results[0].formatted_address;

        console.log("latitude:"+lat);
        console.log("longitude:"+lng);
		console.log("Morada: "+formatted_address)

		request ({
			url: `https://api.darksky.net/forecast/${darkskyKey}/${lat},${lng}?units=si`,
			json: true
			}, (DSerror, DSresponse, DSbody) => {
				var temperature = DSbody.currently.temperature;
                var apparentTemperature = DSbody.currently.apparentTemperature;
                var humidity = DSbody.currently.humidity;
                var uvIndex = DSbody.currently.uvIndex;
                var precipitacao = DSbody.minutely.precipProbability;
                var today = new Date(DSbody.currently.time * 1000);
                var h = today.getHours();
                var m = today.getMinutes();
                var s = today.getSeconds();
                
                if (h <= 12){
                    console.log("Boa noite!" + h + "h " + m + "m " + s + "s")
                } else {
                    console.log("Bom dia!" + h + "h " + m + "m " + s + "s")
                }
				console.log("Temperatura: "+temperature + "ºC");
                console.log("Temperatura aparente: "+apparentTemperature + "ºC");
                console.log("Humidade: " + humidity*100 + "%");

                if (uvIndex <= 2) {
                    console.log("Índice de ultravioletas baixo: " + uvIndex);
                }
                if (uvIndex > 2 && uvIndex <= 5) {
                    console.log("Índice de ultravioletas médio: " + uvIndex);
                }
                
                console.log("Probabilidade de precipitação "+ precipitacao*100 + "%");
			});


       });


      