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



