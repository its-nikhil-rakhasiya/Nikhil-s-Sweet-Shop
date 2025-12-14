/**
 * Format a date string to the user's local timezone
 * @param {string} dateString - ISO date string from database
 * @param {boolean} includeTime - Whether to include time in the output
 * @returns {string} Formatted date string in user's timezone
 */
export const formatDateToLocal = (dateString, includeTime = true) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);

    if (includeTime) {
        return new Intl.DateTimeFormat('default', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    }

    return new Intl.DateTimeFormat('default', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
};

/**
 * Format a date to relative time (e.g., "2 hours ago")
 * @param {string} dateString - ISO date string from database
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return formatDateToLocal(dateString, false);
};
