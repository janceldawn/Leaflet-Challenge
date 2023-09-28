// Define the URL of the earthquake data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Create the map
let map = L.map("map", {
    center: [30.5994, 90.6731],
    zoom: 2,
});

// Define base layers
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create layer groups for magnitude and depth markers
let magnitudeMarkers = L.layerGroup();
let depthMarkers = L.layerGroup();

// Function to calculate circle size based on magnitude
function getMarkerSize(magnitude) {
    return Math.sqrt(magnitude) * 200000;
}

// Function to get circle color based on depth
function getMarkerColor(depth) {
    if (depth < 10) return "yellow";
    if (depth < 30) return "orange";
    if (depth < 50) return "green";
    if (depth < 70) return "red";
    if (depth < 90) return "purple";
    return "darkred";
}

// Function to create a circle marker with popup for each earthquake
function createMarker(feature, latlng) {
    let magnitude = feature.properties.mag;
    let depth = feature.geometry.coordinates[2];
    
    let circle = L.circle(latlng, {
        fillOpacity: 0.75,
        color: "black",
        fillColor: getMarkerColor(depth),
        radius: getMarkerSize(magnitude)
    }).bindPopup(
        `<h3>${feature.properties.place}</h3>
        <p>Magnitude: ${magnitude}</p>
        <p>Depth: ${depth} km</p>`
    );

    return circle;
}

// Function to add legend to the map
function addLegend() {
    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function (map) {
        let div = L.DomUtil.create("div", "info legend");
        let depths = [0, 10, 30, 50, 70, 90];
        let labels = [];
        let colors = [];

        for (let i = 0; i < depths.length; i++) {
            let from = depths[i];
            let to = depths[i + 1];
            let color = getMarkerColor(from + 1);

            labels.push(
                `<i style="background: ${color}"></i> ${from}${to ? "&ndash;" + to : "+"}`
            );

            // Store colours in an array
            colors.push(color);
        }

        // Create a gradient color scale
        div.style.background = `linear-gradient(to right, ${colors.join(", ")})`; 

         // Add labels to the legend
        div.innerHTML = labels.join(""); 
        return div;
    };

    legend.addTo(map);
}

// Function to create the map
function createMap() {
    // Add base layers to the map
    street.addTo(map);

    // Load earthquake data and add markers
    d3.json(url).then(function (data) {
        console.log(data)
        L.geoJSON(data.features, {
            pointToLayer: createMarker
        }).addTo(magnitudeMarkers);

        // Add magnitude markers to the map
        magnitudeMarkers.addTo(map);

        // Add depth markers to the map
        depthMarkers.addTo(map);

        // Add legend to the map
        addLegend();

        // Create layer control for toggling markers
        let overlayMaps = {
            "Magnitude Markers": magnitudeMarkers,
            "Depth Markers": depthMarkers,
        };
        
        L.control.layers(null, overlayMaps).addTo(map);
    });
}

// Call the function to create the map
createMap();



