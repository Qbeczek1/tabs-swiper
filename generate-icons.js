// Prosty generator ikon dla Tabs Swiper
// Wymaga: npm install canvas (lub użyj generate-icons.html w przeglądarce)

const fs = require('fs');
const path = require('path');

// Jeśli canvas nie jest dostępny, użyj prostego SVG -> PNG converter
// Lub po prostu użyj generate-icons.html w przeglądarce

const sizes = [16, 48, 128];
const iconsDir = path.join(__dirname, 'icons');

// Prosty SVG template
const svgTemplate = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
  <g transform="translate(${size * 0.25}, ${size * 0.25})">
    <rect x="0" y="0" width="${size * 0.5}" height="${size * 0.375}" rx="${size * 0.0625}" fill="white" opacity="0.9"/>
    <path d="M ${size * 0.35} ${size * 0.1875} L ${size * 0.43} ${size * 0.1875} M ${size * 0.39} ${size * 0.148} L ${size * 0.43} ${size * 0.1875} L ${size * 0.39} ${size * 0.227}" stroke="#51cf66" stroke-width="${size * 0.023}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M ${size * 0.148} ${size * 0.1875} L ${size * 0.07} ${size * 0.1875} M ${size * 0.109} ${size * 0.148} L ${size * 0.07} ${size * 0.1875} L ${size * 0.109} ${size * 0.227}" stroke="#ff6b6b" stroke-width="${size * 0.023}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;

// Zapisz SVG dla każdego rozmiaru (można później przekonwertować)
sizes.forEach(size => {
  const svg = svgTemplate(size);
  fs.writeFileSync(path.join(iconsDir, `icon${size}.svg`), svg);
});

console.log('SVG ikony wygenerowane!');
console.log('Aby przekonwertować do PNG:');
console.log('1. Użyj generate-icons.html w przeglądarce');
console.log('2. Lub użyj narzędzia online (np. convertio.co)');
console.log('3. Lub zainstaluj canvas: npm install canvas i uruchom ponownie');
