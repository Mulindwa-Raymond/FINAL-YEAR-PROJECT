/**
 * ImageUploader.jsx
 * 
 * Reusable component for image upload with drag-and-drop support.
 * Features:
 * - File upload with validation
 * - Image preview
 * - URL input fallback
 * - File size & format validation
 * 
 * Props:
 * - onUpload: (url) => void - Callback when image is uploaded/URL set
 * - currentUrl: string - Current image URL to display
 * - maxSizeMB: number - Max file size in MB (default: 5)
 * - allowedFormats: array - Allowed file types (default: ['jpeg', 'jpg', 'png', 'webp'])
 * - showPreview: boolean - Show image preview (default: true)
 */

import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, Check } from 'lucide-react';

export const ImageUploader = ({
  onUpload,
  currentUrl = '',
  maxSizeMB = 5,
  allowedFormats = ['jpeg', 'jpg', 'png', 'webp'],
  showPreview = true
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [useUrl, setUseUrl] = useState(false);
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [uploadedFile, setUploadedFile] = useState(null);

  // ============================================
  // FILE VALIDATION
  // ============================================

  /**
   * Validate file before upload
   */
  const validateFile = (file) => {
    setError('');

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size must be less than ${maxSizeMB}MB. Current: ${fileSizeMB.toFixed(1)}MB`);
      return false;
    }

    // Check file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedFormats.includes(fileExtension)) {
      setError(`Only ${allowedFormats.join(', ').toUpperCase()} files are allowed.`);
      return false;
    }

    return true;
  };

  // ============================================
  // FILE UPLOAD HANDLERS
  // ============================================

  /**
   * Handle file selection from input or drag-drop
   */
  const handleFileSelected = async (file) => {
    if (!validateFile(file)) {
      return;
    }

    setUploading(true);
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      setUploadedFile(file);

      // Simulate upload delay (in real app, would upload to server/cloud)
      // For now, we'll store the file and let the form handle it on submit
      setError('');
    } catch (err) {
      setError('Failed to process image');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  /**
   * Handle drag over event
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  /**
   * Handle drag leave event
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  /**
   * Handle drop event
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelected(files[0]);
    }
  };

  /**
   * Handle file input change
   */
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelected(files[0]);
    }
  };

  /**
   * Handle URL submission
   */
  const handleUrlSubmit = () => {
    if (!urlInput) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(urlInput);
      setPreview(urlInput);
      onUpload(urlInput);
      setError('');
      setUseUrl(false);
    } catch {
      setError('Invalid URL format');
    }
  };

  /**
   * Clear current image
   */
  const handleClearImage = () => {
    setPreview('');
    setUrlInput('');
    setUploadedFile(null);
    onUpload('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-3">
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Current Preview */}
      {preview && showPreview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border border-slate-200"
          />
          <button
            type="button"
            onClick={handleClearImage}
            className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 right-2 bg-green-600 text-white rounded-full p-1">
            <Check className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Upload Area (only show if no preview or in file mode) */}
      {!preview && !useUrl && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
            isDragging
              ? 'border-cyan-400 bg-cyan-50'
              : 'border-slate-300 hover:border-cyan-400 bg-slate-50 hover:bg-cyan-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={allowedFormats.map(f => `.${f}`).join(',')}
            onChange={handleFileInputChange}
            disabled={uploading}
            className="hidden"
          />

          <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-medium text-slate-700">
            {uploading ? 'Processing image...' : 'Drag and drop or click to upload'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {allowedFormats.map(f => f.toUpperCase()).join(', ')} • Max {maxSizeMB}MB
          </p>
        </div>
      )}

      {/* URL Input Mode */}
      {useUrl && !preview && (
        <div className="space-y-2">
          <input
            type="url"
            placeholder="Enter image URL (https://...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="flex-1 px-4 py-2 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700 transition"
            >
              Use URL
            </button>
            <button
              type="button"
              onClick={() => setUseUrl(false)}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 text-sm rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Toggle URL Mode */}
      {!preview && !useUrl && (
        <button
          type="button"
          onClick={() => setUseUrl(true)}
          className="w-full px-4 py-2 text-sm text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition"
        >
          Or provide image URL
        </button>
      )}

      {/* Change Image (if preview exists) */}
      {preview && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setPreview('');
              setUploadedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 text-sm rounded-lg hover:bg-slate-50 transition"
          >
            Change Image
          </button>
          <button
            type="button"
            onClick={handleClearImage}
            className="flex-1 px-4 py-2 text-red-600 border border-red-200 text-sm rounded-lg hover:bg-red-50 transition"
          >
            Remove
          </button>
        </div>
      )}

      {/* File Info */}
      {uploadedFile && (
        <p className="text-xs text-slate-500">
          File: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)}KB)
        </p>
      )}

      {/* Help Text */}
      <p className="text-xs text-slate-400">
        Upload a product image or provide a URL. Supported formats: {allowedFormats.join(', ').toUpperCase()}
      </p>
    </div>
  );
};

export default ImageUploader;
