/**
 * File URL building utilities to centralize API file path construction.
 */


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
    if (cat === 'wellness') return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80';
    if (cat === 'mental health') return 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80';
    if (cat === 'nutrition') return 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80';
    return 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80';
};




