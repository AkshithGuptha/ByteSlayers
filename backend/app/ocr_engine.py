import pytesseract
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

# Configure Tesseract path - update this to match your installation
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Tesseract configuration for better invoice OCR
TESSERACT_CONFIG = r'--oem 3 --psm 6 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:/-@%&() '


def extract_text(image_path: str) -> str:
    """Extract text from an image using Tesseract OCR with enhanced preprocessing."""
    # Open image using PIL
    image = Image.open(image_path)
    
    # Convert to RGB if necessary (handles PNG with transparency)
    if image.mode in ('RGBA', 'P'):
        image = image.convert('RGB')
    
    # Convert to grayscale
    image = image.convert('L')
    
    # Auto-rotate if needed
    image = ImageOps.exif_transpose(image)
    
    # Resize image to improve OCR (scale up small images)
    width, height = image.size
    if width < 1000 or height < 1000:
        scale = max(2, 2000 // min(width, height))
        image = image.resize((width * scale, height * scale), Image.Resampling.LANCZOS)
    
    # Enhance contrast more aggressively
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(2.5)
    
    # Enhance sharpness
    sharpener = ImageEnhance.Sharpness(image)
    image = sharpener.enhance(2.0)
    
    # Apply sharpening filter
    image = image.filter(ImageFilter.SHARPEN)
    
    # Denoise
    image = image.filter(ImageFilter.MedianFilter(size=3))
    
    # Binarization (convert to pure black and white)
    threshold = 128
    image = image.point(lambda x: 0 if x < threshold else 255, '1')
    image = image.convert('L')
    
    # Extract text using Tesseract with custom config
    text = pytesseract.image_to_string(
        image, 
        lang='eng',
        config=TESSERACT_CONFIG
    )
    
    return text.strip()
