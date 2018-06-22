const express = require('express');
const hbs = require('hbs');
const request = require('request');
const app = express();

const keys = require("./keys");

app.set('view engine', 'hbs');

app.use(express.static(__dirname + "/public"));

app.get('/', (request, response) => {


		response.render('index.hbs');
		//response.send("<h1>Hello from express!</h1><p>welcome</p>");
});

app.get('/weather', (req, res) => {
        
      var address=req.query.local;
        var encodedAddress = encodeURIComponent(address);

        request({
        
                url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${keys.googleKey}`,
                json: true
                }, (error,response,body) => {
                
                var lat = body.results[0].geometry.location.lat;
                var lng = body.results[0].geometry.location.lng;
                var formatted_address = body.results[0].formatted_address;
        
                console.log("latitude:"+lat);
                console.log("longitude:"+lng);
                console.log("Morada: "+formatted_address)
        
                request ({
                    url: `https://api.darksky.net/forecast/${keys.darkskyKey}/${lat},${lng}?units=si`,
                    json: true
                    }, (DSerror, DSresponse, DSbody) => {
                        var temperature = DSbody.currently.temperature;
                        var apparentTemperature = DSbody.currently.apparentTemperature;
                        var humidity = DSbody.currently.humidity;
                        var uvIndex = DSbody.currently.uvIndex;
                        var precipitacao = DSbody.hourly.data[1].precipProbability;
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

                        res.render('index.hbs', {texto: temperature });
                    });
        
             
               });
		/*response.send("<h1>About this page</h1><p>very cool</p>" 
		{
		name: '�lvaro',
		likes: ['reading', 'playing', 'hiking']
		}
		);*/
});

app.get('/carochao', (request, response) => {
		var date = new Date().toString();
		response.send(`<h1>Current time</h1><p>${date}</p>`);
});

app.listen(3500);