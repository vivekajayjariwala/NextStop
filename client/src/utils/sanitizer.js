export function sanitizeHTML(input) {
    if (!input) return input;
    return input.toString().replace(/[&<>"'/]/g, function (char) {
        const chars = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };
        return chars[char];
    });
}

export function sanitizeFormData(formData) {
    if (!formData) return formData;
    return Object.keys(formData).reduce((acc, key) => {
        acc[key] = typeof formData[key] === 'string' ? sanitizeHTML(formData[key]) : formData[key];
        return acc;
    }, {});
} 