const express = require('express');


const app = express();
const port = 3000;


function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}


app.use(express.static(__dirname + "/src"));


app.get('/', (req, res) => {
    res.send(`
		<h1>WMF Tester</h1>
		<a href="/measure">Measure</a>
        <a href="/recipe">Recipe</a>
	`);
});


app.get('/recipe', (req, res) => {
    var targets = [
        {
            "name": "eqiad",
            "target": "https://measure-eqiad.wikimedia.org/measure"
        },
        {
            "name": "codfw",
            "target": "https://measure-codfw.wikimedia.org/measure"
        },
        {
            "name": "esams",
            "target": "https://measure-esams.wikimedia.org/measure"
        },
        {
            "name": "ulsfo",
            "target": "https://measure-ulsfo.wikimedia.org/measure"
        },
        {
            "name": "eqsin",
            "target": "https://measure-eqsin.wikimedia.org/measure"
        },
        {
            "name": "drmrs",
            "target": "https://measure-drmrs.wikimedia.org/measure"
        }
    ];
    shuffleArray(targets);

    return res.json({
        "next": 0,
        "pulse_timeout": 15000,
        "targets": targets,
        "pulses": 3,
        "pulse_delay": 2000,
        "name": "WMF Tester",
        "type": "http_get",
        "ctx": {
            "server": "express",
			"ts": new Date().valueOf()
        }
    });
});


app.get('/measure', (req, res) => {
    res.sendFile(__dirname + '/src/measure.html');
});


app.listen(port, (error) => {
	if(!error)
		console.log(`Express app running on port ${port}!`);
	else
		console.log(`Error occurred, can't start app!\n${error}`);
	}
);
