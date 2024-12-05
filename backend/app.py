from flask import Flask, request, jsonify, send_from_directory
import torch
import torchvision.transforms as transforms
from PIL import Image
import os
from models.generator import Generator
import torchvision.utils as vutils
from flask_cors import CORS  # Import CORS

app = Flask(__name__)

# Enable CORS for all domains (this allows all domains to access your backend)
CORS(app)

UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
generator = Generator().to(device)

# Load model checkpoint
checkpoint_path = "checkpoints/epoch_549.pth"
checkpoint = torch.load(checkpoint_path, map_location=device, weights_only=True)
generator.load_state_dict(checkpoint['generator_state_dict'])
generator.eval()

@app.route('/enhance-image', methods=['POST'])
def enhance_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    input_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(input_path)

    try:
        # Process the image
        image = Image.open(input_path).convert("RGB")
        transform = transforms.Compose([transforms.ToTensor()])
        input_tensor = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            enhanced_tensor = generator(input_tensor)
        
        # Save enhanced image
        output_filename = f"enhanced_{file.filename}"
        output_path = os.path.join(OUTPUT_FOLDER, output_filename)
        vutils.save_image(enhanced_tensor, output_path)

        return send_from_directory(OUTPUT_FOLDER, output_filename, as_attachment=False)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
