const fs = require('fs');
const file = 'c:\\Users\\user\\OneDrive\\Desktop\\wspc2\\winspin\\winspin-mobile-casino6lg\\src\\components\\PromoOffers.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import cupBonusImg")) {
  content = content.replace("import { sound } from '../utils/audio';", "import { sound } from '../utils/audio';\nimport cupBonusImg from '../../assets/images/pngs/cup_bonus.png';");
}

const lines = content.split('\n');
let newLines = [];
let inSvg = false;
let replaced = false;

for (let i = 0; i < lines.length; i++) {
  if (!replaced && lines[i].includes('<svg viewBox="0 0 400 240"')) {
    inSvg = true;
    newLines.push('                <img src={cupBonusImg} alt="Cup Bonus" className="w-full h-full object-contain p-4 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]" />');
    continue;
  }
  
  if (inSvg) {
    if (lines[i].includes('</svg>')) {
      inSvg = false;
      replaced = true;
    }
    continue;
  }
  
  newLines.push(lines[i]);
}

fs.writeFileSync(file, newLines.join('\n'));
console.log("Successfully replaced SVG with image.");
