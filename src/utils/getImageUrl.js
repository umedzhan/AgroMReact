// Backend returns relative paths for uploaded images (e.g. "/uploads/x.jpg").
// Prefix those with the configured API origin so they resolve correctly
// whether the frontend is served from the same domain as the API or not.
export const getImageUrl = (path) => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return `${import.meta.env.VITE_API_URL}${path}`;
};
