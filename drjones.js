var map;
google.maps.visualRefresh = true;

var TOOLS = {
    FLY : 0,
		BOAT : 1,
		DRIVE : 2,
		WALK : 3,
		CYCLE : 4,
		END : 5
}

var tabUIColor;
var selectedTool;
var drawingLine = false;
var startCircle;
var endPoly;
var drawingLine = false;
var nextClickStart = false;
var nextClickEnd = false;
var lastClickLoc;
var zoomfactor = 0.2; 

function start(){
	drawingLine = true;
	nextClickStart = true;
	nextClickEnd = false;
}

function end(){
	drawingLine = false;
	nextClickStart = false;
	nextClickEnd = true;
}

function initialize() {
	tabUIColor = document.getElementById('tool_start').style.backgroundColor;
	selectTool('tool_start');
	selectTool('tool_fly');
	var mapOptions = {
		center: new google.maps.LatLng(-34.0, 151.644),  
		zoom: 10,
		panControl: false,
    zoomControl: false,
    scaleControl: true,
		streetViewControl: false,
		mapTypeControl: false,
		overviewMapControl: false,
		draggableCursor: "crosshair"
	};

	map = new google.maps.Map(document.getElementById("mapcanvas"),
			mapOptions);

	map.setOptions({styles:styles});

	google.maps.event.addListener(map, 'click', function(location){
		//console.log(location.latLng.nb,location.latLng.ob);

		if(nextClickStart){
			nextClickStart = false;
			lastClickLoc = location;
			makeStartCircle(location);
		}else if(nextClickEnd){
			nextClickStart = false;
			//lastClickLoc = null;
			makeLine(location);
			makeEndX(location);
		}else{
			if(lastClickLoc){
				makeLine(location);
			}
		}
	});
	poly = new google.maps.Polyline({ map: map });
	
}


var lastTool;
function selectTool(id){
	if(lastTool && lastTool.id != 'tool_start') document.getElementById(lastTool).style.background = tabUIColor;
	document.getElementById(id).style.background = '#D90000';
	switch(id){ 
		case 'tool_fly':
			selectedTool = TOOLS.FLY;
			break;
		case 'tool_boat':
			selectedTool = TOOLS.BOAT;
			break;
		case 'tool_drive':
			selectedTool = TOOLS.DRIVE;
			break;
		case 'tool_walk':
			selectedTool = TOOLS.WALK;
			break;
		case 'tool_cycle':		
			selectedTool = TOOLS.CYCLE;
			break;
		case 'tool_start':
			start();
			break;
		case 'tool_end':
			end();
			break;
	}
	lastTool = id;
}

var path = new google.maps.MVCArray(),service = new google.maps.DirectionsService(), poly;
var poly;

function makeLine(location){

	// Define a symbol using SVG path notation, with an opacity of 1.
  var lineSymbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 1,
		strokeColor: '#FF0000',
    scale: 30 * zoomfactor
  };
	
  var flightPlanCoordinates = [
		lastClickLoc.latLng,
    location.latLng 
  ];
	console.log(selectedTool);
	
	if(selectedTool == TOOLS.FLY){
		var flightPath = new google.maps.Polyline({
			path: flightPlanCoordinates,
			geodesic: true,
			strokeColor: '#FF0000',
			strokeOpacity: 1,
			strokeWeight: 40*zoomfactor,			
			map: map
		});
	}else if(selectedTool == TOOLS.BOAT){
		lineSymbol.strokeColor = '#0000FF';
		var flightPath = new google.maps.Polyline({
			path: flightPlanCoordinates,
			strokeOpacity: 0,
			icons: [{
				icon: lineSymbol,
				offset: '0',
				repeat: (zoomfactor*220)+'px'
			}],
			map: map
		});
	}else if(selectedTool == TOOLS.DRIVE){
	
		/*lineSymbol.strokeColor = '#E82F2F';
		var flightPath = new google.maps.Polyline({
			path: flightPlanCoordinates,
			strokeOpacity: 0,
			icons: [
				{
					icon: lineSymbol,
					offset: '0',	
					repeat: (zoomfactor*100)+'px'
				}				
			],
			map: map
		});*/
		
		if (path.getLength() === 0) {      
			path.push(lastClickLoc.latLng);
      poly.setPath(path);
    } else {
      service.route({
        origin: lastClickLoc.latLng,
        destination: location.latLng,
				travelMode: google.maps.DirectionsTravelMode.DRIVING
      }, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          for (var i = 0, len = result.routes[0].overview_path.length;
              i < len; i++) {
            path.push(result.routes[0].overview_path[i]);
          }
        }
      });
    }
		
	}else if(selectedTool == TOOLS.WALK){
		lineSymbol.strokeColor = '#731D00';
		var flightPath = new google.maps.Polyline({
			path: flightPlanCoordinates,
			strokeOpacity: 0,
			icons: [{
				icon: lineSymbol,
				offset: '0',
				repeat: (zoomfactor*70)+'px'
			}],
			map: map
		});
	}else if(selectedTool == TOOLS.CYCLE){
		lineSymbol.strokeColor = '#00D900';
		var flightPath = new google.maps.Polyline({
			path: flightPlanCoordinates,
			strokeOpacity: 0,
			icons: [{
				icon: lineSymbol,
				offset: '0',
				repeat: (zoomfactor*90)+'px'
			}],
			map: map
		});
	}
	
	lastClickLoc = location;
}

function makeEndX(location){
	var zf = zoomfactor*0.15;
	
	var xSymbol = {
    path: 'M -1,0 A 1,1 0 0 0 -3,0 1,1 0 0 0 -1,0M 1,0 A 1,1 0 0 0 3,0 1,1 0 0 0 1,0M -3,3 Q 0,5 3,3',
    strokeColor: '#f00',
    rotation: 45
  };
	
	var polyOptions = {
    strokeColor: '#000000',
    strokeOpacity: 0.0,
    strokeWeight: 3,
		fillColor: '#FF0000',
		fillOpacity: 0.7,
		map: map,
		center: location.latLng,
		paths: [
		
			new google.maps.LatLng((location.latLng.nb-zf), (location.latLng.ob-zf)),
			new google.maps.LatLng((location.latLng.nb-zf), (location.latLng.ob+zf)),
			new google.maps.LatLng((location.latLng.nb+zf), (location.latLng.ob-zf)),
			new google.maps.LatLng((location.latLng.nb+zf), (location.latLng.ob+zf)),
		]		
  };
  endPoly = new google.maps.Polygon(polyOptions);
	endPoly.setMap(map);
	console.log(endPoly);
	google.maps.event.trigger(map, 'resize');
	nextClickEnd = false;
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