var noble = require('noble');
//var socket = require('socket.io-client')('http://localhost/scanner');
//var addressToTrack = '582d3410d61e';
var mqtt = require('mqtt')
var client = mqtt.connect('mqqt://192.168.8.105', {
	username: "****",
	password: "****"
})
/*
socket.on('connect', function(){  
	
});
*/
var adresses = [
	["582d3410d61e"],		// Clear Grass łazienka
	["582d3410d600"],     	// Clear Grass Waleria
	["e72e00a03ce1"]
];


let data_send = 	{ 	'582d3410d61e': { 'temp':0,'hum':0, 'batt':0, 	'name': 'Clear Grass łazienka'	}, 
						'582d3410d600': { 'temp':0,'hum':0, 'batt':0, 	'name': 'Clear Grass Waleria' 	},
						'e72e00a03ce1': { 'temp':0,'hum':0, 'batt':0,	'name': 'Zegarek Kuchnia' 		}
						 }; 
				



let data_send_JSON = JSON.stringify(data_send);

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
	
	
	
	if (peripheral.advertisement.localName === 'LYWSD02') {
    console.log('yes');
    noble.stopScanning();
    peripheral.on('connect', () => console.log('Device connected'));
    peripheral.on('disconnect', () => console.log('Device disconnected'));

    peripheral.connect((error) => {
      if (error) console.log(error);

      peripheral.discoverServices(
        [],
        (error, services) => {
          if (error) console.log(error);
          console.log('services array', services[11]);
        }
      );
    });
  }
	
	
	
	
	if(data_send[macAddress]){	var serviceData = peripheral.advertisement.serviceData;
		
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
        */  // fdcd
        console.log(i);
     
		
        
        if(JSON.stringify(serviceData[i].uuid).includes('fe95') & peripheral['advertisement'].localName != 'ClearGrass Temp & RH'){
	        
	       
	        console.log(serviceData[0].data[11]);
	        
	     //   console.log(peripheral['advertisement']);
	        
        } 
        
        			
        
        
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
        
				if (JSON.stringify(serviceData[i].uuid).includes('fdcd_')) {
					
					
					
					console.log('-------------------------------------------------');
					console.log('emit data recived on [ ' + macAddress + " ] "+peripheral['advertisement'].localName);
					console.log('-------------------------------------------------');
					stringAdvertise = JSON.stringify(serviceData[i].data.toString('hex'))
					
					
					
					
							            
		            		
					temp = parseInt(stringAdvertise.substring(23, 25) + stringAdvertise.substring(21, 23), 16)
		            console.log('Temp: ' + temp/10 + 'ºC')
		            humidity = parseInt(stringAdvertise.substring(27, 29) + stringAdvertise.substring(25, 27), 16)
		            console.log('Humidity: ' + humidity/10 + '%')
		            battery = parseInt(stringAdvertise.substring(33, 35), 16)
		            console.log('Battery: ' + battery + '%')
		            console.log('')

        
        }
		*/	
		
		
			}
		} 
		
	
	

	}
// if exists 
	//console.log(exists(adresses, macAddress));
/*
		
  
  console.log('found device: ', macAdress, ' ', localName, ' ', rss);  

	
*/
/*
  if(peripheral.uuid == addressToTrack){
    socket.emit('deviceData', {mac: peripheral.uuid, rssi:peripheral.rssi});    
  }
*/
});
var n = 10;

function startScanning() {
	noble.startScanning([], true) //allows dubplicates while scanning
}


startScanning();
/*
setTimeout(function() {
	console.log('stoping scanning');
	noble.stopScanning(); // this code will only run when time has ellapsed
}, n * 2000);
*/


/*

setTimeout(function() {
	console.log('enabling BLE Scan ...');
	startScanning(); // this code will only run when time has ellapsed
}, n * 3000);
*/










client.on('connect', function() {
	client.publish('/czujniki/ClearGrass_01/presence', 'true')
	client.subscribe('presence', function(err) {
		if (!err) {}
	})
})






client.on('message', function(topic, message) {
	// message is Buffer
	//console.log(message.toString())
	client.end()
})
