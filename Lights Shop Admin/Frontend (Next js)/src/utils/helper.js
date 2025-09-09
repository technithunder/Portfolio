export const getBase64Size = (base64String) => {
    const base64Content = base64String.split(",")[1] || base64String;
    const length = base64Content.length;
    const padding = (base64Content.match(/=+$/) || [""])[0].length;
    return length * (3 / 4) - padding;
  };
  
  export const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  export const getPreviewUrl = (img) => {
    if (img instanceof File) {
      return URL.createObjectURL(img);
    } else if (typeof img === "string") {
      return img;
    } else if (img?.s3FileUrl) {
      return img.s3FileUrl;
    }
    return null;
  };
  
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};