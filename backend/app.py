from flask import Flask, request, jsonify
import torch
import torchvision.transforms as transforms
from PIL import Image
import os
from models.generator import Generator
import torchvision.utils as vutils
from flask_cors import CORS  # Import CORS
import cloudinary
import cloudinary.uploader
import cloudinary.api
import io

app = Flask(__name__)

# Enable CORS for all domains
CORS(app)

# Cloudinary configuration
cloudinary.config(
    cloud_name="dtqefxx25",  # Replace with your Cloudinary cloud name
    api_key="932591589459463",       # Replace with your Cloudinary API key
    api_secret="NYRrJzCVbKw9XQfsdoDZPQe1h5w", # Replace with your Cloudinary API secret
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
generator = Generator().to(device)

# Load model checkpoint
checkpoint_path = "checkpoints/epoch_549.pth"
checkpoint = torch.load(checkpoint_path, map_location=device)
generator.load_state_dict(checkpoint['generator_state_dict'])
generator.eval()

@app.route('/enhance-image', methods=['POST'])
def enhance_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Process the image
        image = Image.open(file.stream).convert("RGB")
        transform = transforms.Compose([transforms.ToTensor()])
        input_tensor = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            enhanced_tensor = generator(input_tensor)
        
        # Save enhanced image to an in-memory buffer
        buffer = io.BytesIO()
        vutils.save_image(enhanced_tensor, buffer, format='PNG')
        buffer.seek(0)

        # Upload the image to Cloudinary
        upload_response = cloudinary.uploader.upload(buffer, folder="enhanced_images", resource_type="image")
        enhanced_image_url = upload_response['url']

        return jsonify({'enhanced_image_url': enhanced_image_url})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
