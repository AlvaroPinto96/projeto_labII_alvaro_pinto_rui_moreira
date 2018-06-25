const express = require('express');
const hbs = require('hbs');
const request = require('request');
const app = express();
const fs=require('fs');
const yargs=require('yargs');

const keys = require("./keys");



app.set('view engine', 'hbs');

app.use(express.static(__dirname + "/public"));

app.get('/', (request, response) => {


		response.render('index.hbs');
		
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
                        var precip = DSbody.hourly.data[1].precipProbability;
                        var today = new Date(DSbody.currently.time * 1000);
                        var h = today.getHours();
                        var m = today.getMinutes();
                        var windSpeed = DSbody.currently.windSpeed;
                        
                        
                        if (h >= 7 && h < 12){
                            infoHoras = "manhã";
                        } else if (h >= 12 && h < 20){
                            infoHoras = "tarde";
                        } else {
                            infoHoras = "noite";
                        }

                        

                        if (uvIndex <= 2) {
                            infoUVS = "baixo. ";
                            infoUVS2 = " Não é necessário proteção.";
                        }
                        if (uvIndex > 2 && uvIndex <= 5) {
                            infoUVS = "moderado. ";
                            infoUVS2 = " NÃO ESQUECER! Óculos de Sol e protetor solar.";
                        }
                        if (uvIndex > 5 && uvIndex <= 7) {
                            infoUVS = "elevado. ";
                            infoUVS2 = " ATENÇÃO! Utilizar óculos de Sol com filtro UV, chapéu, t-shirt e protetor solar.";
                        }
                        if (uvIndex > 7 && uvIndex <= 10) {
                            infoUVS = "muito elevado. ";
                            infoUVS2 = " CUIDADO! Utilizar óculos de Sol com filtro UV, chapéu, t-shirt, guarda-sol, protector solar e evitar a exposição das crianças ao Sol.";
                        }
                        if (uvIndex >10) {
                            infoUVS = "extremo. ";
                            infoUVS2 = " PERIGO! Evitar o mais possível a exposição ao Sol. Aproveite para descansar em casa.";
                        }
                        
                        

                        res.render('index.hbs', 
                        {localizacao: "Localização: " + formatted_address,
                        horas: "São " + h + ":" + m + " da " + infoHoras,
                        temperatura: "Temperatura: " + temperature + "ºC",
                        temperatura_aparente: "Temperatura aparente: " + apparentTemperature + "ºC",
                        humidade: "Humidade: " + humidity*100 + "%",
                        indice_uvs: "Índice de ultravioletas " + infoUVS + " (" + uvIndex + ") " + infoUVS2,
                        precipitacao: "Probabilidade de precipitação: "  + precip*100 + "%",
                        ventos: "Ventos a " + windSpeed + "km/h"
                        });
                    });
        
             
               });
		/*response.send("<h1>About this page</h1><p>very cool</p>" 
		{
		name: '�lvaro',
		likes: ['reading', 'playing', 'hiking']
		}
		);*/
});

app.get('/precip', (req, res) => {
    var address=req.query.local;
        var encodedAddress = encodeURIComponent(address);

        request({
        
                url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${keys.googleKey}`,
                json: true
                }, (error,response,body) => {
                
                var lat = body.results[0].geometry.location.lat;
                var lng = body.results[0].geometry.location.lng;
                var formatted_address = body.results[0].formatted_address;

                request ({
                    url: `https://api.darksky.net/forecast/${keys.darkskyKey}/${lat},${lng}?units=si`,
                    json: true
                    }, (DSerror, DSresponse, DSbody) => {

                    var precip = DSbody.hourly.data[1].precipProbability;

                    res.render('index.hbs',{
                        precipitacao: "Probabilidade de precipitação: "  + precip*100 + "%",
                    });
                });
            });

     
       });

app.listen(3500);