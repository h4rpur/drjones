/*  Dr Jones Controller Copyright Mark Harpur 2014  */

var map;
google.maps.visualRefresh = true;

var TOOLS = {
  FLY : 0
}

var tabUIColor;

var zoomfactor = 0.2; 

function initialize() {
	tabUIColor = document.getElementById('tool_start').style.backgroundColor;
	
	var mapOptions = {
		center: new google.maps.LatLng(33.629231, -112.367998),  
		zoom: 14,
		panControl: false,
    zoomControl: false,
    scaleControl: true,
		streetViewControl: false,
		mapTypeControl: true,
		overviewMapControl: false,
		draggableCursor: "crosshair"
	};

	map = new google.maps.Map(document.getElementById("mapcanvas"),
			mapOptions);

	map.setOptions({styles:styles});

	google.maps.event.addListener(map, 'click', function(location){
		//console.log(location.latLng.nb,location.latLng.ob);
	
	});	
}

function selectTool(toolid){
	
}

function makeStartCircle(location){
	var circOpt = {
		strokeColor: '#FF0000',
		strokeOpacity: 1,
		strokeWeight: 200 * zoomfactor,
		fillColor: '#FF0000',
		fillOpacity: 0.7,
		map: map,
		center: location.latLng,
		radius: 3000 * zoomfactor
	};
	// Add the circle for this city to the map.
	startCircle = new google.maps.Circle(circOpt);
	google.maps.event.trigger(map, 'resize');
}

var styles = [{"stylers": [{ "hue": "#ffa200" },{ "gamma": 1.27 },{ "saturation": 50 },{ "lightness": -9 }]},{"featureType": "water","stylers": [{ "hue": "#00e5ff" },{ "saturation": -76 },{ "lightness": -40 }]},{"featureType": "administrative.country","stylers": [{ "visibility": "on" },{ "weight": 2.5 },{ "saturation": 14 },{ "lightness": 2 }]},{"elementType": "labels.text.stroke","stylers": [{ "visibility": "off" }]},{"featureType": "administrative.province","stylers": [{ "weight": 0.1 },{ "saturation": -48 },{ "visibility": "on" },{ "lightness": -14 }]},{"featureType": "administrative.locality","stylers": [{ "invert_lightness": true },{ "weight": 0.1 },{ "visibility": "on" },{ "lightness": -62 }]},{"featureType": "poi","stylers": [{ "visibility": "off" }]},{"featureType": "poi.park","stylers": [{ "visibility": "off" }]},{"featureType": "road","stylers": [{ "visibility": "on" },{ "saturation": -71 },{ "lightness": 34 }]}];

google.maps.event.addDomListener(window, 'load', initialize);