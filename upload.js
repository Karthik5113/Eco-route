document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('cropImage');
    const file = fileInput.files[0];
    if (!file) {
      alert("Please select an image.");
      return;
    }
    // Mock disease prediction (replace with real AI model integration)
    const diseases = ["Maize ear rot", "Blight", "Leaf Spot", "Rust"];
    const prediction = diseases[Math.floor(Math.random() * diseases.length)];
    // Display prediction result
    document.getElementById('predictionText').textContent = `Predicted disease: ${prediction}`;
  });
  
  