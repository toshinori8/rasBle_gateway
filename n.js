var noble = require('noble');
//var socket = require('socket.io-client')('http://localhost/scanner');
var mqtt = require('mqtt')
var client = mqtt.connect('mqqt://192.168.8.105', {
	username: "****",
	password: "****"
})
/*.  // For websocket future discovery of ble devices
 socket.on('connect', function(){  
	
});
*/
client.on('connect', function() {})
// Devices Array - future : update by web / after merging with webserver
let data_send = {
	'582d3410d61e': {
		'powerOn': 0,
		'temp': 0,
		'hum': 0,
		'batt': 0,
		'name': 'Clear Grass łazienka',
		'id': 'clear01'
	},
	'582d3410d600': {
		'powerOn': 0,
		'temp': 2,
		'hum': 0,
		'batt': 0,
		'name': 'Clear Grass Waleria',
		'id': 'clear02'
	},
	'e72e00a03ce1': {
		'powerOn': 0,
		'temp': 0,
		'hum': 0,
		'batt': 0,
		'name': 'Zegarek Kuchnia',
		'id': 'watch01'
	}
};
// ACCESING DATABASE  console.log(data_send['e72e00a03ce1']['temp']);
/*
function exists(arr, search) {
	return arr.some(row => row.includes(search));
}
*/
noble.on('discover', function(peripheral) {
	var macAddress = peripheral.uuid;
	var rss = peripheral.rssi;
	var localName = peripheral.advertisement.serviceData;
	//console.log(peripheral)
	//if (exists(adresses, macAddress)) {
	if (data_send[macAddress]) {
		var serviceData = peripheral.advertisement.serviceData;
		if (serviceData && serviceData.length) {
			//console.log(peripheral.advertisement)
			for (var i in serviceData) {
/* All the information is in this Property called "FDCD" on the advertising data.
           The HEX string is as follows:
           "0807453810342d580104f500da02020145" (quotes included)
           To which:
           0807 or 0801: Ignore, but useful to identify relevant data
           453810342d58: MAC address, INVERTED (58:2d:34:10:38:45)
           0104f500da02: Data for Temperature and Humidity, broken as follows
             - 01: Indicates the Temperature and Humidity events
             - 04: Event data length (4, 2 bytes for Temperature, 2 bytes for Humidity)
             - f500: Temperature data inverted (00f5), which translates to 245, equivalent to 24.5C
             - da02: Humitity data inverted (02da), which translates to 730, equivalent to 73.0%
           020145: Data for Battery, bronek as follows
             - 02: Indicates the Battery events
             - 01: Event data length (1 byte)
             - 45: Battery data, which translates to 69, equivalent to 69%
        */
				// fdcd
				if (JSON.stringify(serviceData[i].uuid).includes('fdcd')) {
					//console.log('');
					//console.log('-------------------------------------------------');
					//console.log('emit data recived on [ ' + macAddress + " ] "+peripheral['advertisement'].localName);
					//console.log('-------------------------------------------------');
					stringAdvertise = JSON.stringify(serviceData[i].data.toString('hex'))
					data_send[macAddress].powerOn = true
					temp = parseInt(stringAdvertise.substring(23, 25) + stringAdvertise.substring(21, 23), 16)
					//console.log('Temp: ' + temp/10 + 'ºC')
					humidity = parseInt(stringAdvertise.substring(27, 29) + stringAdvertise.substring(25, 27), 16)
					//console.log('Humidity: ' + humidity/10 + '%')
					battery = parseInt(stringAdvertise.substring(33, 35), 16)
					//console.log('Battery: ' + battery + '%')
					//console.log('')
					data_send[macAddress].temp = temp / 10;
					data_send[macAddress].hum = humidity / 10;
					data_send[macAddress].batt = battery;
					data_send[macAddress].powerOn = 1;
				}
/*
        
        if(JSON.stringify(serviceData[i].uuid).includes('fe95') & peripheral['advertisement'].localName != 'ClearGrass Temp & RH'){
	        
	       
	        console.log(serviceData[0].data[11]);
	        
	     //   console.log(peripheral['advertisement']);
	        
        } 
*/
/*
        
         if (JSON.stringify(serviceData[i].uuid).includes('fe95') & peripheral['advertisement'].localName =='LYWSD02'){
	        
	        
	        		console.log('-------------------------------------------------');
					console.log('emit data recived on [ ' + macAddress + " ] "+peripheral['advertisement'].localName);
					console.log('-------------------------------------------------');
					stringAdvertise = JSON.stringify(serviceData[i].data.toString('hex'))

					console.log(serviceData[i].data);
					  		
					tempa = parseInt(stringAdvertise.substring(9, 10)+stringAdvertise.substring(8, 9), 16)
		            humiditya = parseInt(stringAdvertise.substring(27, 29) + stringAdvertise.substring(25, 27), 16)
		            batterya = parseInt(stringAdvertise.substring(33, 35), 16)
		            
		            temp = (tempa /100) - 2.45;
		            humidity = (humiditya /10) ;
		            battery = batterya
		            
		            console.log(tempa);
		            
		          //  console.log('Temp: ' + temp.toFixed(1) + 'ºC')
					console.log('Humidity: ' + humidity/10 + '%')
		            console.log('Battery: ' + battery + '%')
		            console.log('')

						
					
	        
        }
*/
			}
		}
	}
});

function sendData() {
	//console.log('::: mqqt SEND :::');	
	let devices_ = Object.keys(data_send).length;
	Object.keys(data_send).forEach(function(mac) {
		if (data_send[mac].powerOn == 1) {
			str_send = "/czujniki/" + data_send[mac].id + "/temp";
			client.publish(str_send, data_send[mac].temp.toString(), function(err) {});
			str_send = "/czujniki/" + data_send[mac].id + "/hum";
			client.publish(str_send, data_send[mac].hum.toString(), function(err) {});
			str_send = "/czujniki/" + data_send[mac].id + "/name";
			client.publish(str_send, data_send[mac].name.toString(), function(err) {});
			str_send = "/czujniki/" + data_send[mac].id + "/batt";
			client.publish(str_send, data_send[mac].batt.toString(), function(err) {});
			str_send = "/czujniki/" + data_send[mac].id + "/powerOn";
			client.publish(str_send, data_send[mac].powerOn.toString(), function(err) {});
			str_send = "/czujniki/" + data_send[mac].id + "/mac";
			client.publish(str_send, mac.toString(), function(err) {});
			// ALL DEVICES ATTRIBUTES JSON DATA
			let str_json = JSON.stringify(data_send);
			client.publish("/czujniki/JSON", str_json, function(err) {});

		}
	});

	}
state = 0;

function startScanning() {
	state = 1;
	//console.log('::: BLE SCAN ...');
	noble.startScanning([], true) //allows dubplicates while scanning
	setTimeout(function() {
		//console.log('::: BLE STOP :::');
		noble.stopScanning();
		sendData();
		state = 0;
	}, 25000);
}
setInterval(function() {
	//console.log(state)
	//process.stdout.write(".");
	if (state === 0) {
		startScanning();
		state++;
	}
}, 1000)
/*

client.on('message', function(topic, message) {
	// message is Buffer
	//console.log(message.toString())
	client.end()
})
*/
