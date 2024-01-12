// Set up the serial connection
const connection = SimpleWebSerial.setupSerialConnection({ requestAccessOnPageLoad: true });


// React to incoming events
connection.on('data', function(data) {
    console.log(data);
    const gpsDataJson = JSON.parse(data);
    console.log(gpsDataJson);
});


document.getElementById("mandar").addEventListener("click",send);

function send(){
    connection.send("browser-event",2);
    console.log("Hola");
}


// Send named events to the Arduino with a number, string, array or json object
//connection.send('event-to-arduino', "Hello there, Arduino");
  