'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApi } from '@/lib/api';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({ value, onChange, disabled = false }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validasi file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Hanya file gambar (JPEG, PNG, GIF, WebP) yang diizinkan');
      return;
    }

    // Validasi file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const response = await adminApi.uploadImage(file);
      const imageUrl = response.data.image_url;
      onChange(imageUrl);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.response?.data?.detail || 'Gagal mengupload gambar');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    onChange('');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* File Input (hidden) */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Current Image Preview */}
      {value && (
        <div className="relative">
          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Gambar terpilih</p>
                <p className="text-xs text-muted-foreground truncate">{value}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                disabled={disabled || isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Image Preview */}
            <div className="mt-3">
              <img
                src={value}
                alt="Preview"
                className="w-full h-32 object-cover rounded border"
              />
            </div>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {!value && (
        <Button
          type="button"
          variant="outline"
          onClick={handleUploadClick}
          disabled={disabled || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Mengupload...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Gambar
            </>
          )}
        </Button>
      )}

      {/* URL Input for manual entry */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Atau masukkan URL gambar</label>
        <Input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      </div>

      {/* Error Message */}
      {uploadError && (
        <p className="text-sm text-red-600">{uploadError}</p>
      )}

      {/* Help Text */}
      <p className="text-xs text-muted-foreground">
        Upload gambar (JPEG, PNG, GIF, WebP) maksimal 5MB, atau masukkan URL gambar
      </p>
    </div>
  );
}
