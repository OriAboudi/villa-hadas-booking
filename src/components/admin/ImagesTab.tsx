import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Edit2, Image as ImageIcon } from 'lucide-react';
import type { ImageAsset } from '../../types';
import { getAllImages, uploadImage, updateImage, deleteImage, saveImageMetadata } from '../../lib/firebase';
import { LoadingSpinner } from '../LoadingSpinner';
import { Modal } from '../ui/Modal';

const CATEGORIES = [
  { id: 'hero', label: 'Hero - עמוד הבית' },
  { id: 'gallery', label: 'גלריה' },
  { id: 'features', label: 'מאפיינים' },
  { id: 'other', label: 'אחר' },
] as const;

export const ImagesTab = () => {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'hero' | 'gallery' | 'features' | 'other'>('hero');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageAsset | null>(null);
  const [editFormData, setEditFormData] = useState({
    altText: '',
    displayOrder: 0,
  });

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await getAllImages();
      setImages(data);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      await uploadImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-50', 'dark:bg-blue-900/20');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900/20');
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900/20');
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        await uploadImageFile(file);
      }
    }
  };

  const uploadImageFile = async (file: File) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      const downloadURL = await uploadImage(file, (progress) => {
        setUploadProgress(Math.round(progress));
      });

      // Save metadata to Firestore
      const newImage: Omit<ImageAsset, 'id'> = {
        fileName: file.name,
        storageUrl: downloadURL,
        category: selectedCategory,
        displayOrder: images.filter(img => img.category === selectedCategory).length,
        altText: file.name.replace(/\.[^.]+$/, ''),
        uploadedAt: new Date().toISOString(),
        isActive: true,
      };

      await saveImageMetadata(newImage);
      await loadImages();
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('שגיאה בהעלאת התמונה');
    } finally {
      setUploading(false);
    }
  };

  const handleEditImage = (image: ImageAsset) => {
    setEditingImage(image);
    setEditFormData({
      altText: image.altText,
      displayOrder: image.displayOrder,
    });
    setIsModalOpen(true);
  };

  const handleSaveImage = async () => {
    if (!editingImage?.id) return;

    try {
      await updateImage(editingImage.id, {
        altText: editFormData.altText,
        displayOrder: editFormData.displayOrder,
      });
      await loadImages();
      setIsModalOpen(false);
      setEditingImage(null);
    } catch (error) {
      console.error('Error updating image:', error);
      alert('שגיאה בעדכון התמונה');
    }
  };

  const handleDeleteImage = async (image: ImageAsset) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק תמונה זו?')) return;

    try {
      await deleteImage(image.id!);
      await loadImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('שגיאה במחיקת התמונה');
    }
  };

  const categoryImages = images.filter(img => img.category === selectedCategory);

  if (loading) return <LoadingSpinner message="טוען תמונות..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <ImageIcon className="w-6 h-6" />
        ניהול תמונות
      </h2>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <p className="text-sm text-green-900 dark:text-green-300">
          ✅ <strong>תמונות נשמרות כ-Base64 ישירות בـ Firestore</strong> - אין צורך בהגדרות CORS
        </p>
      </div>

      {/* Upload Zone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-8
                 bg-slate-50 dark:bg-slate-800 transition-colors cursor-pointer hover:border-blue-500"
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="imageInput"
          disabled={uploading}
        />
        <label htmlFor="imageInput" className="cursor-pointer">
          <div className="text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-900 dark:text-white font-semibold mb-2">
              גרור תמונות כאן או לחץ להעלאה
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              תמונות JPG, PNG עד 10MB
            </p>
            {uploading && (
              <div className="mt-4">
                <div className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </label>
      </motion.div>

      {/* Images Grid */}
      {categoryImages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryImages
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* Image Thumbnail */}
                <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <img
                    src={image.storageUrl}
                    alt={image.altText}
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23999" width="400" height="300"/%3E%3C/svg%3E';
                    }}
                  />
                  {!image.isActive && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-bold">לא פעיל</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">שם קובץ</p>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                      {image.fileName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">תיאור</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{image.altText}</p>
                  </div>
                  <div className="flex gap-2 justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>סדר: {image.displayOrder + 1}</span>
                    <span>{new Date(image.uploadedAt).toLocaleDateString('he-IL')}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEditImage(image)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2
                               bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400
                               rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm">ערוך</span>
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2
                               bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400
                               rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">מחק</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl">
          <p className="text-slate-600 dark:text-slate-400">אין תמונות בקטגוריה זו עדיין</p>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingImage(null);
        }}
        title="ערוך תמונה"
      >
        <div className="space-y-4">
          {editingImage && (
            <>
              {/* Image Preview */}
              <div className="w-full h-48 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                <img
                  src={editingImage.storageUrl}
                  alt={editingImage.altText}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23999" width="400" height="300"/%3E%3C/svg%3E';
                  }}
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  תיאור התמונה (Alt Text)
                </label>
                <input
                  type="text"
                  value={editFormData.altText}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, altText: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600
                           rounded-lg dark:bg-slate-700 dark:text-white"
                  placeholder="תיאור קצר של התמונה"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  סדר הצגה (1 = ראשון)
                </label>
                <input
                  type="number"
                  value={editFormData.displayOrder}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      displayOrder: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600
                           rounded-lg dark:bg-slate-700 dark:text-white"
                  min="0"
                />
              </div>

              {/* File Info */}
              <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm">
                <p><strong>שם קובץ:</strong> {editingImage.fileName}</p>
                <p><strong>קטגוריה:</strong> {editingImage.category}</p>
                <p><strong>תאריך העלאה:</strong> {new Date(editingImage.uploadedAt).toLocaleDateString('he-IL')}</p>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveImage}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600
                         text-white font-bold rounded-lg hover:scale-105 transition-transform"
              >
                שמור שינויים
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
