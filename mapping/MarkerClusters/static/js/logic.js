// Creating map object
var myMap = L.map("map", {
  center: [36.058,12.02, -121.5748333],
  zoom: 2
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// Store API query variables
var earthquakeurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grab the data with d3
d3.json(earthquakeurl, function(response) {
  
  // Create a new marker cluster group
  var markers = L.markerClusterGroup();
  var features = response["features"];

  // Loop through data
  for (var i = 0; i < features.length; i++) {
    console.log(features[i]);
    // Set the data location property to a variable
    var location = features[i].geometry;
    var property = features[i].properties;

    // Check for location property
    if (location) {

      // Add a new marker to the cluster group and bind a pop-up
      markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
        .bindPopup(property.place));
    }

  }

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

});


var link = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data).addTo(myMap); //geoJson standard file was provided. Can use geoJson method. 
});
