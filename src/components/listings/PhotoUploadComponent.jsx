// src/components/listings/PhotoUploadComponent.jsx
import React, { useState, useRef } from 'react';

const PhotoUploadComponent = ({ photos = [], onPhotosChange, maxPhotos = 5 }) => {
  const [previews, setPreviews] = useState(photos);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = maxPhotos - previews.length;
    const toAdd = files.slice(0, remainingSlots);

    const newPreviews = toAdd.map((file) => ({
      id: URL.createObjectURL(file),
      file,
      isNew: true,
    }));

    const updated = [...previews, ...newPreviews];
    setPreviews(updated);
    onPhotosChange?.(updated);
  };

  const removePhoto = (index) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onPhotosChange?.(updated);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Photos</label>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {previews.map((photo, index) => (
          <div key={photo.id || index} className="relative aspect-square">
            <img
              src={photo.isNew ? photo.id : photo.photo_url}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        ))}

        {previews.length < maxPhotos && (
          <button
            type="button"
            onClick={handleClick}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-colors"
          >
            <span className="text-2xl">+</span>
            <span className="text-xs mt-1">Add</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        {previews.length} / {maxPhotos} photos
      </p>
    </div>
  );
};

export default PhotoUploadComponent;