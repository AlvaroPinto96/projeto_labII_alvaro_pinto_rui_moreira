const express = require('express');
const hbs = require('hbs');

const app = express();

app.set('view engine', 'hbs');

app.use(express.static(__dirname + "/public"));

app.get('/', (request, response) => {
		response.render('index.hbs');
		//response.send("<h1>Hello from express!</h1><p>welcome</p>");
});

app.get('/weather', (request, response) => {
        response.render('eco.hbs', {title: request.query.local});
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