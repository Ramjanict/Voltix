const UploadImage = async (image: File | Blob) => {
  const cloudName =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "ku04x3pn";
  const uploadPreset =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "mern_product";

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", uploadPreset);

  const dataResponse = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const responseJson = await dataResponse.json();

  if (!dataResponse.ok || responseJson?.error) {
    const errorMsg =
      responseJson?.error?.message ||
      `Cloudinary upload failed with status ${dataResponse.status}`;
    throw new Error(errorMsg);
  }

  return {
    ...responseJson,
    url: responseJson.secure_url || responseJson.url,
  };
};

export default UploadImage;
