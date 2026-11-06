const fs = require('fs');
const file = 'c:\\Users\\user\\OneDrive\\Desktop\\wspc2\\winspin\\winspin-mobile-casino6lg\\src\\components\\PromoOffers.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove Rewards Hub Heading
content = content.replace(/<div className="flex items-center gap-1">\s*<Gift size=\{15\} className="text-\[#caa753\] animate-pulse" \/>\s*<span className="font-display font-black text-white text-\[10\.5px\] uppercase tracking-wider">Rewards Hub<\/span>\s*<\/div>/g, '');

// Change justify-between to justify-center for the tabs nav
content = content.replace(/<div id="promos_tabs_nav" className="flex items-center justify-between/g, '<div id="promos_tabs_nav" className="flex items-center justify-center');

// Remove Progress Bar Widget
const startMarker = "{/* DYNAMIC PROGRESS BAR WIDGET */}";
const endMarker = "{/* BENTO-STYLE 4 VIP CLUB REWARDS CARDS */}";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + content.substring(endIndex);
}

fs.writeFileSync(file, content);
console.log("Successfully removed sections.");
