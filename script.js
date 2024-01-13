import { setupSerialConnection } from 'simple-web-serial';
import { ColorMarkers } from './ColorMarkers.js'; 


var map;
/*var myIcon = L.icon({
    iconUrl: 'my-icon.png',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowUrl: 'my-icon-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});*/
const colorMarkers = new ColorMarkers();
  

/*VARIABLE PARA GUARDAR TODOS MENSAJES CON INFORMACIÓN DE SU LOCALIZACIÓN DE LOS ARDUINOS
*
*   
*/
var usersLogsGPS = new Map();
var markers = new Map();
var polylines = [];
let connection = setupSerialConnection();

/*let infoExample = {
    "user": 196,
    "latitude": 28.078610,
    "longitude": -15.449363,
    "altitude": 336.8999939,
    "timestamp": 0
};*/

document.getElementById("deleteLogsButton").addEventListener("click",function(){
    usersLogsGPS.clear();
    markers.forEach(function(value, key) {
        value.forEach(function(marker){
            map.removeLayer(marker);
        })
    });
    for(var i=0; i<polylines.length; i++){
        map.removeLayer(polylines[i]);
    }
    polylines = [];
    colorMarkers.removeLegends();
    document.getElementById("bodyTable").innerHTML = '';
    markers.clear();
})

let startRegisterButton = document.getElementById("startRegisterButton");
startRegisterButton.addEventListener("click",function(){
    connection.on('data', function(data) {
        const gpsDataJson = JSON.parse(data);
        var logs = usersLogsGPS.get(gpsDataJson.user);
        if(logs==undefined) {
            usersLogsGPS.set(gpsDataJson.user,[gpsDataJson]);
            colorMarkers.addUser(gpsDataJson.user);
        }else{
            logs.push(gpsDataJson);
            usersLogsGPS.set(gpsDataJson.user,logs);
        }
        addRowLog(gpsDataJson);
        addMarker(gpsDataJson);
    });
    startRegisterButton.disabled = true;
    endRegisterButton.disabled = false;
});

let endRegisterButton = document.getElementById("endRegisterButton");
endRegisterButton.addEventListener("click",function(){
    connection.removeListeners("data");
    startRegisterButton.disabled = false;
    endRegisterButton.disabled = true;
})

let connectButton = document.getElementById("connectButton");
connectButton.addEventListener("click",function(){
    connection.startConnection();
    startRegisterButton.disabled = false;
    endRegisterButton.disabled = true;
});

document.getElementById("createPolylineButton").addEventListener("click",function(){

    markers.entries
    for(var [key, value] of markers){
        let latLngs = [];
        console.log(key,"j");
        value.forEach(circleMarker => {
            latLngs.push(circleMarker._latlng);
        })
        var polyline = L.polyline(latLngs, {color: colorMarkers.getUserColor(key)}).addTo(map);
        polylines.push(polyline);
    }
});



function addMarker(gpsDataJson){
    var circleMarker = L.circleMarker(
        [gpsDataJson.latitude, gpsDataJson.longitude],
        {radius:1,color:colorMarkers.getUserColor(gpsDataJson.user)}
        ).addTo(map);

    var time = formatDate(gpsDataJson.timestamp)
    

    circleMarker.bindTooltip(
        `User: ${gpsDataJson.user}<br>
         Date: ${time[0]}<br>
         Time: ${time[1]}<br>
         Location: ${gpsDataJson.latitude} ${gpsDataJson.longitude}<br>
         Altitude: ${gpsDataJson.altitude}
        `
    );
    
    var markersUser = markers.get(gpsDataJson.user);
    if(markersUser==undefined){
        markers.set(gpsDataJson.user,[circleMarker])
    }else{
        markersUser.push(circleMarker);
        markers.set(gpsDataJson.user,markersUser);
    }
}

function formatDate(timestampInSeconds){
    //Formatear el date
    const date = new Date(timestampInSeconds*1000);
    const formattedDate = date.toDateString();
    const formattedTime = date.toLocaleTimeString();
    return [formattedDate,formattedTime];
}

function addRowLog(gpsDataJson){
    const row = document.createElement("tr");
    for(var key in gpsDataJson){
        const cell = document.createElement("td");
        var cellText;
        if(key=="timestamp"){
            var time = formatDate(gpsDataJson[key]);
            cellText = document.createTextNode(time[0]+" "+time[1]);
        }else{
            cellText = document.createTextNode(gpsDataJson[key]);
        }
        
        cell.appendChild(cellText);
        row.appendChild(cell);
    }
    document.getElementById("bodyTable").prepend(row);
}

navigator.geolocation.getCurrentPosition(position => {
    initMap(position.coords.latitude, position.coords.longitude);
}, e => {
    console.log(e);
});



function initMap(latitude,longitude){

    document.getElementById("map").style.height = window.innerHeight-200 + "px";

    map = L.map('map',).setView([latitude, longitude], 14);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    
    }).addTo(map);

    var marker = L.marker([latitude, longitude]).addTo(map);
    

    //map.removeLayer(marker);
}

// React to incoming events
/*connection.on('data', function(data) {
    console.log(data);
    const gpsDataJson = JSON.parse(data);
    console.log(gpsDataJson);
});


document.getElementById("mandar").addEventListener("click",send);

function send(){
    connection.send("browser-event",2);
    console.log("Hola");
}*/


// Send named events to the Arduino with a number, string, array or json object
//connection.send('event-to-arduino', "Hello there, Arduino");
  