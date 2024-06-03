// Initialize map once HTML data is loaded and parsed

let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'

let myMap = L.map('map', {
    center: [39.8, -98.6],
    zoom: 4
});

// Add tile layer to map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

d3.json(url).then(function(data) {
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getDepth(feature.geometry.coordinates[2]), 
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }
    // Assign color range for depth value

    function getDepth(depth) {
        switch (true) {
            case depth > 90:
                return '#FF0000';
            case depth > 70:
                return '#FF4500';
            case depth > 50:
                return '#FFA500';
            case depth > 30:
                return '#FFFF00';
            case depth > 10:
                return '#9ACD32';
            default:
                return '#00FF00';
        }
    }
    // Assign magnitude values to radii
    function getRadius(mag) {
        if (mag === 0) {
            return 1;
        }
        return mag * 4;
    }
    // Convert time value to readable datetime
    function time(timeInMillis) {
        var date = new Date(timeInMillis);
        return date.toUTCString();
    }
    // Apply GeoJSON data to map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup('Magnitude: ' + feature.properties.mag + '<br>Location: ' + feature.properties.place + '<br>Depth: ' + feature.geometry.coordinates[2]);
        }
    }).addTo(myMap);
});

// Create Legend for Map

var legend = L.control({position: 'bottomright'});
legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'Map Legend'),
    depth = [-10, 10, 30, 50, 70, 90];

    for (let i = 0; i < depth.length; i++) {
        div.innerHTML +=
        '<i style="background:' + getDepth(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap);