import os
from PIL import Image
from pillow_heif import register_heif_opener

def convert_heif_to_jpg(folder_path):
    # Register HEIF opener with Pillow to allow it to read .heif/.heic files
    register_heif_opener()
    
    if not os.path.exists(folder_path):
        print(f"Error: The folder '{folder_path}' does not exist. Please check the path.")
        return

    # Target both .heif and .heic extensions
    target_extensions = ('.heif', '.heic')
    success_count = 0

    print(f"Starting conversion in: {folder_path}\n" + "-"*40)
    
    for filename in os.listdir(folder_path):
        if filename.lower().endswith(target_extensions):
            heif_path = os.path.join(folder_path, filename)
            
            # Change the extension to .jpg
            base_name = os.path.splitext(filename)[0]
            jpg_filename = f"{base_name}.jpg"
            jpg_path = os.path.join(folder_path, jpg_filename)
            
            try:
                with Image.open(heif_path) as img:
                    # Convert to RGB mode (necessary for JPEG format)
                    rgb_img = img.convert('RGB')
                    # Save with high quality (95/100)
                    rgb_img.save(jpg_path, 'JPEG', quality=95)
                
                print(f"Successfully converted: {filename} -> {jpg_filename}")
                success_count += 1
                
                # OPTIONAL: If you want to automatically delete the original HEIF files 
                # after a successful conversion, delete the '#' from the line below:
                # os.remove(heif_path)
                
            except Exception as e:
                print(f"Failed to convert {filename}. Error: {e}")

    print("-"*40 + f"\nDone! Successfully converted {success_count} files to JPG.")

if __name__ == "__main__":
    # Your exact Windows folder path
    target_folder = r"C:\Users\EMMEX\Pictures\floreb"
    
    convert_heif_to_jpg(target_folder)