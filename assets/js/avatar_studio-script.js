const chatIcon = document.getElementById("chat-icon");
const chatBoxEl = document.getElementById("chatBox");
var chatWidget = chatBoxEl.querySelector("#chat-widget");
var chatBoxHeading = chatBoxEl.querySelector("#chatBox-heading");

var chatClose = chatBoxEl.querySelector("#chatBox-close");
const startSessionBtn = chatBoxEl.querySelector("#startSession");

const transcriptToggleButtons = chatBoxEl.querySelectorAll(
  ".transcriptToggleButton"
);
const avatarContainer = chatBoxEl.querySelector(".avatarContainer");
const transcriptContainer = chatBoxEl.querySelector("#transcriptContainer");
const voiceTranscript = chatBoxEl.querySelector("#voiceTranscript");

const exportTranscriptToPDFButton = chatBoxEl.querySelector(
  "#exportTranscriptToPDF"
);
const sendTranscriptToEmailButton = chatBoxEl.querySelector(
  "#sendTranscriptToEmail"
);
const countdownElement = chatBoxEl.querySelector("#streamingCountdown");

const disclaimerContainer = chatBoxEl.querySelector("#disclaimer");
const disclaimerAgreeButton = chatBoxEl.querySelector("#disclaimerAgree");
const closeDisclaimerButton = chatBoxEl.querySelector("#closeDisclaimer");

const instructionContainer = chatBoxEl.querySelector("#instruction");
const instructionAgreeButton = chatBoxEl.querySelector("#instructionAgree");
const closeInstructionButton = chatBoxEl.querySelector("#closeInstruction");

const userformContainer = chatBoxEl.querySelector("#userform");
const userformSkipButton = chatBoxEl.querySelector("#skipBtn");
const userformNextButton = chatBoxEl.querySelector("#nextBtn");

const fullName = document.querySelector("#fullName");
const mobile = document.querySelector("#mobile");
const email = document.querySelector("#email");

const nameError = document.querySelector("#nameError");
const mobileError = document.querySelector("#mobileError");
const emailError = document.querySelector("#emailError");

const userDetailsForm = document.querySelector("#userDetailsForm");

const overlayQuestionContainer = chatBoxEl.querySelector("#overlayQuestion");
const overlayQuestionSubmitButton = chatBoxEl.querySelector(
  "#overlayQuestionSubmit"
);
const closeOverlayQuestionButton = chatBoxEl.querySelector(
  "#closeOverlayQuestion"
);

let instruction_video_watched = false;

chatBoxEl.querySelectorAll("button.disclaimer").forEach(function (el, i) {
  el.addEventListener("click", function () {
    if (disclaimerContainer) {
      disclaimerContainer.classList.add("show");
    }
    const screenWidth = window.innerWidth;
    if (screenWidth <= 767) {
      makeFullWidth();
    }
  });
});
chatBoxEl.querySelectorAll("button.instruction").forEach(function (el, i) {
  el.addEventListener("click", function () {
    instruction_video_watched = false;
    let skip_instruction_video = PLUGIN_OPTIONS?.skip_instruction_video === "1";
    if (instructionContainer) {
      instructionContainer.classList.add("show");
      playInstructionVideo();
      if (!skip_instruction_video) {
        instructionAgreeButton.disabled = true;
      }
    }
  });
});

chatBoxEl.querySelectorAll(".chatBox-fullscreen").forEach(function (el, i) {
  el.addEventListener("click", function () {
    if (chatBoxEl.classList.contains("fullwidth")) {
      chatBoxEl.classList.remove("fullwidth");
    } else {
      chatBoxEl.classList.add("fullwidth");
    }
    setVideoHolderHeight();
  });
});
if (chatIcon) {
  chatIcon.addEventListener("click", function () {
    if (chatBoxEl.classList.contains("show")) {
      chatBoxEl.classList.remove("show");
      chatIcon.classList.remove("hide");
    } else {
      chatBoxEl.classList.add("show");
      chatIcon.classList.add("hide");
    }
    setVideoHolderHeight();
  });
}

