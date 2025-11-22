import { supabase } from '../../config/supabase';
import { getCurrentCompanyId } from '../../config/supabase';

/**
 * Upload image to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} bucket - Storage bucket name (e.g., 'order-images')
 * @param {Object} options - Upload options
 * @param {string} options.companyId - Company ID for organizing files
 * @param {string} options.folder - Optional subfolder
 * @returns {Promise<string>} Public URL of uploaded image
 */
export const uploadImage = async (file, bucket = 'order-images', options = {}) => {
  try {
    const companyId = options.companyId || (await getCurrentCompanyId());
    if (!companyId) throw new Error('Company ID required for upload');

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Construct file path: company_id/folder/filename
    const folder = options.folder || 'orders';
    const filePath = `${companyId}/${folder}/${fileName}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Replace existing image with new one
 * @param {string} oldImageUrl - URL of existing image to delete
 * @param {File} newFile - New file to upload
 * @param {string} bucket - Storage bucket name
 * @param {Object} options - Upload options
 * @returns {Promise<string>} Public URL of new image
 */
export const replaceImage = async (oldImageUrl, newFile, bucket = 'order-images', options = {}) => {
  try {
    // Delete old image first
    if (oldImageUrl) {
      await deleteImage(oldImageUrl, bucket);
    }

    // Upload new image
    return await uploadImage(newFile, bucket, options);
  } catch (error) {
    console.error('Error replacing image:', error);
    throw error;
  }
};

/**
 * Delete image from Supabase Storage
 * @param {string} imageUrl - Public URL of image to delete
 * @param {string} bucket - Storage bucket name
 */
export const deleteImage = async (imageUrl, bucket = 'order-images') => {
  try {
    // Extract file path from public URL
    const urlParts = imageUrl.split(`${bucket}/`);
    if (urlParts.length < 2) {
      console.warn('Invalid image URL format:', imageUrl);
      return;
    }

    const filePath = urlParts[1];

    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw - deletion errors shouldn't block other operations
  }
};

/**
 * Get signed URL for private images (if needed in future)
 * @param {string} filePath - Path to file in storage
 * @param {string} bucket - Storage bucket name
 * @param {number} expiresIn - Expiry time in seconds (default: 1 hour)
 * @returns {Promise<string>} Signed URL
 */
export const getSignedUrl = async (filePath, bucket = 'order-images', expiresIn = 3600) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
};

/**
 * Validate image file before upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @param {number} options.maxSizeMB - Max file size in MB (default: 5MB)
 * @param {string[]} options.allowedTypes - Allowed MIME types
 * @returns {Object} { valid: boolean, error?: string }
 */
export const validateImageFile = (file, options = {}) => {
  const maxSizeMB = options.maxSizeMB || 5;
  const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Datei ist zu groß. Maximal ${maxSizeMB}MB erlaubt.`,
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Ungültiger Dateityp. Nur JPG, PNG und WebP erlaubt.',
    };
  }

  return { valid: true };
};
