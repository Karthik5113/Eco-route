// Data structure for disease information
const diseaseInfo = {
    "Maize ear rot": {
        precautions: [
            "Avoid planting maize in fields previously infected.",
            "Ensure proper spacing between plants to improve air circulation.",
            "Remove and dispose of infected ears promptly."
        ],
        solution: "Apply a fungicide with active ingredients like Chlorothalonil or Mancozeb.",
        pesticideType: "Fungicide",
        brand: "Agri-Fos"
    },
    "Blight": {
        precautions: [
            "Use resistant crop varieties if available.",
            "Rotate crops and avoid planting in the same field annually.",
            "Water plants early in the day to allow foliage to dry before evening."
        ],
        solution: "Apply a copper-based fungicide or a systemic fungicide like Propiconazole.",
        pesticideType: "Fungicide",
        brand: "Copper Fungicide"
    },
    "Leaf Spot": {
        precautions: [
            "Ensure good air circulation around plants.",
            "Avoid overhead irrigation to minimize leaf wetness.",
            "Remove and destroy infected plant debris."
        ],
        solution: "Use a fungicide containing Azoxystrobin or Pyraclostrobin.",
        pesticideType: "Fungicide",
        brand: "Strobe Pro"
    },
    "Rust": {
        precautions: [
            "Use rust-resistant plant varieties.",
            "Avoid planting in fields with high humidity and poor air circulation.",
            "Regularly monitor plants for early signs of rust."
        ],
        solution: "Apply a systemic fungicide like Triazole or Chlorothalonil.",
        pesticideType: "Fungicide",
        brand: "Rust-Off"
    }
};

document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('cropImage');
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select an image.");
        return;
    }
    
    // Mock disease prediction (replace with real AI model integration)
    const diseases = Object.keys(diseaseInfo);
    const prediction = diseases[Math.floor(Math.random() * diseases.length)];
    
    // Display prediction result and detailed information
    const info = diseaseInfo[prediction];
    document.getElementById('predictionText').innerHTML = `
        <h2>Predicted disease: ${prediction}</h2>
        <h3>Precautions:</h3>
        <ul>
            ${info.precautions.map(p => `<li>${p}</li>`).join('')}
        </ul>
        <h3>Solution:</h3>
        <p>${info.solution}</p>
        <h3>Type of Pesticide:</h3>
        <p>${info.pesticideType}</p>
        <h3>Brand Name:</h3>
        <p>${info.brand}</p>
    `;
});