if (chatClose) {
  chatClose.addEventListener("click", function () {
    if (chatBoxEl.classList.contains("show")) {
      chatBoxEl.classList.remove("show");
      chatIcon.classList.remove("hide");
    } else {
      chatBoxEl.classList.add("show");
      chatIcon.classList.add("hide");
    }
    setVideoHolderHeight();
  });
}

window.PLUGIN_OPTIONS = PLUGIN_OPTIONS;
function checkDesktopVisitor(minWidth = 1024) {
  const screenWidth = window.innerWidth;
  const platform = navigator.platform.toLowerCase();
  const isDesktop =
    (screenWidth > minWidth &&
      !platform.includes("win") &&
      !platform.includes("mac") &&
      !platform.includes("linux")) ||
    (screenWidth > minWidth &&
      !/mobile|tablet/.test(navigator.userAgent.toLowerCase()));
  return isDesktop;
}
document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "style"
      ) {
        const display = window.getComputedStyle(transcriptContainer).display;
        if (display === "block" || display === "flex") {
          setTimeout(function () {
            setTranscriptHeight();
          }, 301);
          setTimeout(function () {
            setTranscriptHeight();
          }, 500);
        }
      }
    });
  });
  toggleTranscript = (event) => {
    if (event) {
      event.preventDefault();
    }

    observer.disconnect(); // prevent infinite loop

    const isVisible =
      window.getComputedStyle(transcriptContainer).display === "block";
    transcriptContainer.style.display = isVisible ? "none" : "block";
    chatBoxEl.classList.toggle("showTranscript", !isVisible);
    if (transcriptToggleButtons.length) {
      transcriptToggleButtons.forEach(function (el, i) {
        el.setAttribute(
          "aria-label",
          isVisible ? "View Transcript button" : "Hide Transcript button"
        );
      });
    }
    if (voiceTranscript) {
      setTimeout(function () {
        setTranscriptHeight();
      }, 301);
      setTimeout(function () {
        setTranscriptHeight();
      }, 500);
    }

    observer.observe(transcriptContainer, {
      attributes: true,
      attributeFilter: ["style"],
    });
  };

  // Start observing (can do nothing or handle external style changes)
  observer.observe(transcriptContainer, {
    attributes: true,
    attributeFilter: ["style"],
  });

  // Toggle on button click

  if (transcriptToggleButtons.length) {
    transcriptToggleButtons.forEach(function (el, i) {
      el.addEventListener("click", toggleTranscript);
    });
  }

  /**
   * Check when message added
   */

  const voiceTranscriptobserver = new MutationObserver(
    (mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              exportTranscriptToPDFButton.style.display = "block";
              sendTranscriptToEmailButton.style.display = "block";

              voiceTranscript.scrollTo({
                top: voiceTranscript.scrollHeight,
                behavior: "smooth",
              });

              console.log("New element added:", node);
            }

            if (
              node.nodeType === Node.ELEMENT_NODE &&
              node.classList.contains("transcript")
            ) {
              console.log("New transcript line added:", node);
            }
          });
        }
      }
    }
  );
  // Start observing
  voiceTranscriptobserver.observe(voiceTranscript, {
    childList: true,
    subtree: true,
  });

  const userVideoContainer = chatBoxEl.querySelector(".userVideoContainer");
  const userVideo = chatBoxEl.querySelector("#userVideo");

  if (startSessionBtn) {
    startSessionBtn.addEventListener("click", function () {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 767) {
        makeFullWidth();
      }
      if (userVideoContainer && userVideo) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            // ✅ Camera found, attach stream to video
            userVideo.srcObject = stream;
            userVideoContainer.style.display = "flex";
          })
          .catch((err) => {
            console.warn("No camera or permission denied:", err);
            // ❌ Hide container if no camera or blocked
            // userVideoContainer.style.display = "none";
          });
      } else if (userVideoContainer) {
        // userVideoContainer.style.display = "none";
      }
    });
  }
  setTimeout(function () {
    chatBoxEl
      .querySelectorAll("video.wp-video-shortcode")
      .forEach(function (video) {
        if (!video.paused && typeof video.pause === "function") {
          video.pause();
        }
      });
    pauseAllVimeoVideos();
  }, 100);

  if (disclaimerAgreeButton) {
    disclaimerAgreeButton.addEventListener("click", function () {
      instruction_video_watched = false;
      let instruction_enable = PLUGIN_OPTIONS?.instruction_enable === "1";
      let user_form_enable = PLUGIN_OPTIONS?.user_form_enable === "1";
      let skip_instruction_video =
        PLUGIN_OPTIONS?.skip_instruction_video === "1";
      if (startSessionBtn && !instruction_enable && !user_form_enable) {
        startSessionBtn.click();
      } else if (userformContainer && user_form_enable) {
        userformContainer.classList.add("show");
      } else if (instructionContainer && instruction_enable) {
        instructionContainer.classList.add("show");
        playInstructionVideo();
        if (!skip_instruction_video) {
          instructionAgreeButton.disabled = true;
        }
      }
      disclaimerContainer.classList.remove("show");
    });
  }

  // Validation functions
  const validateName = () => {
    if (!fullName.value.trim()) {
      nameError.classList.remove("hide");
      return false;
    }
    nameError.classList.add("hide");
    return true;
  };

  const validateMobile = () => {
    const mobileValue = mobile.value.trim();
    if (!/^\d{10}$/.test(mobileValue)) {
      mobileError.classList.remove("hide");
      return false;
    }
    mobileError.classList.add("hide");
    return true;
  };

  const validateEmail = () => {
    const emailValue = email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
      emailError.classList.remove("hide");
      return false;
    }
    emailError.classList.add("hide");
    return true;
  };

  //Real-time validation
  if (userDetailsForm) {
    userDetailsForm.addEventListener("input", (e) => {
      const { id } = e.target;
      if (id === "fullName") validateName();
      else if (id === "mobile") validateMobile();
      else if (id === "email") validateEmail();
    });
  }

  if (userformNextButton) {
    userformNextButton.addEventListener("click", function () {
      const isNameValid = validateName();
      const isMobileValid = validateMobile();
      const isEmailValid = validateEmail();

      let skip_instruction_video =
        PLUGIN_OPTIONS?.skip_instruction_video === "1";

      if (isNameValid && isMobileValid && isEmailValid) {
        const countryCode = document.querySelector("#countryCode").value;

        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            countryCode,
            email: email.value,
            mobile: mobile.value,
            fullName: fullName.value,
          })
        );

        let instruction_enable = PLUGIN_OPTIONS?.instruction_enable === "1";
        userformContainer.classList.remove("show");
        if (instructionContainer && instruction_enable) {
          instructionContainer.classList.add("show");
          playInstructionVideo();
          if (!skip_instruction_video) {
            instructionAgreeButton.disabled = true;
          }
        } else {
          startSessionBtn.click();
        }
      }
    });
  }

  if (userformSkipButton) {
    userformSkipButton.addEventListener("click", function () {
      let instruction_enable = PLUGIN_OPTIONS?.instruction_enable === "1";
      userformContainer.classList.remove("show");
      if (instructionContainer && instruction_enable) {
        instructionContainer.classList.add("show");
        playInstructionVideo();
        if (!skip_instruction_video) {
          instructionAgreeButton.disabled = true;
        }
      } else {
        startSessionBtn.click();
      }
    });
  }

  if (instructionAgreeButton) {
    instructionAgreeButton.addEventListener("click", function () {
      let skip_instruction_video =
        PLUGIN_OPTIONS?.skip_instruction_video === "1";

      if (skip_instruction_video || instruction_video_watched) {
        if (startSessionBtn) {
          startSessionBtn.click();
        }
        instructionContainer.classList.remove("show");

        chatBoxEl
          .querySelectorAll("video.wp-video-shortcode")
          .forEach(function (video) {
            if (!video.paused && typeof video.pause === "function") {
              video.pause();
            }
          });
        pauseAllVimeoVideos();
      } else {
        playInstructionVideo();
      }
    });
  }

  if (closeDisclaimerButton) {
    closeDisclaimerButton.addEventListener("click", () => {
      disclaimerContainer.classList.remove("show");
    });
  }

  if (closeInstructionButton) {
    closeInstructionButton.addEventListener("click", () => {
      chatBoxEl
        .querySelectorAll("video.wp-video-shortcode")
        .forEach(function (video) {
          if (!video.paused && typeof video.pause === "function") {
            video.pause();
          }
        });
      pauseAllVimeoVideos();
      instructionContainer.classList.remove("show");
    });
  }
});
function setTranscriptHeight() {
  let transcriptHeading = chatBoxEl.querySelector(
    ".transcriptContainer .transcript-heading"
  );
  let actionContainer = chatBoxEl.querySelector(
    ".transcriptContainer .actionContainer"
  );

  let h = avatarContainer.getBoundingClientRect().height;

  if (window.innerWidth <= 935) {
    h = transcriptContainer.getBoundingClientRect().height;
  }
  if (transcriptHeading) {
    h -= transcriptHeading.getBoundingClientRect().height;
  }
  if (actionContainer) {
    let acHeight = actionContainer.getBoundingClientRect().height;
    voiceTranscript.style.setProperty(
      "margin-bottom",
      `${acHeight}px`,
      "important"
    );
    h -= acHeight;
  }
  voiceTranscript.style.setProperty("height", `${h || 120}px`, "important");
}
function pauseAllVimeoVideos() {
  const iframes = chatBoxEl.querySelectorAll("iframe");

  iframes.forEach((iframe) => {
    const src = iframe.getAttribute("src") || "";
    if (src.includes("player.vimeo.com") || src.includes("vimeo.com/video")) {
      const player = new Vimeo.Player(iframe);
      player.pause().catch(() => {
        // Ignore errors (e.g. video not yet loaded)
      });
    }
  });
}
function playInstructionVideo() {
  // instruction_video_watched = false;
  let videoExist = false;
  let skip_instruction_video = PLUGIN_OPTIONS?.skip_instruction_video === "1";

  chatBoxEl
    .querySelectorAll("video.wp-video-shortcode")
    .forEach(function (video) {
      videoExist = true;
      if (video.paused && typeof video.play === "function") {
        video.play();
      }

      let watchedTime = 0;
      let lastTime = 0;
      let duration = 0;
      let percentWatched = 0;

      video.addEventListener("loadedmetadata", () => {
        duration = video.duration;
        console.log("Video duration:", duration.toFixed(2), "seconds");
      });

      video.addEventListener("timeupdate", () => {
        const currentTime = video.currentTime;

        if (lastTime !== 0) {
          const delta = currentTime - lastTime;

          // Count only forward playback
          if (delta > 0 && delta < 5) {
            watchedTime += delta;
          }

          percentWatched = (watchedTime / duration) * 100;
        }

        lastTime = currentTime;
      });

      video.addEventListener("ended", () => {
        percentWatched = (watchedTime / duration) * 100;
        instruction_video_watched = true;
        instructionAgreeButton.disabled = false;
        instructionAgreeButton.style.display = "inline-block";
      });
    });
  chatBoxEl.querySelectorAll("iframe").forEach((iframe) => {
    videoExist = true;
    const src = iframe.getAttribute("src") || "";
    if (src.includes("player.vimeo.com") || src.includes("vimeo.com/video")) {
      const player = new Vimeo.Player(iframe);
      player.setVolume(1);
      player.play().catch(() => {
        // Ignore errors (e.g. video not yet loaded)
      });
      player.on("play", function () {
        // player.setVolume(1);
        console.log("Video has started playing");
        /*
        Update data if needed
         */
      });
      let lastTime = 0;
      let watchedTime = 0;
      let videoDuration = 0;

      // Get total duration of the video first
      player.getDuration().then((duration) => {
        videoDuration = duration;
      });

      // Track watched time
      player.on("timeupdate", function (data) {
        const currentTime = data.seconds;

        if (lastTime !== 0) {
          const delta = currentTime - lastTime;

          // Only count forward-watching (not rewinds or skips)
          if (delta > 0 && delta < 5) {
            watchedTime += delta;
          }

          // Optional: Calculate and log percentage watched
          if (videoDuration > 0) {
            const percentWatched = (watchedTime / videoDuration) * 100;
          }
        }
        lastTime = currentTime;
      });
      player.on("ended", function () {
        const percentWatched = (watchedTime / videoDuration) * 100;
        instruction_video_watched = true;
        instructionAgreeButton.disabled = false;
        instructionAgreeButton.style.display = "inline-block";
      });
    }
  });
  if (!skip_instruction_video && videoExist) {
    instructionAgreeButton.disabled = true;
    instructionAgreeButton.style.display = "none";
  }
}
function toggleLanguageDropdown() {
  const dropdown = document.getElementById("languageDropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

function setLanguage(langCode, flagEmoji, languageName) {
  // Set the selected language display
  if (getEmojiFilename(flagEmoji)) {
    const selected = document.getElementById("selectedLanguage");
    selected.innerHTML = `<img draggable="false" class="emoji" alt="${flagEmoji}" src="https://s.w.org/images/core/emoji/16.0.1/svg/${getEmojiFilename(
      flagEmoji
    )}.svg">`;

    // Close dropdown
    const dropdown = document.getElementById("languageDropdown");
    dropdown.style.display = "none";

    localStorage.setItem(
      "selectedLanguage",
      JSON.stringify({ langCode, flagEmoji, languageName })
    );
    const startSessionBtn = document.getElementById("startSession");
    startSessionBtn.setAttribute("language", langCode);
    startSessionBtn.setAttribute(
      "opening_text",
      PLUGIN_OPTIONS.opening_text.hasOwnProperty(langCode)
        ? PLUGIN_OPTIONS.opening_text[langCode]
        : ""
    );
  }
}

function getEmojiFilename(emoji) {
  const emojiMap = {
    us: "1f1fa-1f1f8",
    es: "1f1ea-1f1f8",
    fr: "1f1eb-1f1f7",
  };
  return emojiMap[emoji] || null;
}

// Optional: load saved language on page load
window.onload = function () {
  const saved = localStorage.getItem("selectedLanguage");
  if (saved) {
    const { langCode, flagEmoji, languageName } = JSON.parse(saved);
    if (langCode && flagEmoji && flagEmoji != "undefined" && languageName)
      setLanguage(langCode, flagEmoji, languageName);
  }
};

document.addEventListener("DOMContentLoaded", (event) => {
  const saved = localStorage.getItem("selectedLanguage");
  if (saved) {
    const { langCode, flagEmoji, languageName } = JSON.parse(saved);
    if (langCode && flagEmoji && flagEmoji != "undefined" && languageName)
      setLanguage(langCode, flagEmoji, languageName);
  }

  if (chatBoxHeading) {
    let headingheight = chatBoxHeading.getBoundingClientRect().height;
    countdownElement.style.setProperty("top", `${headingheight + 5}px`);
  }

  setVideoHolderHeight();
});
window.addEventListener("resize", function () {
  if (chatBoxHeading) {
    let headingheight = chatBoxHeading.getBoundingClientRect().height;
    countdownElement.style.setProperty("top", `${headingheight + 5}px`);
  }
  setVideoHolderHeight();
});

function makeFullWidth() {
  if (!chatBoxEl.classList.contains("fullwidth")) {
    chatBoxEl.classList.add("fullwidth");
  }
  setVideoHolderHeight();
}
function setVideoHolderHeight() {
  const videoHolder = chatBoxEl.querySelector("#video_holder");

  let h = chatBoxEl.getBoundingClientRect().height;

  const isFullwidth = chatBoxEl.classList.contains("fullwidth");
  const isShow = chatBoxEl.classList.contains("show");
  const screenWidth = window.innerWidth;
  if (isFullwidth || (isShow && screenWidth <= 935)) {
    if (chatBoxHeading) {
      const style = window.getComputedStyle(chatBoxHeading);
      let headingheight = chatBoxHeading.getBoundingClientRect().height;
      countdownElement.style.setProperty("top", `${headingheight + 10}px`);
      if (style.position === "absolute") {
        console.log("Element is positioned absolutely.");
      } else {
        h -= headingheight;
      }
    }
    videoHolder.style.setProperty("height", `${h || 360}px`, "important");
  } else {
    videoHolder.style.removeProperty("height");
  }
}

async function getMicrophoneList() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    const devices = await navigator.mediaDevices.enumerateDevices();

    // Filter out the microphone devices
    const microphones = devices.filter(
      (device) => device.kind === "audioinput"
    );

    // Log microphone info
    microphones.forEach((mic, index) => {
      console.log(
        `Microphone ${index + 1}:`,
        mic.label || "Label not available",
        mic.deviceId
      );
    });

    return microphones;
  } catch (err) {
    console.error("Error accessing microphones:", err);
    return [];
  }
}
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
function formatTime(isoString) {
  const date = new Date(isoString);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

if (exportTranscriptToPDFButton) {
  exportTranscriptToPDFButton.addEventListener("click", downloadTranscriptPDF);
}
if (sendTranscriptToEmailButton) {
  sendTranscriptToEmailButton.onclick = async () => {
    const email =
      prompt("Please enter your email address to receive the transcript:") ||
      "";
    if (email) {
      try {
        const result = await sendPDFEmail(email);
        alert(result);
      } catch (error) {
        alert("Failed to send email. Please try again.");
      }
    } else {
      alert("Email address is required to send the transcript.");
    }
  };
}

async function sendPDFEmail(email = "") {
  if (!isValidEmail(email)) {
    console.error("Invalid email address");
    return Promise.reject("Invalid email address");
  }

  const transcriptElements = voiceTranscript.querySelectorAll(".transcript");

  const transcripts = Array.from(transcriptElements).map((div, index) => ({
    id: index + 1,
    role: div.classList.contains("avatar") ? "Avatar" : "User",
    speech: div.textContent?.trim() || "",
    timestamp: div.getAttribute("data-timestamp") || new Date().toISOString(),
  }));

  return fetch(ajaxurl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      action: "send_pdf_email",
      transcript_data: JSON.stringify(transcripts),
      to_email: email,
    }),
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.success) {
        return res.data.message || "Email sent successfully";
      } else {
        return res.data.message || "Failed to send email";
      }
    })
    .catch((error) => {
      console.error("There was an error!", error);
      return "Failed to send email";
    });
}

