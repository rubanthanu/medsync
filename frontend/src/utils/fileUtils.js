/**
 * File URL building utilities to centralize API file path construction.
 */

import wellnessImage from '../assets/images/misc/wellness.jpg';
import mentalHealthImage from '../assets/images/misc/mental-health.jpg';
import nutritionImage from '../assets/images/misc/nutrition.jpg';
import defaultPostImage from '../assets/images/misc/default-post.jpg';

const API_URL = import.meta.env.VITE_API_URL;

export const getApiFileUrl = (path) => {
    return `${API_URL}/${path}`;
};

export const getProfileImageUrl = (path) => {
    return `${API_URL}/${path}?t=${Date.now()}`;
};

export const getCertificatePdfUrl = (filename) => {
    return `${API_URL}/uploads/generated_pdfs/${filename}`;
};

export const getPrescriptionPdfUrl = (filename) => {
    return `${API_URL}/uploads/generated_pdfs/${filename}`;
};

export const getMedicalProofUrl = (filename) => {
    return `${API_URL}/uploads/medical_proofs/${filename}`;
};

export const getCategoryImage = (post) => {
    if (post.image_url) return post.image_url;
    const cat = post.category?.toLowerCase();
    if (cat === 'wellness') return wellnessImage;
    if (cat === 'mental health') return mentalHealthImage;
    if (cat === 'nutrition') return nutritionImage;
    return defaultPostImage;
};
