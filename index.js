var mqtt = require('mqtt')
var express = require('express')
var app = express()
var cron = require('node-cron');
var client = mqtt.connect('mqtt://10.10.10.1')


app.get('/', function(req, res) {

    var options = {
        root: __dirname + '/public/',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    var main = req.query.main == "1";
    var msg = req.query.message;
    //console.log('msg', msg);
    if (msg && msg.length) {
	console.log('Displaying:',msg);
        client.publish(main ? "/smarthome/mirrormain" : "/smarthome/mirror", msg);
        res.sendFile('thankyou.html',options,function(err) {});
    }
    else {
        res.sendFile('index.html', options, function(err) {
            console.log(err);
        });
    }
})
/*
cron.schedule('* * 6 * *', function() {
	console.log('morgon');
    client.publish("/smarthome/mirrormain", "God morgon!");
    if (Math.random() > 0.5)
        client.publish("/smarthome/mirror", "Idag blir det en bra dag");
    else
        client.publish("/smarthome/mirror", "Looking sharp today!");
});

cron.schedule('* * 15 * *', function() {
	console.log('eftermiddag');

    client.publish("/smarthome/mirrormain", "Välkommen hem!");
});

cron.schedule('* * 20 * *', function() {
	console.log('kväll');

    client.publish("/smarthome/mirrormain", "God kväll!");
});

cron.schedule('* * 22 * *', function() {
	console.log('natt');

    client.publish("/smarthome/mirrormain", "Godnatt!");
});
*/
app.use(express.static('public'))

client.on('connect', function() {
    client.subscribe('presence')
    client.subscribe('/smarthome/*')
        //client.publish('presence', 'Hello mqtt')
})


app.listen(80, function() {
    console.log('Example app listening on port 80!')
})