function downloadTranscriptPDF() {
  const transcriptElements = voiceTranscript.querySelectorAll(".transcript");

  const transcripts = Array.from(transcriptElements).map((div, index) => ({
    id: index + 1,
    role:
      div.classList.contains("avatar") || div.classList.contains("replica")
        ? "Avatar"
        : "User",
    speech: div.textContent?.trim() || "",
    timestamp: div.getAttribute("data-timestamp") || new Date().toISOString(),
  }));

  if (!Array.isArray(transcripts) || !transcripts.length) return;

  (async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const maxTextWidth = pageWidth - margin * 2;

    doc.setFont("helvetica");

    transcripts.forEach(({ role, speech }) => {
      const isUser = role === "user" || role === "User";
      const xLeft = margin;
      const xRight = pageWidth - margin;

      // Speaker label
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text(isUser ? "User :" : "Avatar :", isUser ? xRight : xLeft, y, {
        align: isUser ? "right" : "left",
      });
      y += 6;

      // Message bubble text
      doc.setFont(undefined, "normal");
      doc.setFontSize(12);
      doc.setTextColor(0);

      const lines = doc.splitTextToSize(speech, maxTextWidth * 0.7);
      const align = isUser ? "right" : "left";
      const xPos = isUser ? xRight : xLeft;

      // Page break if needed
      const neededHeight = lines.length * 6;
      if (y + neededHeight > doc.internal.pageSize.getHeight() - 10) {
        doc.addPage();
        y = 20;
      }

      doc.text(lines, xPos, y, { align });
      y += neededHeight + 8;
    });

    doc.save("transcript.pdf");
  })();
}
// document.getElementById('overlayQuestion').addEventListener('click', function (e) {
//   if (e.target === this) {
//     this.style.display = 'none';
//   }
// });
