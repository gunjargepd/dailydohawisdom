const fs = require('fs');
const path = require('path');
const https = require('https');
const dohas = require('./dohas.js');

const audioDir = path.join(__dirname, 'assets', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

function cleanText(text, maxLength = 170) {
  let cleaned = text
    .replace(/\n/g, " ")
    .replace(/।।/g, ".")
    .replace(/।/g, ",")
    .replace(/  +/g, " ") // Normalize multiple spaces
    .replace(/[\\/#$%^&*@]/g, "")
    .trim();
    
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
    const lastSpace = cleaned.lastIndexOf(" ");
    if (lastSpace > 0) {
      cleaned = cleaned.substring(0, lastSpace) + "...";
    }
  }
  return cleaned;
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download, status code: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log("Starting audio pre-generation download with length limits...");
  for (let doha of dohas) {
    const id = doha.id;
    console.log(`Downloading audio for Doha #${id} (${doha.author})...`);
    
    const cleanDohaText = cleanText(doha.original);
    const cleanHiText = cleanText(doha.translation_hi);
    const cleanMrText = cleanText(doha.translation_mr);
    const cleanEnText = cleanText(doha.translation_en);

    const dohaUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=hi&client=tw-ob&q=${encodeURIComponent(cleanDohaText)}`;
    const hiUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=hi&client=tw-ob&q=${encodeURIComponent("अर्थ: " + cleanHiText)}`;
    const mrUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=mr&client=tw-ob&q=${encodeURIComponent("अर्थ: " + cleanMrText)}`;
    const enUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent("Meaning: " + cleanEnText)}`;

    try {
      await downloadFile(dohaUrl, path.join(audioDir, `doha_${id}_doha.mp3`));
      await downloadFile(hiUrl, path.join(audioDir, `doha_${id}_meaning_hi.mp3`));
      await downloadFile(mrUrl, path.join(audioDir, `doha_${id}_meaning_mr.mp3`));
      await downloadFile(enUrl, path.join(audioDir, `doha_${id}_meaning_en.mp3`));
      console.log(`✓ Doha #${id} audio generated successfully.`);
    } catch (err) {
      console.error(`✗ Failed to generate audio for Doha #${id}:`, err.message);
    }
    
    // Brief sleep to avoid hitting Google's rate limits
    await new Promise(r => setTimeout(r, 800));
  }
  console.log("Audio pre-generation complete!");
}

run();
