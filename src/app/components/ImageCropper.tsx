"use client";
import React, { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";

interface Props {
  imageSrc: string;
  onCropComplete: (blob: Blob) => void;
  onClose: () => void;
}

// Utility to create <img> from a data URL
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
  });

// Utility to crop image and return blob
const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx!.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas blob generation failed"));
    }, "image/jpeg");
  });
};

const ImageCropper = ({ imageSrc, onCropComplete, onClose }: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    setLoading(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(blob); // parent controls hiding after success
    } catch {
      alert("Cropping failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex flex-col items-center justify-center px-4">
      <div className="relative w-full max-w-md aspect-square bg-white rounded-xl overflow-hidden">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          showGrid={true}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
      </div>

      {/* Zoom Slider */}
      <input
        type="range"
        min={1}
        max={3}
        step={0.1}
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        className="thumb-blue w-full max-w-md mt-4 appearance-none bg-gray-300 h-2 rounded-lg cursor-pointer"
      />

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleDone}
          className="bg-[#23BAD8] hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Cropping..." : "Crop"}
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="text-white text-lg font-semibold">Cropping...</div>
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
