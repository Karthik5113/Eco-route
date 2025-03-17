// OSRM API URL
const osrmUrl = "https://router.project-osrm.org/route/v1";

// Emission factors (grams per km)
const emissionFactors = {
  car: 120,      // Car: 120 grams per kilometer
  bus: 50,       // Bus: 50 grams per kilometer
  ev: 0,         // EV: 0 grams per kilometer (no emissions)
  cycle: 0       // Cycle: 0 grams per kilometer (no emissions)
};

// Reward points (based on the vehicle mode)
const rewardPoints = {
  car: 5,        // Car: 5 points
  bus: 10,       // Bus: 10 points
  ev: 20,        // EV: 20 points
  cycle: 50      // Cycle: 50 points
};

// Initialize Leaflet Map
const map = L.map('map').setView([12.9716, 77.5946], 13);  // Default: Bengaluru
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to calculate carbon emissions based on the selected vehicle and distance
function calculateCarbonEmissions(distance, vehicle) {
  // Convert distance from meters to kilometers
  const distanceInKm = distance / 1000; // Convert from meters to kilometers
  
  let carbonEmissions = 0; // Default to 0 for EV and Cycle
  
  // Set carbon emissions to 0 for EV and Cycle
  if (vehicle === 'ev' || vehicle === 'cycle') {
    carbonEmissions = 0;
  } else {
    // Get emission factor for the selected vehicle type (in grams per kilometer)
    const emissionFactor = emissionFactors[vehicle];

    // Calculate the carbon emissions (grams)
    carbonEmissions = distanceInKm * emissionFactor;
  }

  console.log(`Carbon Emissions for ${vehicle}: ${carbonEmissions.toFixed(2)} grams`);

  // Save the carbon emission value in localStorage
  localStorage.setItem('carbonEmissions', carbonEmissions.toFixed(2));

  // Update the UI with the carbon emissions
  document.getElementById('carbonEmissions').innerText = `Carbon Emissions for ${vehicle}: ${carbonEmissions.toFixed(2)} grams`;

  return carbonEmissions.toFixed(2);
}

// Function to calculate reward points based on the selected vehicle
function calculateRewardPoints(vehicle) {
  const points = rewardPoints[vehicle];
  document.getElementById('rewardPoints').innerText = `Reward Points: ${points} points`;
  return points;
}

// Function to fetch route from OSRM and calculate distance, carbon emissions, and reward points
function fetchRouteFromOSRM(originLatLng, destinationLatLng, vehicle) {
  const routeUrl = `${osrmUrl}/${vehicle}/${originLatLng[1]},${originLatLng[0]};${destinationLatLng[1]},${destinationLatLng[0]}?alternatives=false&geometries=geojson&steps=true`;

  fetch(routeUrl)
    .then(response => response.json())
    .then(data => {
      console.log('OSRM Response:', data);

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distance = route.distance;  // Distance in meters
        const duration = route.duration;  // Duration in seconds
        const routeCoordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

        // Update route details on the map
        updateMap(routeCoordinates);

        // Update the UI with distance
        updateRouteDetails(distance, vehicle);

        // Calculate and display carbon emissions and reward points
        calculateCarbonEmissions(distance, vehicle);
        calculateRewardPoints(vehicle);
      } else {
        console.error('No route found.');
      }
    })
    .catch(error => {
      console.error('Error fetching route from OSRM:', error);
    });
}

// Function to update the map with the route
function updateMap(routeCoordinates) {
  // Clear previous route
  map.eachLayer(function (layer) {
    if (layer instanceof L.Polyline) {
      map.removeLayer(layer);
    }
  });

  // Add the new route to the map
  const routePolyline = L.polyline(routeCoordinates, { color: 'blue' }).addTo(map);
  map.fitBounds(routePolyline.getBounds()); // Adjust the map view to fit the route
}

// Function to update the UI with route details
function updateRouteDetails(distance, vehicle) {
  // Convert the distance from meters to kilometers
  const distanceInKm = (distance / 1000).toFixed(2);  // Convert from meters to kilometers
  
  // Update the distance in the UI
  document.getElementById('routeDistance').innerText = `Distance for ${vehicle}: ${distanceInKm} km`;
}

// Function to fetch coordinates from address using Nominatim API
function getCoordinates(address) {
  const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  return fetch(geocodeUrl)
    .then(response => response.json())
    .then(data => {
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        return [lat, lon];  // Return coordinates [latitude, longitude]
      } else {
        alert('Address not found');
        return null;
      }
    })
    .catch(error => {
      console.error('Error fetching geocode:', error);
    });
}

// Event listener for the Calculate Route button
document.getElementById('calculateRoute').addEventListener('click', function() {
  const startAddress = document.getElementById('startAddress').value;
  const endAddress = document.getElementById('endAddress').value;
  const selectedVehicle = document.getElementById('vehicleSelect').value;

  if (!startAddress || !endAddress) {
    alert('Please enter both starting and destination addresses');
    return;
  }

  // Get coordinates for starting and destination addresses
  Promise.all([getCoordinates(startAddress), getCoordinates(endAddress)])
    .then(([startCoordinates, endCoordinates]) => {
      if (startCoordinates && endCoordinates) {
        // Fetch the route from OSRM
        fetchRouteFromOSRM(startCoordinates, endCoordinates, selectedVehicle);
      }
    })
    .catch(error => {
      console.error('Error getting coordinates:', error);
    });
});
