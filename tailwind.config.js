// tailwind.config.js
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    safelist: [
        { pattern: /col-span-(1|2|3|4|5|6|7|8|9|10|11|12)/ },
        { pattern: /sm:col-span-(1|2|3|4|5|6|7|8|9|10|11|12)/ },
    ],
    theme: { extend: {} },
    plugins: [],
};
