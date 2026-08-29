const fs = require('fs');
let c = fs.readFileSync('frontend/app.js', 'utf8');

// The string literal representations of the broken UTF-8 bytes
const replacements = {
  'Ã¢â€šÂ¹': '\u20B9', // ₹
  'Ã°Å¸â€œÂ¦': '\uD83D\uDCE6', // 📦
  'Ã°Å¸Â Â½Ã¯Â¸Â ': '\uD83C\uDF7D\uFE0F', // 🍽️
  'âœ…': '\u2705', // ✅
  'Ã°Å¸â€”â€˜Ã¯Â¸Â ': '\uD83D\uDDD1\uFE0F', // 🗑️
  'â ³': '\u23F3', // ⏳
  'Ã°Å¸Â â€¢': '\uD83C\uDF54', // 🍔
};

for (const [bad, good] of Object.entries(replacements)) {
  c = c.split(bad).join(good);
}

fs.writeFileSync('frontend/app.js', c, 'utf8');
console.log('Fixed encodings in app.js');
