// Daily Doha Wisdom - Main Application Logic
// Handles: Theme Presets, HTML5 Canvas Rendering, File Upload, Text-to-Speech (TTS),
// Sharing API, LocalStorage Gamified Quiz, and Dark/Light Mode switcher.

document.addEventListener("DOMContentLoaded", () => {
  // --- State Variables ---
  let currentDoha = dohas[0];
  let activeTab = "hi"; // hi, mr, en
  let activeAspect = "9_16"; // 9_16, 1_1
  let activePreset = 0;
  let customDohaText = "";
  let customTranslationText = "";
  let isAudioPlaying = false;
  let uploadedBgImage = null; // Stores Image object if uploaded
  let tintOpacity = 40; // Percentage out of 100 for background tint
  
  // Quiz State
  let quizCurrentDoha = null;
  let quizCorrectIndex = -1;
  let quizStreak = parseInt(localStorage.getItem("quizStreak")) || 0;
  let quizScore = parseInt(localStorage.getItem("quizScore")) || 0;

  // --- Background presets for canvas ---
  const backgroundPresets = [
    {
      name: "Royal Velvet",
      theme: "dark",
      colors: ["#140226", "#3b0764"],
      textColor: "#ffffff",
      accentColor: "#ff9933",
      goldColor: "#ffd700",
      fontFamily: "'Rozha One', 'Yatra One', serif"
    },
    {
      name: "Saffron Dawn",
      theme: "dark",
      colors: ["#993300", "#ff9933"],
      textColor: "#ffffff",
      accentColor: "#ffd700",
      goldColor: "#ffffff",
      fontFamily: "'Rozha One', 'Yatra One', serif"
    },
    {
      name: "Cosmic Indigo",
      theme: "dark",
      colors: ["#120136", "#400082"],
      textColor: "#ffffff",
      accentColor: "#ff9933",
      goldColor: "#ffd700",
      fontFamily: "'Rozha One', 'Yatra One', serif"
    },
    {
      name: "Golden Aura",
      theme: "dark",
      colors: ["#3d2b00", "#997300"],
      textColor: "#ffffff",
      accentColor: "#ff9933",
      goldColor: "#fff1b8",
      fontFamily: "'Rozha One', 'Yatra One', serif"
    },
    {
      name: "Peaceful Ivory",
      theme: "light",
      colors: ["#fcfbfa", "#f5eae1"],
      textColor: "#1a052e",
      accentColor: "#cc6600",
      goldColor: "#997300",
      fontFamily: "'Rozha One', 'Yatra One', serif"
    }
  ];

  // --- HTML5 Canvas Setup ---
  const canvas = document.getElementById("posterCanvas");
  const ctx = canvas.getContext("2d");

  // Preload Saint Avatars for stickers
  const avatarImages = {};
  const saintsList = ["Kabir Saheb", "Meera Bai", "Rahim Das", "Garib Das Ji", "Tulsidas"];
  const avatarAssetMap = {
    "Kabir Saheb": "assets/kabir_avatar.jpg",
    "Meera Bai": "assets/meera_avatar.jpg",
    "Rahim Das": "assets/rahim_avatar.jpg",
    "Garib Das Ji": "assets/garibdas_avatar.jpg",
    "Tulsidas": "assets/tulsi_avatar.jpg"
  };

  saintsList.forEach(name => {
    const img = new Image();
    img.src = avatarAssetMap[name];
    img.onload = () => {
      avatarImages[name] = img;
      drawPoster();
    };
  });

  // Bind change event on the new sticker selector
  const stickerSelect = document.getElementById("saintStickerSelect");
  if (stickerSelect) {
    stickerSelect.addEventListener("change", () => {
      drawPoster();
    });
  }

  function drawPoster() {
    if (!canvas) return;
    const preset = backgroundPresets[activePreset];
    const isSquare = activeAspect === "1_1";
    
    // Output dimensions (high resolution for download crispness)
    const width = 1080;
    const height = isSquare ? 1080 : 1920;
    
    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background (Either Custom Uploaded Image or Preset Gradient)
    if (uploadedBgImage) {
      // Draw uploaded image stretched to fit cover
      const imgWidth = uploadedBgImage.width;
      const imgHeight = uploadedBgImage.height;
      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = width / height;
      
      let sWidth = imgWidth;
      let sHeight = imgHeight;
      let sx = 0;
      let sy = 0;
      
      if (imgRatio > canvasRatio) {
        // Image is wider than canvas
        sWidth = imgHeight * canvasRatio;
        sx = (imgWidth - sWidth) / 2;
      } else {
        // Image is taller than canvas
        sHeight = imgWidth / canvasRatio;
        sy = (imgHeight - sHeight) / 2;
      }
      
      ctx.drawImage(uploadedBgImage, sx, sy, sWidth, sHeight, 0, 0, width, height);
      
      // Draw translucent black tint overlay for text readability
      ctx.fillStyle = `rgba(7, 5, 18, ${tintOpacity / 100})`;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Draw gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, preset.colors[0]);
      grad.addColorStop(1, preset.colors[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Draw Spiritual Frame/Borders
    ctx.strokeStyle = preset.goldColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = preset.accentColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, width - 90, height - 90);

    // Corner Dots
    drawCornerDesigns(width, height, preset.goldColor);

    // 3. Draw Brand Header
    ctx.fillStyle = preset.accentColor;
    ctx.font = "bold 26px Montserrat, Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("DAILY DOHA WISDOM", width / 2, 70);

    ctx.fillStyle = uploadedBgImage ? "#ffffff" : preset.textColor;
    ctx.font = "italic 20px Montserrat, Arial";
    ctx.fillText("~ True Devotion & Life Teachings ~", width / 2, 110);

    // 3.5 Draw Saint Sticker (if selected)
    const activeStickerSelect = document.getElementById("saintStickerSelect");
    const activeSticker = activeStickerSelect ? activeStickerSelect.value : "none";
    if (activeSticker && activeSticker !== "none" && avatarImages[activeSticker]) {
      const img = avatarImages[activeSticker];
      const circleX = width / 2;
      const circleY = isSquare ? 270 : 350;
      const radius = 115;

      ctx.save();
      ctx.beginPath();
      ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip(); // Clip drawing region to circle
      
      // Draw image inside clip
      ctx.drawImage(img, circleX - radius, circleY - radius, radius * 2, radius * 2);
      ctx.restore(); // Restore clip region
      
      // Draw a beautiful golden ring border around the circle sticker
      ctx.beginPath();
      ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = preset.goldColor;
      ctx.lineWidth = 6;
      ctx.stroke();
    }

    // 4. Draw Doha Couplet text (Devanagari)
    const textToDraw = customDohaText.trim() || currentDoha.original;
    ctx.fillStyle = "#ffffff"; // Keep text white on canvas for maximum contrast (unless preset is light and no image)
    if (!uploadedBgImage && preset.theme === "light") {
      ctx.fillStyle = preset.textColor;
    }
    
    // Add text shadow for image background readability
    ctx.shadowColor = "rgba(0,0,0,0.85)";
    ctx.shadowBlur = uploadedBgImage ? 12 : (preset.theme === "dark" ? 8 : 1);
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const dohaFontSize = parseInt(document.getElementById("dohaFontSize").value) || 48;
    ctx.font = `${dohaFontSize}px 'Rozha One', 'Yatra One', Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const rawLines = textToDraw.split("\n");
    const wrappedDohaLines = [];
    const maxTextWidth = width - 180;

    rawLines.forEach(line => {
      wrappedDohaLines.push(...wrapText(ctx, line, maxTextWidth));
    });

    let dohaY = isSquare ? (height / 2 - 120) : (height / 2 - 250);
    if (activeSticker && activeSticker !== "none") {
      const circleY = isSquare ? 270 : 350;
      const radius = 115;
      dohaY = circleY + radius + 70;
    }
    const lineSpacing = dohaFontSize * 1.5;
    
    wrappedDohaLines.forEach((line, index) => {
      ctx.fillText(line, width / 2, dohaY + (index * lineSpacing));
    });

    // Reset Shadows for translations
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // 5. Draw divider line
    const dividerY = dohaY + (wrappedDohaLines.length * lineSpacing) + 30;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 150, dividerY);
    ctx.lineTo(width / 2 + 150, dividerY);
    ctx.strokeStyle = preset.accentColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width / 2, dividerY, 8, 0, Math.PI * 2);
    ctx.fillStyle = preset.goldColor;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = preset.accentColor;
    ctx.stroke();

    // 6. Draw Author
    const authorY = dividerY + 60;
    ctx.fillStyle = preset.goldColor;
    const authorName = customDohaText.trim() ? "Wisdom Quote" : currentDoha.author;
    ctx.font = "bold 34px 'Rozha One', Georgia, serif";
    ctx.fillText(`- ${authorName}`, width / 2, authorY);

    // 7. Draw Translation/Meaning Text
    let transText = customTranslationText.trim();
    if (!transText) {
      if (activeTab === "mr") transText = currentDoha.translation_mr;
      else if (activeTab === "hi") transText = currentDoha.translation_hi;
      else transText = currentDoha.translation_en;
    }

    ctx.fillStyle = "#ffffff";
    if (!uploadedBgImage && preset.theme === "light") {
      ctx.fillStyle = preset.textColor;
    }
    
    // Add minor shadow to translation text
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = uploadedBgImage ? 8 : 0;
    
    const transFontSize = parseInt(document.getElementById("transFontSize").value) || 28;
    ctx.font = `italic ${transFontSize}px 'Montserrat', Arial`;
    
    const wrappedTransLines = wrapText(ctx, transText, width - 200);
    const transY = authorY + 80;
    const transLineSpacing = transFontSize * 1.45;

    wrappedTransLines.forEach((line, index) => {
      ctx.fillText(line, width / 2, transY + (index * transLineSpacing));
    });
    
    ctx.shadowBlur = 0;

    // 8. Draw Brand Watermark
    const showWatermark = document.getElementById("toggleWatermark").checked;
    if (showWatermark) {
      const footerY = height - 100;
      ctx.fillStyle = preset.accentColor;
      ctx.font = "bold 24px Montserrat, Arial";
      ctx.fillText("Instagram / YouTube: @dailydohawisdom", width / 2, footerY);

      const userName = document.getElementById("watermarkText").value.trim();
      if (userName) {
        ctx.fillStyle = "#ffffff";
        if (!uploadedBgImage && preset.theme === "light") {
          ctx.fillStyle = preset.textColor;
        }
        ctx.font = "18px Montserrat, Arial";
        ctx.fillText(`Shared by: ${userName}`, width / 2, footerY + 36);
      }
    }
  }

  function drawCornerDesigns(w, h, color) {
    ctx.fillStyle = color;
    const offset = 45;
    const size = 12;
    ctx.beginPath(); ctx.arc(offset, offset, size, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(w - offset, offset, size, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(offset, h - offset, size, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(w - offset, h - offset, size, 0, Math.PI * 2); ctx.fill();
  }

  function wrapText(context, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      if (word.includes("\n")) {
        const parts = word.split("\n");
        let testLine = currentLine + parts[0] + " ";
        let metrics = context.measureText(testLine);
        if (metrics.width > maxWidth && currentLine !== "") {
          lines.push(currentLine.trim());
          currentLine = parts[0] + " ";
        } else {
          currentLine = testLine;
        }
        lines.push(currentLine.trim());
        currentLine = parts[1] + " ";
        continue;
      }

      let testLine = currentLine + word + " ";
      let metrics = context.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());
    return lines.filter(line => line.length > 0);
  }

  // --- Custom Image Background Upload Logic ---
  const bgUploadInput = document.getElementById("customBgUpload");
  const tintControls = document.getElementById("tintControls");
  const opacityRange = document.getElementById("bgOpacityRange");
  const opacityLabel = document.getElementById("bgOpacityLabel");

  bgUploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          uploadedBgImage = img;
          tintControls.style.display = "flex"; // Show opacity controls
          drawPoster();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  opacityRange.addEventListener("input", (e) => {
    tintOpacity = e.target.value;
    opacityLabel.textContent = `Tint Overlay Opacity: ${tintOpacity}%`;
    drawPoster();
  });

  // --- Text to Speech (TTS) Logic ---
  let voices = [];
  
  function loadVoices() {
    if ('speechSynthesis' in window) {
      voices = window.speechSynthesis.getVoices();
    }
  }

  loadVoices();
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  function cleanTextForSpeech(text) {
    return text
      .replace(/\n/g, " ")
      .replace(/।।/g, ".")
      .replace(/।/g, ",")
      .replace(/[\\/#$%^&*@]/g, "");
  }

  // Fallback to local browser Speech Synthesis if offline or custom text is typed
  function speakLocalSynthesisFallback(text, lang) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleaned = cleanTextForSpeech(text);
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = lang === "hi" ? "hi-IN" : (lang === "mr" ? "mr-IN" : "en-US");
      
      const targetVoice = voices.find(voice => voice.lang.includes(lang));
      if (targetVoice) {
        utterance.voice = targetVoice;
      }
      
      utterance.pitch = 1.0;
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }

  // Plays pre-recorded natural human voice MP3s, falling back to Web Speech API if customized
  function playDohaVoice(dohaObj, type = "doha", langPref = "hi") {
    if (window.currentAudioTTS) {
      window.currentAudioTTS.pause();
    }

    // Start background Flute music in soft mode if not already playing at active volume
    if (!isAudioPlaying) {
      playFluteMusic(0.18); // Soothing background volume
    }

    // If the user has typed custom text, we must generate local speech synthesis dynamically
    const isCustomDoha = customDohaText.trim() !== "";
    const isCustomTrans = customTranslationText.trim() !== "";
    
    if (type === "doha" && isCustomDoha) {
      speakLocalSynthesisFallback(customDohaText, "hi");
      return;
    }
    if (type === "meaning" && isCustomTrans) {
      speakLocalSynthesisFallback(customTranslationText, langPref);
      return;
    }

    // Play pre-recorded file! (100% offline, no CORS, works on all devices!)
    const id = dohaObj.id;
    const filename = type === "doha" ? `doha_${id}_doha.mp3` : `doha_${id}_meaning_${langPref}.mp3`;
    const audioPath = `assets/audio/${filename}`;
    
    const audio = new Audio(audioPath);
    window.currentAudioTTS = audio;
    
    return audio.play().catch(err => {
      console.warn("Failed to play local audio file, using synthesis fallback", err);
      const textToSpeak = type === "doha" ? dohaObj.original : (langPref === "mr" ? dohaObj.translation_mr : (langPref === "hi" ? dohaObj.translation_hi : dohaObj.translation_en));
      speakLocalSynthesisFallback(textToSpeak, langPref);
    });
  }

  // Helper to handle ending of a narration track
  function handleNarrationEnded() {
    // If the user hasn't explicitly turned on background music, fade out the Flute music
    if (!isAudioPlaying) {
      fadeFluteMusic(0, 1000);
    }
  }

  // Bind Voiceover Buttons
  document.getElementById("speakFeaturedDohaBtn").addEventListener("click", () => {
    // Play Doha (Hindi), and when it ends, play the meaning in the active tab language
    playDohaVoice(currentDoha, "doha", "hi");
    
    if (window.currentAudioTTS) {
      window.currentAudioTTS.onended = () => {
        playDohaVoice(currentDoha, "meaning", activeTab);
        if (window.currentAudioTTS) {
          window.currentAudioTTS.onended = handleNarrationEnded;
        }
      };
    }
  });

  document.getElementById("speakPosterDohaBtn").addEventListener("click", () => {
    playDohaVoice(currentDoha, "doha", "hi");
    
    if (window.currentAudioTTS) {
      window.currentAudioTTS.onended = () => {
        playDohaVoice(currentDoha, "meaning", activeTab);
        if (window.currentAudioTTS) {
          window.currentAudioTTS.onended = handleNarrationEnded;
        }
      };
    }
  });

  document.getElementById("speakQuizDohaBtn").addEventListener("click", () => {
    if (quizCurrentDoha) {
      if (window.currentAudioTTS) {
        window.currentAudioTTS.pause();
      }
      
      // Start background Flute music
      if (!isAudioPlaying) {
        playFluteMusic(0.18);
      }
      
      const dohaPath = `assets/audio/doha_${quizCurrentDoha.id}_doha.mp3`;
      const audioDoha = new Audio(dohaPath);
      window.currentAudioTTS = audioDoha;
      
      audioDoha.play()
        .then(() => {
          audioDoha.onended = () => {
            // When the doha ends, play the Marathi interactive prompt: "या दोह्याचा अर्थ सांगा तुम्ही"
            const audioPrompt = new Audio("assets/audio/quiz_prompt.mp3");
            window.currentAudioTTS = audioPrompt;
            audioPrompt.play()
              .then(() => {
                audioPrompt.onended = () => {
                  handleNarrationEnded();
                };
              })
              .catch(err => {
                console.warn("Failed to play quiz prompt audio", err);
                handleNarrationEnded();
              });
          };
        })
        .catch(err => {
          console.warn("Failed to play quiz audio", err);
          handleNarrationEnded();
        });
    }
  });

  // --- Gamified Doha Quiz Logic ---
  const quizStreakEl = document.getElementById("quizStreak");
  const quizScoreEl = document.getElementById("quizScore");
  const quizQuestionText = document.getElementById("quizQuestionText");
  const quizOptionsList = document.getElementById("quizOptionsList");
  const quizFeedback = document.getElementById("quizFeedback");
  const nextQuizBtn = document.getElementById("nextQuizBtn");

  function loadQuizChallenge() {
    quizFeedback.textContent = "";
    quizFeedback.className = "quiz-feedback-box";
    nextQuizBtn.style.display = "none";
    
    // Pick random Doha
    const randomIndex = Math.floor(Math.random() * dohas.length);
    quizCurrentDoha = dohas[randomIndex];
    quizQuestionText.textContent = quizCurrentDoha.original;

    // Pick 2 other random dohas to get false translations (Hindi meanings)
    const options = [quizCurrentDoha.translation_hi];
    while (options.length < 3) {
      const randomFake = dohas[Math.floor(Math.random() * dohas.length)].translation_hi;
      if (!options.includes(randomFake)) {
        options.push(randomFake);
      }
    }

    // Shuffle options
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    quizCorrectIndex = shuffledOptions.indexOf(quizCurrentDoha.translation_hi);

    // Render option buttons
    quizOptionsList.innerHTML = "";
    shuffledOptions.forEach((option, index) => {
      const btn = document.createElement("button");
      btn.className = "quiz-option-btn";
      btn.textContent = `${index + 1}. ${option}`;
      btn.addEventListener("click", () => selectQuizOption(btn, index));
      quizOptionsList.appendChild(btn);
    });
    
    // Render Stats
    quizStreakEl.textContent = quizStreak;
    quizScoreEl.textContent = quizScore;
  }

  function selectQuizOption(selectedBtn, selectedIndex) {
    // Disable all options
    const buttons = quizOptionsList.querySelectorAll(".quiz-option-btn");
    buttons.forEach(btn => btn.disabled = true);

    if (selectedIndex === quizCorrectIndex) {
      // Correct!
      selectedBtn.classList.add("correct");
      quizFeedback.textContent = "🌸 सही उत्तर! (Correct Answer) +10 Points";
      quizFeedback.className = "quiz-feedback-box correct";
      
      quizStreak += 1;
      quizScore += 10;
    } else {
      // Incorrect!
      selectedBtn.classList.add("wrong");
      // Highlight correct answer
      buttons[quizCorrectIndex].classList.add("correct");
      quizFeedback.textContent = "❌ गलत उत्तर! (Wrong Answer) Streak Reset.";
      quizFeedback.className = "quiz-feedback-box wrong";
      
      quizStreak = 0;
    }

    // Save to LocalStorage
    localStorage.setItem("quizStreak", quizStreak);
    localStorage.setItem("quizScore", quizScore);
    
    quizStreakEl.textContent = quizStreak;
    quizScoreEl.textContent = quizScore;
    
    nextQuizBtn.style.display = "block";
    recordSadhanaActivity(); // Record daily streak activity!
  }

  nextQuizBtn.addEventListener("click", loadQuizChallenge);

  // --- Dark & Light Mode Switcher Logic ---
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  
  // Set theme from localStorage on load
  const currentTheme = localStorage.getItem("theme") || "dark";
  if (currentTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggleBtn.textContent = "☀️";
  } else {
    document.body.classList.remove("light-mode");
    themeToggleBtn.textContent = "🌙";
  }

  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLightMode = document.body.classList.contains("light-mode");
    
    if (isLightMode) {
      themeToggleBtn.textContent = "☀️";
      localStorage.setItem("theme", "light");
    } else {
      themeToggleBtn.textContent = "🌙";
      localStorage.setItem("theme", "dark");
    }
    
    // Redraw canvas with proper theme colors
    drawPoster();
  });

  // --- Direct Sharing Logic ---
  
  // WhatsApp text share
  document.getElementById("shareWhatsAppBtn").addEventListener("click", () => {
    const doha = customDohaText.trim() || currentDoha.original;
    const meaning = customTranslationText.trim() || currentDoha.translation_hi;
    const author = customDohaText.trim() ? "" : ` - ${currentDoha.author}`;
    
    const textToShare = `*Daily Doha Wisdom* 🕉️\n\n"${doha}"${author}\n\n*अर्थ:* ${meaning}\n\nबनाएं अपने खुद के स्टेटस कार्ड्स: ${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`;
    window.open(url, "_blank");
  });

  // System Share API (Shares image blob directly if mobile supports it)
  document.getElementById("shareGeneralBtn").addEventListener("click", () => {
    canvas.toBlob((blob) => {
      const file = new File([blob], "dailydohawisdom.png", { type: "image/png" });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: 'Daily Doha Wisdom',
          text: 'चेक करें यह सुंदर दोहा स्टेटस कार्ड!'
        })
        .catch(error => console.warn("Share failed", error));
      } else {
        // Fallback: Copy Link & Text to clipboard
        const doha = customDohaText.trim() || currentDoha.original;
        const textToCopy = `"${doha}" - Daily Doha Wisdom. ${window.location.href}`;
        
        navigator.clipboard.writeText(textToCopy)
          .then(() => alert("Doha text copied to clipboard! Share it anywhere."))
          .catch(() => alert("Failed to copy. Please download the PNG image to share."));
      }
    }, "image/png");
  });

  // --- Krishna Flute Background Music Setup ---
  const bgFlute = new Audio("assets/audio/voice_bg_music.mp3");
  bgFlute.loop = true;
  bgFlute.volume = 0.28; // Audibly clear background volume

  function playFluteMusic(vol = 0.28) {
    bgFlute.volume = vol;
    bgFlute.play().catch(e => console.warn("Auto-play background music blocked", e));
  }

  function fadeFluteMusic(targetVol, duration = 800) {
    const steps = 10;
    const intervalTime = duration / steps;
    const currentVol = bgFlute.volume;
    const volStep = (targetVol - currentVol) / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      bgFlute.volume = Math.max(0, Math.min(1, bgFlute.volume + volStep));
      currentStep++;
      if (currentStep >= steps) {
        clearInterval(interval);
        bgFlute.volume = targetVol;
        if (targetVol === 0) {
          bgFlute.pause();
        }
      }
    }, intervalTime);
  }

  function toggleAudio() {
    const audioBtn = document.getElementById("toggleAudioBtn");
    
    if (!isAudioPlaying) {
      playFluteMusic(0.28); // Play at active listening volume
      isAudioPlaying = true;
      audioBtn.classList.remove("muted");
    } else {
      fadeFluteMusic(0.0, 800); // Fade out smoothly
      isAudioPlaying = false;
      audioBtn.classList.add("muted");
    }
  }

  document.getElementById("toggleAudioBtn").addEventListener("click", toggleAudio);

  // --- Dynamic Canvas Preset Render & Click binding ---
  const presetContainer = document.getElementById("presetColorPicker");
  backgroundPresets.forEach((preset, index) => {
    const btn = document.createElement("button");
    btn.className = `preset-color-btn ${index === activePreset ? 'active' : ''}`;
    btn.title = preset.name;
    btn.style.background = `linear-gradient(135deg, ${preset.colors[0]} 0%, ${preset.colors[1]} 100%)`;
    
    btn.addEventListener("click", () => {
      // Clear uploaded image to show preset color
      uploadedBgImage = null;
      tintControls.style.display = "none";
      bgUploadInput.value = ""; // Reset file input
      
      document.querySelectorAll(".preset-color-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activePreset = index;
      drawPoster();
    });
    
    presetContainer.appendChild(btn);
  });

  // Aspect controls
  const aspectButtons = document.querySelectorAll(".aspect-btn");
  aspectButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      aspectButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeAspect = btn.dataset.aspect;
      drawPoster();
    });
  });

  // Edit fields binding
  const dohaInput = document.getElementById("customDohaInput");
  const transInput = document.getElementById("customTransInput");
  const watermarkInput = document.getElementById("watermarkText");
  const toggleWatermark = document.getElementById("toggleWatermark");
  const dohaFontSize = document.getElementById("dohaFontSize");
  const transFontSize = document.getElementById("transFontSize");

  dohaInput.addEventListener("input", (e) => {
    customDohaText = e.target.value;
    drawPoster();
  });

  transInput.addEventListener("input", (e) => {
    customTranslationText = e.target.value;
    drawPoster();
  });

  watermarkInput.addEventListener("input", () => {
    drawPoster();
  });

  toggleWatermark.addEventListener("change", () => {
    drawPoster();
  });

  dohaFontSize.addEventListener("input", () => {
    document.getElementById("dohaFontSizeVal").textContent = `${dohaFontSize.value}px`;
    drawPoster();
  });

  transFontSize.addEventListener("input", () => {
    document.getElementById("transFontSizeVal").textContent = `${transFontSize.value}px`;
    drawPoster();
  });

  // --- Translation Tab clicking ---
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeTab = btn.dataset.tab;
      
      updateFeaturedDohaDisplay();
      drawPoster();
    });
  });

  function updateFeaturedDohaDisplay() {
    const dohaTextEl = document.getElementById("featuredDohaText");
    const dohaAuthorEl = document.getElementById("featuredDohaAuthor");
    const translationTextEl = document.getElementById("translationText");

    dohaTextEl.textContent = currentDoha.original;
    dohaAuthorEl.textContent = `- ${currentDoha.author}`;
    
    if (activeTab === "mr") translationTextEl.textContent = currentDoha.translation_mr;
    else if (activeTab === "hi") translationTextEl.textContent = currentDoha.translation_hi;
    else translationTextEl.textContent = currentDoha.translation_en;
  }

  // --- Library Rendering ---
  const libraryGrid = document.getElementById("libraryGrid");
  const categoryFilters = document.querySelectorAll(".filter-chip");
  let activeCategory = "all";
  let libraryLimit = 6;

  function renderLibrary() {
    libraryGrid.innerHTML = "";
    
    const filteredDohas = dohas.filter(item => {
      if (activeCategory === "all") return true;
      if (item.category === activeCategory) return true;
      const authorMatch = item.author.toLowerCase().replace(/\s/g, "") === activeCategory.toLowerCase().replace(/\s/g, "");
      return authorMatch;
    });

    const displayDohas = filteredDohas.slice(0, libraryLimit);

    displayDohas.forEach(item => {
      const card = document.createElement("div");
      card.className = "library-card";
      
      card.innerHTML = `
        <div class="library-card-text">${item.original.replace(/\n/g, '<br>')}</div>
        <div class="library-card-footer">
          <span class="library-card-author">${item.author}</span>
          <span class="library-card-category">${item.category}</span>
        </div>
      `;
      
      card.addEventListener("click", () => {
        currentDoha = item;
        customDohaText = "";
        customTranslationText = "";
        
        dohaInput.value = "";
        transInput.value = "";
        
        updateFeaturedDohaDisplay();
        drawPoster();
        
        document.getElementById("posterCreatorSection").scrollIntoView({ behavior: "smooth" });
      });
      
      libraryGrid.appendChild(card);
    });

    // Render Show More / Show Less Button
    const showMoreContainer = document.getElementById("libraryShowMoreContainer");
    if (showMoreContainer) {
      showMoreContainer.innerHTML = "";
      if (filteredDohas.length > libraryLimit && libraryLimit === 6) {
        const btn = document.createElement("button");
        btn.className = "show-more-btn";
        btn.textContent = "Show More / अधिक दोहे पहा ➔";
        btn.addEventListener("click", () => {
          libraryLimit = 999;
          renderLibrary();
        });
        showMoreContainer.appendChild(btn);
      } else if (libraryLimit > 6 && filteredDohas.length > 6) {
        const btn = document.createElement("button");
        btn.className = "show-more-btn";
        btn.textContent = "Show Less / कमी करा ▲";
        btn.addEventListener("click", () => {
          libraryLimit = 6;
          renderLibrary();
          document.getElementById("librarySection").scrollIntoView({ behavior: "smooth" });
        });
        showMoreContainer.appendChild(btn);
      }
    }
  }

  categoryFilters.forEach(chip => {
    chip.addEventListener("click", () => {
      categoryFilters.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeCategory = chip.dataset.filter;
      renderLibrary();
    });
  });

  // --- Canvas Download Poster ---
  const downloadBtn = document.getElementById("downloadPosterBtn");
  downloadBtn.addEventListener("click", () => {
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    const authorName = (customDohaText.trim() ? "Custom" : currentDoha.author).toLowerCase().replace(/\s/g, "_");
    link.download = `dailydohawisdom_${authorName}_${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // --- Hero Slider / Carousel Logic ---
  let currentSlide = 0;
  const slides = document.querySelectorAll(".slide");
  const track = document.getElementById("sliderTrack");
  const dots = document.querySelectorAll(".slider-dot");
  const nextBtn = document.getElementById("sliderNext");
  const prevBtn = document.getElementById("sliderPrev");
  let autoPlayTimer = null;

  function updateSlider() {
    if (!track) return;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  function nextSlide() {
    if (slides.length === 0) return;
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
  }

  function prevSlide() {
    if (slides.length === 0) return;
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(nextSlide, 4500);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener("click", (e) => {
      currentSlide = parseInt(e.target.dataset.index);
      updateSlider();
      startAutoPlay();
    });
  });

  if (track && slides.length > 0) {
    startAutoPlay();
  }

  // ==========================================================================
  // Daily Sadhana Hub (Engagement Features) Implementation
  // ==========================================================================

  // --- 1. Daily Streak Tracker ---
  let activityHistory = JSON.parse(localStorage.getItem("sadhanaActivityHistory")) || [];
  let sadhanaStreak = parseInt(localStorage.getItem("sadhanaStreak")) || 0;
  let lastActivityDate = localStorage.getItem("sadhanaLastActivityDate") || "";

  function getTodayDateString() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }

  function recordSadhanaActivity() {
    const todayStr = getTodayDateString();
    if (!activityHistory.includes(todayStr)) {
      activityHistory.push(todayStr);
      localStorage.setItem("sadhanaActivityHistory", JSON.stringify(activityHistory));
    }
    
    // Compute Streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    if (lastActivityDate === todayStr) {
      // Already recorded today, streak is same
    } else if (lastActivityDate === yesterdayStr || lastActivityDate === "") {
      sadhanaStreak = lastActivityDate === yesterdayStr ? sadhanaStreak + 1 : 1;
      localStorage.setItem("sadhanaStreak", sadhanaStreak);
      localStorage.setItem("sadhanaLastActivityDate", todayStr);
    } else {
      // Missed days, reset streak
      sadhanaStreak = 1;
      localStorage.setItem("sadhanaStreak", sadhanaStreak);
      localStorage.setItem("sadhanaLastActivityDate", todayStr);
    }

    renderStreakCalendar();
  }

  function renderStreakCalendar() {
    const grid = document.getElementById("streakCalendarGrid");
    const statusText = document.getElementById("streakStatusText");
    if (!grid || !statusText) return;

    grid.innerHTML = "";
    
    // Get start of current week (Sunday)
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDayOfWeek);

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todayStr = getTodayDateString();
    let completedToday = activityHistory.includes(todayStr);

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      const dateStr = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`;
      
      const isCompleted = activityHistory.includes(dateStr);
      const isCurrentDay = dateStr === todayStr;

      const dayCard = document.createElement("div");
      dayCard.className = "streak-day-circle";

      const dot = document.createElement("div");
      dot.className = `day-dot ${isCompleted ? 'active' : ''} ${isCurrentDay ? 'today' : ''}`;
      dot.innerHTML = isCompleted ? "✓" : weekdays[i][0];

      const label = document.createElement("div");
      label.className = "day-label";
      label.textContent = weekdays[i];

      dayCard.appendChild(dot);
      dayCard.appendChild(label);
      grid.appendChild(dayCard);
    }

    if (completedToday) {
      statusText.innerHTML = `🌟 आजची साधना पूर्ण! (Today's Sadhana Done!)<br><span style="font-size:1.1rem; color:var(--brand-gold)">🔥 Continuous Streak: ${sadhanaStreak} Days</span>`;
    } else {
      statusText.innerHTML = `⚠️ आजची साधना अजून बाकी आहे. (Today's Sadhana Pending.)<br><span style="font-size:0.9rem; color:var(--text-muted)">Read Doha, solve Quiz or write Journal to complete!</span>`;
    }
  }

  // --- 2. Doha Wheel of Wisdom ---
  const wheelCanvas = document.getElementById("wheelCanvas");
  const spinBtn = document.getElementById("spinWheelBtn");
  const wheelResultBox = document.getElementById("wheelResultBox");
  const resultAuthor = document.getElementById("wheelResultAuthor");
  const resultQuote = document.getElementById("wheelResultQuote");
  const resultAdvice = document.getElementById("wheelResultAdvice");
  const useInStudioBtn = document.getElementById("useInStudioBtn");

  const segments = ["Kabir Saheb", "Meera Bai", "Rahim Das", "Garib Das Ji", "Tulsidas", "Daily Advice"];
  const segmentColors = ["#ff7300", "#7a15f7", "#00b894", "#fdcb6e", "#e17055", "#0984e3"];
  let wheelAngle = 0;
  let isSpinning = false;
  let selectedWheelDoha = null;

  function drawWheel() {
    if (!wheelCanvas) return;
    const ctx = wheelCanvas.getContext("2d");
    const size = wheelCanvas.width;
    const center = size / 2;
    const radius = center - 8;
    const anglePerSegment = (2 * Math.PI) / segments.length;

    ctx.clearRect(0, 0, size, size);

    // Draw segment slices
    for (let i = 0; i < segments.length; i++) {
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, i * anglePerSegment, (i + 1) * anglePerSegment);
      ctx.closePath();
      ctx.fillStyle = segmentColors[i];
      ctx.fill();

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
      ctx.stroke();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(i * anglePerSegment + anglePerSegment / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      ctx.fillText(segments[i], radius - 15, 4);
      ctx.restore();
    }

    // Outer Gold Rim Border Ring
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#d4af37";
    ctx.stroke();

    // Center Gold Peg
    ctx.beginPath();
    ctx.arc(center, center, 15, 0, 2 * Math.PI);
    ctx.fillStyle = "#d4af37";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
  }

  if (spinBtn) {
    spinBtn.addEventListener("click", () => {
      if (isSpinning) return;
      
      const lastSpinDate = localStorage.getItem("sadhanaLastSpinDate");
      const todayStr = getTodayDateString();
      
      if (lastSpinDate === todayStr) {
        const override = confirm("तुम्ही आजचे मार्गदर्शन मिळवले आहे! (You already spun today!)\n\nDo you want to spin again for testing? (चाचणी मोडमध्ये पुन्हा फिरवा?)");
        if (!override) return;
      }

      isSpinning = true;
      wheelResultBox.style.display = "none";
      
      const spinsCount = 8 + Math.floor(Math.random() * 5);
      const randomDeg = Math.floor(Math.random() * 360);
      wheelAngle = spinsCount * 360 + randomDeg;
      
      wheelCanvas.style.transform = `rotate(-${wheelAngle}deg)`;
    });

    wheelCanvas.addEventListener("transitionend", () => {
      isSpinning = false;
      localStorage.setItem("sadhanaLastSpinDate", getTodayDateString());
      recordSadhanaActivity(); // Mark daily sadhana completed

      const normalizedAngle = (wheelAngle % 360);
      const segmentArc = 360 / segments.length;
      
      // Compute winning index (Pointer at top / 270 deg)
      const winningIndex = Math.floor(((normalizedAngle + 90) % 360) / segmentArc);
      const winningAuthor = segments[winningIndex];

      let matchedDohas = dohas;
      if (winningAuthor !== "Daily Advice") {
        matchedDohas = dohas.filter(d => d.author === winningAuthor);
        if (matchedDohas.length === 0) matchedDohas = dohas;
      }
      
      const selectedDoha = matchedDohas[Math.floor(Math.random() * matchedDohas.length)];
      selectedWheelDoha = selectedDoha;

      const spiritualAdvices = [
        "आजच्या दिवशी संयम आणि शांती बाळगा, यश नक्कीच तुमचे असेल.",
        "तुमच्या कर्मावर विश्वास ठेवा, ईश्वराचे शुभाशीर्वाद तुमच्या पाठीशी आहेत.",
        "कोणाशीही कठोर बोलू नका, गोड बोलण्याने शत्रूही मित्र बनतात.",
        "आजचा दिवस ध्यान आणि चिंतनासाठी अत्यंत शुभ आहे.",
        "संकट आले तरी मार्ग सापडेल, फक्त तुमचे सत्य सोडू नका.",
        "परमेश्वरावर श्रद्धा ठेवा, सर्व चिंता दूर होतील."
      ];
      const randomAdvice = spiritualAdvices[Math.floor(Math.random() * spiritualAdvices.length)];

      resultAuthor.textContent = selectedDoha.author;
      resultQuote.textContent = selectedDoha.original;
      resultAdvice.textContent = `🌻 आजचा आशीर्वाद: ${randomAdvice}`;
      
      wheelResultBox.style.display = "block";
      wheelResultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  if (useInStudioBtn) {
    useInStudioBtn.addEventListener("click", () => {
      if (selectedWheelDoha) {
        currentDoha = selectedWheelDoha;
        customDohaText = "";
        customTranslationText = "";
        
        document.getElementById("customDohaInput").value = "";
        document.getElementById("customTransInput").value = "";
        
        updateFeaturedDohaDisplay();
        drawPoster();
        
        document.getElementById("posterCreatorSection").scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // --- 3. Daily Reflection Journal ---
  const journalTextInput = document.getElementById("journalTextInput");
  const saveJournalBtn = document.getElementById("saveJournalBtn");
  const journalSavedList = document.getElementById("journalSavedList");
  const journalDohaRef = document.getElementById("journalDohaRef");
  const journalDateLabel = document.getElementById("journalDateLabel");

  function initJournal() {
    if (!journalDateLabel || !journalDohaRef) return;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    journalDateLabel.textContent = today.toLocaleDateString('mr-IN', options);

    journalDohaRef.textContent = `"${currentDoha.original}" - ${currentDoha.author}`;

    renderSavedJournalEntries();
  }

  function renderSavedJournalEntries() {
    if (!journalSavedList) return;
    
    const savedEntries = JSON.parse(localStorage.getItem("sadhanaJournalEntries")) || [];
    journalSavedList.innerHTML = "";

    if (savedEntries.length === 0) {
      journalSavedList.innerHTML = `<div style="text-align:center; font-size:0.8rem; color:var(--text-muted); margin-top: 10px;">अजून कोणतीही नोंद केलेली नाही. (No entries recorded yet.)</div>`;
      return;
    }

    savedEntries.forEach(entry => {
      const card = document.createElement("div");
      card.className = "journal-entry-card";

      const dateEl = document.createElement("div");
      dateEl.className = "entry-date";
      dateEl.textContent = entry.date;

      const refEl = document.createElement("div");
      refEl.className = "journal-doha-ref";
      refEl.style.fontSize = "0.75rem";
      refEl.textContent = entry.dohaRef;

      const textEl = document.createElement("div");
      textEl.className = "entry-text";
      textEl.textContent = entry.text;

      card.appendChild(dateEl);
      card.appendChild(refEl);
      card.appendChild(textEl);
      journalSavedList.appendChild(card);
    });
  }

  if (saveJournalBtn) {
    saveJournalBtn.addEventListener("click", () => {
      const text = journalTextInput.value.trim();
      if (!text) {
        alert("कृपया तुमचे विचार लिहा! (Please write something before saving!)");
        return;
      }

      const savedEntries = JSON.parse(localStorage.getItem("sadhanaJournalEntries")) || [];
      const entry = {
        date: new Date().toLocaleDateString('mr-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        dohaRef: `"${currentDoha.original}" - ${currentDoha.author}`,
        text: text
      };

      savedEntries.unshift(entry);
      localStorage.setItem("sadhanaJournalEntries", JSON.stringify(savedEntries));
      
      journalTextInput.value = "";
      renderSavedJournalEntries();
      recordSadhanaActivity(); // Mark daily sadhana completed

      alert("तुमचे विचार डायरीत सेव्ह झाले आहेत! (Your entry has been saved!)");
    });
  }


  // --- 4. Meditation & Chanting Sadhana ---
  let breathInterval = null;
  let breathState = 0; // 0: inhale, 1: hold, 2: exhale
  const breathCircle = document.getElementById("breathCircle");
  const breathLabel = document.getElementById("breathLabel");
  const toggleBreathBtn = document.getElementById("toggleBreathBtn");

  function runBreathingCycle() {
    if (!breathInterval) return;
    if (breathState === 0) {
      breathCircle.style.transform = "scale(2)";
      breathCircle.style.background = "radial-gradient(circle, #00b894 0%, var(--brand-primary) 100%)";
      breathLabel.textContent = "श्वास घ्या (Inhale)";
      breathState = 1;
      setTimeout(() => { if (breathInterval) runBreathingCycle(); }, 4000);
    } else if (breathState === 1) {
      breathLabel.textContent = "रोखून ठेवा (Hold)";
      breathState = 2;
      setTimeout(() => { if (breathInterval) runBreathingCycle(); }, 4000);
    } else {
      breathCircle.style.transform = "scale(1)";
      breathCircle.style.background = "radial-gradient(circle, var(--brand-saffron) 0%, var(--brand-primary) 100%)";
      breathLabel.textContent = "श्वास सोडा (Exhale)";
      breathState = 0;
      setTimeout(() => { if (breathInterval) runBreathingCycle(); }, 4000);
    }
  }

  if (toggleBreathBtn) {
    toggleBreathBtn.addEventListener("click", () => {
      if (breathInterval) {
        breathInterval = null;
        breathCircle.style.transform = "scale(1)";
        breathCircle.style.background = "radial-gradient(circle, var(--brand-saffron) 0%, var(--brand-primary) 100%)";
        breathLabel.textContent = "Breathe";
        toggleBreathBtn.textContent = "➔ Start Guide";
        toggleBreathBtn.style.background = "";
      } else {
        breathInterval = true;
        breathState = 0;
        runBreathingCycle();
        toggleBreathBtn.textContent = "⏸ Pause Guide";
        toggleBreathBtn.style.background = "var(--brand-saffron)";
        recordSadhanaActivity();
      }
    });
  }

  // --- Mantra Jap Counter ---
  const japCountLabel = document.getElementById("japCountLabel");
  const incrementJapBtn = document.getElementById("incrementJapBtn");
  const autoJapBtn = document.getElementById("autoJapBtn");
  const resetJapBtn = document.getElementById("resetJapBtn");
  const mantraSelect = document.getElementById("mantraSelect");
  
  const chimeAudio = new Audio("assets/audio/jap_chime.mp3");
  chimeAudio.volume = 0.55;
  const omAudio = new Audio("assets/audio/om_chant.mp3");
  omAudio.volume = 0.85;

  let japCount = parseInt(localStorage.getItem("sadhanaJapCount")) || 0;
  if (japCountLabel) {
    japCountLabel.textContent = `${japCount} / 108`;
  }

  let isAutoChanting = false;

  function triggerJapCompletion() {
    alert("🌸 अभिनंदन! तुमची १०८ जपांची माळ पूर्ण झाली आहे. (Congratulations! Your 108 mantra chanting is complete.)\n\nतुम्हाला १० पॉईंट्स मिळाले आहेत! (You earned 10 points!)");
    quizScore += 10;
    localStorage.setItem("quizScore", quizScore);
    const quizScoreEl = document.getElementById("quizScore");
    if (quizScoreEl) quizScoreEl.textContent = quizScore;

    japCount = 0;
    localStorage.setItem("sadhanaJapCount", japCount);
    japCountLabel.textContent = `0 / 108`;
  }

  function stopAutoChanting() {
    isAutoChanting = false;
    if (autoJapBtn) {
      autoJapBtn.textContent = "▶ Auto Chant";
      autoJapBtn.style.background = "";
      autoJapBtn.style.color = "";
    }
  }

  function playNextAutoJap() {
    if (!isAutoChanting) return;
    
    if (japCount >= 108) {
      triggerJapCompletion();
      stopAutoChanting();
      return;
    }

    const activeMantra = mantraSelect ? mantraSelect.value : "chime";
    const currentAudio = (activeMantra === "om") ? omAudio : chimeAudio;
    
    currentAudio.currentTime = 0;
    currentAudio.play()
      .then(() => {
        japCount += 1;
        localStorage.setItem("sadhanaJapCount", japCount);
        japCountLabel.textContent = `${japCount} / 108`;
        recordSadhanaActivity();

        if (japCount === 108) {
          triggerJapCompletion();
          stopAutoChanting();
        }
      })
      .catch(err => {
        console.log("Audio play deferred or interrupted:", err);
        stopAutoChanting();
      });
  }

  // Chain ended event listeners for auto-loop
  chimeAudio.addEventListener("ended", () => {
    if (isAutoChanting) setTimeout(playNextAutoJap, 600);
  });

  omAudio.addEventListener("ended", () => {
    if (isAutoChanting) setTimeout(playNextAutoJap, 600);
  });

  if (incrementJapBtn) {
    incrementJapBtn.addEventListener("click", () => {
      // Pause auto if playing
      if (isAutoChanting) stopAutoChanting();

      const activeMantra = mantraSelect ? mantraSelect.value : "chime";
      const currentAudio = (activeMantra === "om") ? omAudio : chimeAudio;

      currentAudio.currentTime = 0;
      currentAudio.play().catch(err => console.log("Play deferred"));

      japCount += 1;
      localStorage.setItem("sadhanaJapCount", japCount);
      japCountLabel.textContent = `${japCount} / 108`;

      recordSadhanaActivity();

      if (japCount === 108) {
        triggerJapCompletion();
      }
    });
  }

  if (autoJapBtn) {
    autoJapBtn.addEventListener("click", () => {
      if (isAutoChanting) {
        stopAutoChanting();
      } else {
        isAutoChanting = true;
        autoJapBtn.textContent = "⏸ Pause Auto";
        autoJapBtn.style.background = "var(--brand-saffron)";
        autoJapBtn.style.color = "#ffffff";
        playNextAutoJap();
      }
    });
  }

  if (resetJapBtn) {
    resetJapBtn.addEventListener("click", () => {
      if (isAutoChanting) stopAutoChanting();
      if (confirm("जप काउंटर रिसेट करायचा आहे का? (Are you sure you want to reset the counter?)")) {
        japCount = 0;
        localStorage.setItem("sadhanaJapCount", japCount);
        japCountLabel.textContent = `0 / 108`;
      }
    });
  }

  // --- Sadhana Modal Open/Close Event Listeners ---
  const openSadhanaBtn = document.getElementById("openSadhanaNavBtn");
  const sadhanaModal = document.getElementById("sadhanaModal");
  const closeSadhanaBtn = document.getElementById("closeSadhanaModal");

  if (openSadhanaBtn && sadhanaModal && closeSadhanaBtn) {
    openSadhanaBtn.addEventListener("click", (e) => {
      e.preventDefault();
      sadhanaModal.style.display = "flex";
    });

    closeSadhanaBtn.addEventListener("click", () => {
      sadhanaModal.style.display = "none";
    });

    sadhanaModal.addEventListener("click", (e) => {
      if (e.target === sadhanaModal) {
        sadhanaModal.style.display = "none";
      }
    });
  }

  // --- Footer Subscription logic ---
  const subscribeBtn = document.getElementById("subscribeBtn");
  const subNameInput = document.getElementById("subNameInput");
  const subFeedback = document.getElementById("subFeedback");

  if (subscribeBtn && subNameInput && subFeedback) {
    subscribeBtn.addEventListener("click", () => {
      const name = subNameInput.value.trim();
      if (!name) {
        subFeedback.textContent = "कृपया तुमचे नाव लिहा! (Please write your name!)";
        subFeedback.style.color = "#ff4444";
        subFeedback.style.display = "block";
        return;
      }
      
      subFeedback.textContent = `🌸 धन्यवाद ${name} जी! दैनिक आशिर्वाद यशस्वीरीत्या सक्रिय केले. (Thank you! Daily Blessing activated.)`;
      subFeedback.style.color = "var(--brand-gold)";
      subFeedback.style.display = "block";
      subNameInput.value = "";
      
      // Award +5 points to the user for subscribing!
      quizScore += 5;
      localStorage.setItem("quizScore", quizScore);
      const quizScoreEl = document.getElementById("quizScore");
      if (quizScoreEl) quizScoreEl.textContent = quizScore;
    });
  }

  // --- Mobile Hamburger Menu Toggle ---
  const hamburgerMenuBtn = document.getElementById("hamburgerMenuBtn");
  const navLinksList = document.querySelector(".nav-links");

  if (hamburgerMenuBtn && navLinksList) {
    hamburgerMenuBtn.addEventListener("click", () => {
      hamburgerMenuBtn.classList.toggle("active");
      navLinksList.classList.toggle("active");
    });

    // Close menu when clicking on any link inside nav-links
    const links = navLinksList.querySelectorAll("a, button");
    links.forEach(link => {
      link.addEventListener("click", () => {
        if (link.id !== "themeToggleBtn" && link.id !== "openSadhanaNavBtn") {
          hamburgerMenuBtn.classList.remove("active");
          navLinksList.classList.remove("active");
        }
      });
    });
  }

  // --- Initialize App ---
  updateFeaturedDohaDisplay();
  renderLibrary();
  loadQuizChallenge(); // Load first quiz challenge
  
  // Sadhana Hub Initialization
  drawWheel();
  renderStreakCalendar();
  initJournal();

  // Wait for fonts, then draw first canvas frame
  setTimeout(drawPoster, 600);
});
