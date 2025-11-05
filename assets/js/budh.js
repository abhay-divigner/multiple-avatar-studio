// DEVELOPMENT MODE KEYS
// const TAVUS_API_KEY = "50292eae2a07421ca19e9b0bbc097eca";
// const TAVUS_REPLICA_ID = "rc2146c13e81";
// const TAVUS_PERSONA_ID = "p8e76077c890";

// JavaScript PRODUCTION MODE KEYS
const TAVUS_API_KEY = "";
const TAVUS_REPLICA_ID = "";
const TAVUS_PERSONA_ID = "";

const USER_SPEAKING_EVENTS = {
  STOP: "conversation.user.stopped_speaking",
  START: "conversation.user.started_speaking",
};

const PROJECT_MODES = {
  PRODUCTION: "production",
  DEVELOPMENT: "development",
};

const CALL_MODES = {
  AUDIO: "audio",
  VIDEO: "video",
};

const PROJECT_MODE = PROJECT_MODES.PRODUCTION;

const videoElement = document.getElementById("avatarVideo");
const userVideoElement = document.getElementById("userVideo");
const avatarContainer = document.querySelector(".avatarContainer");
const startBtn = document.getElementById("startSession");
const endBtn = document.getElementById("endSession");
const micToggle = document.getElementById("micToggler");
const cameraToggle = document.getElementById("cameraToggler");
const toggleBtn = document.getElementById("switchInteractionMode");
const inputContainer = document.getElementById("input-container");
const inputField = document.getElementById("userInput");
const sendMessageBtn = document.getElementById("send-btn");
const countDown = document.getElementById("streamingCountdown");
const timer = startBtn.getAttribute("timer");
const languageSwitcherContainer =
  document.getElementsByClassName("language-switcher")[0];
const chatBox = document.getElementById("chatBox");
const speakingAnimation = document.querySelector("#listeningIcon");
const closeBtn = document.getElementById("chatBox-close");
const transcriptChatBox = document.getElementById("action-container");

const transcriptToggleButton = document.getElementById(
  "transcriptToggleButton"
);

// Transcript
const iconView = document.querySelector("#icon-view");
const iconHide = document.querySelector("#icon-hide");
const transcriptContainer = document.querySelector("#transcriptContainer");
const transcriptMessageBox = document.querySelector("#voiceTranscript");
const exportTranscriptToPDFBtn = document.querySelector(
  "#exportTranscriptToPDF"
);

// Call Mode
const prodCallMode = startBtn.getAttribute("call_mode");
const callModeSelect = document.querySelector("#callMode");
const videoStaticContainer = document.querySelector("#video-preview-container");
const audioStaticContainer = document.querySelector("#audio-preview-container");
const audioVisualizerContainer = document.querySelector(
  "#audioVisualizerContainer"
);

// Privacy Modal
const privacyModal = document.getElementById("privacyModal");
const disclaimerBox = document.getElementById("disclaimer-content");
// const agreeBtn = document.getElementById("agreePrivacy");
// const rejectBtn = document.getElementById("rejectPrivacy");

// User Form
const fullName = document.getElementById("fullName");
const mobile = document.getElementById("mobile");
const email = document.getElementById("email");

const nameError = document.getElementById("nameError");
const mobileError = document.getElementById("mobileError");
const emailError = document.getElementById("emailError");

const userForm = document.getElementById("userForm");
const skipBtn = document.getElementById("skipBtn");
const nextBtn = document.getElementById("nextBtn");

// Video Container elements
const videoContainer = document.getElementById("video-container");
const videoSource = document.getElementById("videoSource");
const video = document.getElementById("protectedVideo");
const blocker = document.getElementById("interactionBlocker");
const statusEl = document.getElementById("videoStatus");

// Start Button Container
const startBtnContainer = document.getElementById("start-btn-container");
const startCallBtn = document.getElementById("start-call");

// Transcript Modal
const callEndContainer = document.getElementById("transcript-modal");
const cancelTranscript = document.getElementById("cancelTranscript");
const downloadTranscript = document.getElementById("downloadTranscript");

// Audio Call Elements
const callEffect = document.getElementById("call-effect");

// Direct values
const animationImage = document.getElementById("animation-image");
const tavus_audio_image = startBtn.getAttribute("tavus_audio_image");
const tavus_audio_animation = startBtn.getAttribute("tavus_audio_animation");
const horizontalBoxes = document.getElementById("horizontal-boxes");

let ajaxURL = document.getElementById("ajaxURL");
const ajaxurl = ajaxURL ? ajaxURL?.value : "";

let audioTrack = null;
let videoTrack = null;
let userVideoTrack = null;
let userAgreedToPrivacy = false;

const handleCloseTranscript = (manager) => {
  iconView.classList.remove("hide");
  iconHide.classList.add("hide");
  manager.showChatBox = false;
  manager.showTranscript = false;
  transcriptContainer.classList.add("hide");
  inputContainer.classList.add("hide");
  iconView.style.display = "block";
  horizontalBoxes.classList.remove("transcript-open");
};

const sendTextMessage = async (manager, text) => {
  try {
    await manager.daily.sendAppMessage(
      {
        message_type: "conversation",
        event_type: "conversation.respond",
        conversation_id: manager.conversationId,
        properties: { text: text },
      },
      "*"
    );
  } catch (error) {
    console.error("Error while sending text to the avatar", {
      cause: error,
    });
  }
};

const getProjectConstants = () => {
  if (!PROJECT_MODE.trim()) {
    console.warn("Please specify the Project mode");
    return;
  }

  let timer,
    local_language,
    local_api_key,
    local_avatar_id,
    show_disclaimer,
    local_knowledge_id,
    preview_video,
    tavus_audio_animation,
    tavus_audio_image;

  if (PROJECT_MODE === PROJECT_MODES.DEVELOPMENT) {
    timer = 300;
    local_language = "english";
    local_api_key = TAVUS_API_KEY;
    local_avatar_id = TAVUS_REPLICA_ID;
    local_knowledge_id = TAVUS_PERSONA_ID;
    show_disclaimer = true;
    preview_video =
      "https://cdn.pixabay.com/video/2016/04/02/2637-161442811_medium.mp4";
    tavus_audio_image = "https://picsum.photos/200/300";
    tavus_audio_animation =
      "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXNib2swZHNjOHN1N2FzdWNjMzUyMXdreDlyejBkMWlpeXY0bWFyaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UGrpkMXipFWQ06IHIM/giphy.gif";
  } else if (PROJECT_MODE === PROJECT_MODES.PRODUCTION) {
    timer = startBtn.getAttribute("timer") || 300;
    local_language = "english";
    show_disclaimer = startBtn.getAttribute("tavus_disclaimer_mode") === "true";
    preview_video = startBtn.getAttribute("tavus_preview_video") || "";
    tavus_audio_image = startBtn.getAttribute("tavus_audio_image");
    tavus_audio_animation = startBtn.getAttribute("tavus_audio_animation");
  } else {
    throw new Error("Invalid Project mode");
  }

  return {
    timer,
    preview_video,
    local_language,
    show_disclaimer,
    tavus_audio_image,
    mode: PROJECT_MODE,
    tavus_audio_animation,
    local_api_key: TAVUS_API_KEY,
    local_avatar_id: TAVUS_REPLICA_ID,
    local_knowledge_id: TAVUS_PERSONA_ID,
  };
};

const CONSTANTS = getProjectConstants();

class TavusAvatarManager {
  constructor() {
    this.apiKey = TAVUS_API_KEY;
    this.personaId = TAVUS_PERSONA_ID;
    this.replicaId = TAVUS_REPLICA_ID;

    this.daily = null;
    this.call_mode = "video";
    this.transcript = [];
    this.showChatBox = false;
    this.isConnected = false;
    this.isConnecting = false;
    this.isMicMuted = false;
    this.isCameraMuted = false;
    this.showTranscript = false;
    this.conversationUrl = null;
    this.conversationId = null;
    this.isUserSpeaking = false;
    // Privacy Disclamer
    this.privacyConfirmed = false;
    this.previewVideo = CONSTANTS.preview_video;
    this.showDisclaimer = CONSTANTS.show_disclaimer;
    /* ================= Speech Recognition ================= */
    this.speechRecognition = null;
    this.isListening = false;
    this.speechRecognitionSupported =
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
    this.lastProcessedMessageId = null;
    this.avatarMessagePollingInterval = null;
    /* ===================================================== */

    this.timerSeconds = CONSTANTS.timer; // default 5 min (300 seconds)
    this.remainingSeconds = 0;
    this.timerInterval = null;
    /* =============================================== */

    this.initializeButtons();
    this.updateUIState();
  }

  async checkForNewAvatarMessages() {
    if (!this.conversationId) return;

    try {
      const response = await fetch(
        `https://tavusapi.com/v2/conversations/${this.conversationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.apiKey,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          // Process only new messages
          const newMessages = data.messages.filter((msg) => {
            if (!this.lastProcessedMessageId) {
              return msg.role === "assistant";
            }
            return (
              msg.id > this.lastProcessedMessageId && msg.role === "assistant"
            );
          });

          newMessages.forEach((message) => {
            if (message.content) {
              console.log("🤖 AVATAR SPEAKING:", message.content);
              console.log(
                `🤖 AVATAR [${new Date().toLocaleTimeString()}]:`,
                message.content
              );
            }
          });

          // Update last processed message ID
          if (data.messages.length > 0) {
            this.lastProcessedMessageId = Math.max(
              ...data.messages.map((m) => m.id || 0)
            );
          }
        }
      }
    } catch (error) {
      console.error("Error checking for avatar messages:", error);
    }
  }

  /* ================= Timer Methods ================= */
  startTimer(duration = 30) {
    this.endTimer(); // clear any running timer first

    this.remainingSeconds = duration;
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      this.remainingSeconds--;
      this.updateTimerDisplay();

      if (this.remainingSeconds <= 0) {
        this.endTimer();
        this.endConversation();
        this.updateStatus("⏰ Timer ended – conversation time is up!");
      }
    }, 1000);
  }

  endTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resetTimer() {
    this.endTimer();
    this.remainingSeconds = this.timerSeconds;
    this.updateTimerDisplay();
  }

  updateTimerDisplay() {
    if (!countDown) return;

    const m = Math.floor(this.remainingSeconds / 60);
    const s = this.remainingSeconds % 60;
    countDown.textContent = `${m}:${s.toString().padStart(2, "0")}`;
  }

  initializeButtons() {
    // if (startBtn)
    //   startBtn.addEventListener("click", () => this.startConversation());
    if (endBtn) endBtn.addEventListener("click", () => this.endConversation());
    if (micToggle)
      micToggle.addEventListener("click", () => this.toggleMicrophone());
    if (cameraToggle)
      cameraToggle.addEventListener("click", () => this.toggleCamera());
  }

  updateUIState() {
    if (!avatarContainer) return;

    if (this.isConnecting) {
      avatarContainer.classList.add("loading");
      avatarContainer.classList.remove("streamReady");
      if (startBtn) {
        startBtn.disabled = true;
        startBtn.textContent = "Connecting...";
      }
      if (languageSwitcherContainer) {
        languageSwitcherContainer.classList.add("hide");
      }
    } else if (this.isConnected) {
      avatarContainer.classList.remove("loading");
      avatarContainer.classList.add("streamReady");
      if (startBtn) {
        startBtn.disabled = false;
        startBtn.textContent = "";
        startBtn.classList.add("hide");
      }
      this.updateMicButtonState();
      this.updateCameraButtonState();
    } else {
      avatarContainer.classList.remove("loading", "streamReady");
      if (startBtn) {
        startBtn.disabled = false;
        startBtn.textContent = "Chat";
        startBtn.classList.remove("hide");
      }
    }

    if (endBtn) endBtn.disabled = !this.isConnected;
  }

  updateChatButtonStates() {
    const chatIcon = document.getElementById("toggle-chat-icon");
    if (chatIcon) {
      chatIcon.className = this.showChatBox
        ? "fa-solid fa-eye-slash"
        : "fa-solid fa-eye";
    }

    // manager

    if (transcriptToggleButton) {
      transcriptToggleButton.classList.add("active");
    }
  }

  appendMessage(role, speech) {
    const align = role === "user" ? "right" : "left";
    const transcriptCopy = [...this.transcript];
    this.transcript = [...transcriptCopy, { role, speech }];

    transcriptMessageBox.insertAdjacentHTML(
      "beforeend",
      `<div class="chat-message ${align}">
        <p>${speech}</p>
      </div>`
    );
    scrollToBottom();
  }

  updateMicButtonState() {
    const micIcon = document.getElementById("micIcon");
    if (micIcon) {
      micIcon.className = this.isMicMuted
        ? "fa-solid fa-microphone-slash"
        : "fa-solid fa-microphone";
    }
    if (micToggle) micToggle.style.display = "block";
  }

  updateCameraButtonState() {
    const cameraIcon = document.getElementById("cameraIcon");
    if (cameraIcon) {
      cameraIcon.className = this.isCameraMuted
        ? "fa-solid fa-video-slash"
        : "fa-solid fa-video";
    }

    this.isCameraMuted
      ? userVideoElement.classList.add("hide")
      : userVideoElement.classList.remove("hide");
    if (cameraToggle) cameraToggle.style.display = "block";
  }

  async createConversation() {
    try {
      if (
        !this.call_mode?.trim() ||
        !Object.values(CALL_MODES).includes(this.call_mode)
      )
        throw new Error("No Call Mode Found");

      let response;
      let audio_only = this.call_mode === CALL_MODES.AUDIO;

      if (PROJECT_MODE === PROJECT_MODES.DEVELOPMENT) {
        const userInfo = localStorage.getItem("userInfo");

        console.log({ USER_INFO: userInfo });

        response = await fetch("https://tavusapi.com/v2/conversations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": CONSTANTS.local_api_key,
          },
          body: JSON.stringify({
            audio_only,
            replica_id: CONSTANTS.local_avatar_id,
            persona_id: CONSTANTS.local_knowledge_id,
            conversation_name: "Interactive Avatar Session",
            properties: {
              language: CONSTANTS.local_language,
            },
          }),
        });
      } else if (PROJECT_MODE === PROJECT_MODES.PRODUCTION) {
        response = await handleFetchProdConversation(audio_only);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create conversation");
      }

      const data = await response.json();
      this.transcript = [];
      transcriptMessageBox.innerHTML = "";
      this.conversationUrl = data.conversation_url;
      this.conversationId = data.conversation_id;
      console.log("Conversation created:", data);
      return data;
    } catch (error) {
      languageSwitcherContainer.classList.remove("hide");
      console.error("Error creating conversation:", error);
      this.updateStatus(`Error: ${error.message}`, true);
      throw error;
    }
  }

  // ✅ FIXED: Enhanced camera selection for Android (especially Motorola)
  async getFrontCameraDeviceId() {
    try {
      // Request permissions first (critical for WordPress/Android)
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      console.log(
        "📹 Available cameras:",
        videoDevices.map((d) => ({
          id: d.deviceId,
          label: d.label,
        }))
      );

      // Priority search for front camera
      // 1. Check for 'front' in label (most Android devices)
      let frontCamera = videoDevices.find((device) =>
        device.label.toLowerCase().includes("front")
      );

      // 2. Check for 'user' facing (standard convention)
      if (!frontCamera) {
        frontCamera = videoDevices.find((device) =>
          device.label.toLowerCase().includes("user")
        );
      }

      // 3. Check for camera index 1 (common on Motorola)
      if (!frontCamera && videoDevices.length > 1) {
        frontCamera = videoDevices[1];
      }

      // 4. Fallback to first camera
      if (!frontCamera && videoDevices.length > 0) {
        frontCamera = videoDevices[0];
      }

      if (frontCamera) {
        console.log(
          "✅ Selected front camera:",
          frontCamera.label,
          frontCamera.deviceId
        );
        return frontCamera.deviceId;
      }

      return null;
    } catch (error) {
      console.error("❌ Error getting camera devices:", error);
      return null;
    }
  }

  async startConversation() {
    try {
      this.isConnecting = true;
      this.updateUIState();

      await this.createConversation();

      this.daily = DailyIframe.createCallObject({
        showLeaveButton: false,
        showFullscreenButton: false,
      });

      this.setupEventListeners();

      // ✅ FIXED: Improved mobile detection and camera setup
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);

      if (isMobile) {
        console.log("📱 Mobile detected → setting up front camera");

        if (isAndroid) {
          // ✅ FIXED: For Android (including WordPress), get specific device ID
          console.log("🤖 Android detected - using enhanced camera selection");

          const frontCameraId = await this.getFrontCameraDeviceId();

          if (frontCameraId) {
            // Use specific device ID (works better in WordPress)
            await this.daily.setInputDevicesAsync({
              videoDeviceId: frontCameraId,
              audioDeviceId: "default",
            });
            console.log(
              "✅ Android front camera set with device ID:",
              frontCameraId
            );
          } else {
            // Fallback to facingMode
            await this.daily.setInputDevicesAsync({
              videoDeviceId: { facingMode: "user" },
              audioDeviceId: "default",
            });
            console.log("✅ Android front camera set with facingMode");
          }
        } else {
          // iOS devices work fine with facingMode
          await this.daily.setInputDevicesAsync({
            videoDeviceId: { facingMode: "user" },
            audioDeviceId: "default",
          });
          console.log("✅ iOS front camera set");
        }
      } else {
        console.log("💻 Desktop detected → using default devices");
        await this.daily.setInputDevicesAsync({
          videoDeviceId: "default",
          audioDeviceId: "default",
        });
      }

      // ✅ FIXED: Join with explicit video settings for WordPress compatibility
      await this.daily.join({
        url: this.conversationUrl,
        userName: "User",
        startVideoOff: false,
        startAudioOff: false,
      });

      this.transcript = [];
      console.log("✅ Joined conversation");
      this.updateStatus("🔄 Waiting for avatar to join...");
      if (this.call_mode === CALL_MODES.AUDIO) {
        this.handleAudioCallStart();
      } else {
        userVideoElement.classList.remove("hide");
        this.handleVideoCallStart();
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      this.updateStatus(`Error: ${error.message}`, true);
      this.isConnecting = false;
      this.updateUIState();
    }
  }

  async endConversation() {
    try {
      this.endTimer();
      this.resetTimer();

      if (this.daily) {
        await this.daily.leave();
        this.daily.destroy();
        this.daily = null;
      }

      this.isConnected = false;
      this.isConnecting = false;
      this.isMicMuted = false;
      this.isCameraMuted = false;
      this.conversationUrl = null;
      this.conversationId = null;
      this.lastProcessedMessageId = null;

      startBtn.classList.remove("hide");
      this.updateUIState();
      this.updateStatus("Conversation ended. Ready to start a new one.");

      if (videoElement) videoElement.srcObject = null;
      if (userVideoElement) {
        userVideoElement.srcObject = null;
        userVideoElement.classList.add("hide");
      }
      audioTrack = null;
      videoTrack = null;
      userVideoTrack = null;
      if (micToggle) micToggle.style.display = "none";
      if (cameraToggle) cameraToggle.style.display = "none";
      this.endTimer();
      if (languageSwitcherContainer) {
        languageSwitcherContainer.classList.remove("hide");
      }
      // handleCloseTranscript();
    } catch (error) {
      console.error("Error ending conversation:", error);
      this.updateStatus(`Error ending conversation: ${error.message}`, true);
    }

    horizontalBoxes.classList.remove("transcript-open");
    this.privacyConfirmed = false;

    localStorage.removeItem("userInfo");
    audioStaticContainer.classList.remove("hide");
    // animationImage.classList.add("hide");
    disclaimerBox.classList.add("hide");
    userForm.classList.add("hide");
    videoContainer.classList.add("hide");
    startBtnContainer.classList.add("hide");
    fullName.value = "";
    mobile.value = "";
    email.value = "";
    if (this.transcript.length > 0) {
      callEndContainer.classList.remove("hide");
      privacyModal.classList.remove("hide");
    }

    // MOdal management;

    iconView.classList.remove("hide");
    iconHide.classList.add("hide");
    this.showChatBox = false;
    this.showTranscript = false;
    transcriptContainer.classList.add("hide");
    inputContainer.classList.add("hide");
    iconView.style.display = "block";
    horizontalBoxes.classList.remove("transcript-open");

    // audioVisualizerContainer.classList.add("hide");
    // callEffect.classList.add("hide");
  }

  async toggleMicrophone() {
    if (!this.daily) return;
    this.isMicMuted = !this.isMicMuted;

    if (this.isMicMuted && speakingAnimation) {
      speakingAnimation.classList.add("hide");
    }

    await this.daily.setLocalAudio(!this.isMicMuted);
    this.updateMicButtonState();
    this.updateStatus(`🎤 Microphone ${this.isMicMuted ? "muted" : "unmuted"}`);
  }

  async toggleCamera() {
    if (!this.daily) return;
    this.isCameraMuted = !this.isCameraMuted;
    await this.daily.setLocalVideo(!this.isCameraMuted);
    this.updateCameraButtonState();
    this.updateStatus(
      `📹 Camera ${this.isCameraMuted ? "turned off" : "turned on"}`
    );
  }

  async setupUserVideo() {
    try {
      const participants = this.daily.participants();
      const localParticipant = participants.local;

      if (localParticipant && localParticipant.video) {
        userVideoTrack = localParticipant.video.track;
        this.handleUserVideoTrack(userVideoTrack);

        // ✅ FIXED: Verify video track is active and streaming
        console.log("✅ User video track setup:", {
          enabled: userVideoTrack.enabled,
          muted: userVideoTrack.muted,
          readyState: userVideoTrack.readyState,
        });
      }
    } catch (error) {
      console.error("Error setting up user video:", error);
    }
  }

  handleUserVideoTrack(videoTrack) {
    if (userVideoElement && videoTrack) {
      const userStream = new MediaStream([videoTrack]);
      userVideoElement.srcObject = userStream;
      userVideoElement.muted = true; // Mute to prevent echo
      userVideoElement.onloadedmetadata = () =>
        userVideoElement.play().catch(console.error);
      console.log("User video track setup complete");
    }
  }

  handleAudioCallStart() {
    audioStaticContainer.classList.add("hide");
    animationImage.src = CONSTANTS.tavus_audio_animation;
    animationImage.classList.remove("hide");
    userVideoElement.classList.add("hide");
    videoStaticContainer.classList.add("hide");
    cameraToggle.classList.add("hide");
    videoElement.classList.add("hide");
    // audioVisualizerContainer.classList.remove("hide");
    // callEffect.classList.remove("hide");
  }

  handleVideoCallStart() {
    audioStaticContainer.classList.add("hide");
    // audioVisualizerContainer.classList.add("hide");
    cameraToggle.classList.remove("hide");
    videoElement.classList.remove("hide");
  }

  setupEventListeners() {
    this.daily.on("joined-meeting", async () => {
      this.isConnected = true;
      this.isConnecting = false;
      this.updateUIState();
      this.updateStatus("🔄 Waiting for avatar to join...");

      // ✅ FIXED: Force mic ON and verify video is streaming (WordPress fix)
      try {
        await this.daily.setLocalAudio(true);
        await this.daily.setLocalVideo(true);

        // ✅ FIXED: Verify camera is actually streaming
        const participants = this.daily.participants();
        const localVideo = participants.local?.video;
        console.log("📹 Camera status after join:", {
          hasVideo: !!localVideo,
          videoState: localVideo?.state,
          trackEnabled: localVideo?.track?.enabled,
        });
      } catch (err) {
        console.warn("Could not verify media immediately:", err);
      }

      // Setup user's own video display
      this.setupUserVideo();
    });

    this.daily.on("participant-joined", (event) => {
      const participant = event.participant;
      if (!participant.local && participant.user_id.includes("tavus-replica")) {
        this.startTimer(this.timerSeconds);
        if (this.call_mode === CALL_MODES.VIDEO) {
          userVideoElement.classList.remove("hide");
        }
        this.updateStatus("🤖 Avatar joined the conversation!");

        // ✅ FIXED: Log video capabilities for debugging
        console.log("🤖 Avatar joined - checking video feed availability");
      }
    });

    this.daily.on("participant-updated", (event) => {
      const participant = event.participant;
      if (!participant.local && participant.user_name.includes("Replica")) {
        this.handleAvatarVideoTrack(participant);
      }

      // ✅ FIXED: Monitor local participant video state changes
      if (participant.local && participant.video) {
        console.log("📹 Local video updated:", {
          state: participant.video.state,
          hasTrack: !!participant.video.track,
        });
      }
    });

    this.daily.on("track-started", (event) => {
      const { participant, track } = event;

      // Handle avatar tracks
      if (!participant.local && track.kind === "video") videoTrack = track;
      if (!participant.local && track.kind === "audio") {
        audioTrack = track;
        this.setupAvatarAudioAnalysis(track);
      }
      if (videoTrack && audioTrack)
        this.handleAvatarVideoTrack(videoTrack, audioTrack);

      // Handle user's own video track
      if (participant.local && track.kind === "video") {
        userVideoTrack = track;
        this.handleUserVideoTrack(track);
        // ✅ FIXED: Log when local video track starts
        console.log("✅ Local video track started successfully");
      }
    });

    this.daily.on("app-message", (event) => {
      if (event?.data?.event_type === USER_SPEAKING_EVENTS.START) {
        if (chatBox.classList.contains("fullwidth")) {
          speakingAnimation.classList.remove("hide");
        }
        this.isUserSpeaking = true;
      } else if (event?.data?.event_type === USER_SPEAKING_EVENTS.STOP) {
        this.isUserSpeaking = false;
        speakingAnimation.classList.add("hide");
      }

      if (
        event?.data?.message_type === "conversation" &&
        event?.data?.properties &&
        event?.data?.properties?.role
      ) {
        const { role, speech } = event?.data?.properties;
        if (speech) {
          this.appendMessage(role, speech);
        }
      }
    });

    this.daily.on("participant-left", (event) => {
      if (event.participant.user_name.includes("Replica"))
        this.updateStatus("🤖 Avatar left the conversation");
    });

    this.daily.on("error", (error) => {
      console.error("Daily error:", error);
      this.updateStatus(`Error: ${error.message}`, true);
      this.isConnected = false;
      this.isConnecting = false;
      this.updateUIState();
    });
  }

  setupAvatarAudioAnalysis(audioTrack) {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      // 🔑 Resume context immediately for Android (prevents delayed start)
      if (audioContext.state === "suspended") {
        audioContext.resume().catch(console.error);
      }

      const stream = new MediaStream([audioTrack]);
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 256;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let isSpeaking = false;
      let speechStartTime = null;
      const SPEECH_THRESHOLD = 30;
      const MIN_SPEECH_DURATION = 300;

      const checkAudio = () => {
        analyser.getByteFrequencyData(dataArray);

        const average =
          dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;

        if (average > SPEECH_THRESHOLD && !isSpeaking) {
          isSpeaking = true;
          speechStartTime = Date.now();
        } else if (average <= SPEECH_THRESHOLD && isSpeaking) {
          const speechDuration = Date.now() - speechStartTime;
          if (speechDuration > MIN_SPEECH_DURATION) {
            console.log(
              `🤖 AVATAR AUDIO: Finished speaking (${speechDuration}ms)`
            );
          }
          isSpeaking = false;
          speechStartTime = null;
        }

        if (this.isConnected) {
          requestAnimationFrame(checkAudio);
        }
      };

      checkAudio();
    } catch (error) {
      console.error("Error setting up avatar audio analysis:", error);
    }
  }
  handleAvatarVideoTrack(videoTrack, audioTrack) {
    if (videoElement && videoTrack) {
      const avatarStream = new MediaStream([videoTrack, audioTrack]);
      videoElement.srcObject = avatarStream;
      videoElement.muted = false;
      videoElement.onloadedmetadata = () =>
        videoElement.play().catch(console.error);
      this.updateStatus("🤖 Avatar is ready! You can start talking.");
    }
  }

  updateStatus(message, isError = false) {
    console.log(`Status: ${message}`);
    if (isError) console.error(`Error: ${message}`);
  }

  toggleTranscriptBox() {
    this.showTranscript = !this.showTranscript;
  }
}

// ------------------ Initialize ------------------
document.addEventListener("DOMContentLoaded", () => {
  const manager = new TavusAvatarManager();

  inputField.addEventListener("input", (event) => {
    sendMessageBtn.disabled = !event.target.value.trim();
  });

  const handleToggleChatButton = async () => {
    if (!manager.daily) return;

    if (PROJECT_MODE === PROJECT_MODES.DEVELOPMENT) {
      const isShowing = !manager.showChatBox;

      // Update mic state
      manager.isMicMuted = isShowing;
      micToggle.disabled = isShowing;
      await manager.daily.setLocalAudio(!isShowing);
      manager.updateMicButtonState();
      manager.updateStatus(
        `🎤 Microphone ${manager.isMicMuted ? "muted" : "unmuted"}`
      );
      //
      // Update chat visibility
      manager.showChatBox = isShowing;
      manager.updateChatButtonStates();
      //
      // management
      if (transcriptContainer) {
        transcriptContainer.classList.remove("hide");
        iconView.classList.add("hide");
        iconHide.classList.remove("hide");
        manager.showTranscript = true;
      }
      //
      if (inputContainer) {
        inputContainer.classList.toggle("show", isShowing);
        inputContainer.classList.toggle("hide", !isShowing);
      }
    } else {
      // Production Mode

      if (manager.showChatBox && manager.showTranscript) {
        manager.toggleMicrophone();
        inputContainer.classList.add("hide");
        manager.showChatBox = false;
        transcriptMessageBox.style.paddingBottom = "10px";
      } else {
        if (manager.showTranscript) {
          manager.toggleMicrophone();
          inputContainer.classList.remove("hide");
          manager.showChatBox = true;
          transcriptMessageBox.style.paddingBottom = "60px";
        } else {
          transcriptMessageBox.style.paddingBottom = "60px";
          iconView.classList.add("hide");
          iconHide.classList.remove("hide");
          iconHide.style.display = "block";
          transcriptContainer.style.display = "block";
          transcriptContainer.classList.remove("hide");
          horizontalBoxes.classList.add("transcript-open");
          scrollToBottom();
          inputContainer.classList.remove("hide");
          manager.toggleMicrophone();
          manager.showTranscript = true;
          manager.showChatBox = true;
        }
      }
    }
  };

  toggleBtn.addEventListener(
    "click",
    async () => await handleToggleChatButton()
  );

  inputField.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      await handleSendMessage(manager);
    }
  });

  sendMessageBtn.addEventListener(
    "click",
    async () => await handleSendMessage(manager)
  );

  transcriptToggleButton.addEventListener(
    "click",
    async () => await handleTranscriptButtonClick(manager)
  );

  closeBtn.addEventListener("click", () => manager.endConversation());

  exportTranscriptToPDFBtn.addEventListener("click", () =>
    downloadTranscriptPDF(manager.transcript)
  );

  if (PROJECT_MODE === PROJECT_MODES.DEVELOPMENT) {
    if (callModeSelect) {
      callModeSelect.addEventListener("change", (event) => {
        manager.call_mode = event.target.value;
        if (manager.call_mode === CALL_MODES.AUDIO) {
          videoStaticContainer.classList.add("hide");
          audioStaticContainer.classList.remove("hide");
        } else if (manager.call_mode === CALL_MODES.VIDEO) {
          audioStaticContainer.classList.add("hide");
          videoStaticContainer.classList.remove("hide");
        }
        console.log("Call Mode is Now : ", event.target.value);
      });
    }
  } else if (PROJECT_MODE === PROJECT_MODES.PRODUCTION) {
    manager.call_mode = prodCallMode;
    console.log("Call Mode is Now : ", prodCallMode);
  }

  if (manager.call_mode === CALL_MODES.AUDIO) {
    // manager.handleAudioCallStart();
    videoStaticContainer.classList.add("hide");
    audioStaticContainer.classList.remove("hide");
  } else if (manager.call_mode === CALL_MODES.VIDEO) {
    manager.handleVideoCallStart();
    audioStaticContainer.classList.add("hide");
    videoStaticContainer.classList.remove("hide");
  } else {
  }

  // Privacy

  startBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    if (manager.showDisclaimer) {
      privacyModal.classList.remove("hide");
      disclaimerBox.classList.remove("hide");
      userForm.classList.add("hide");
      videoContainer.classList.add("hide");
      startBtnContainer.classList.add("hide");
    } else {
      await manager.startConversation();
    }
  });

  // agreeBtn.addEventListener("click", function () {
  //   if (
  //     manager.showDisclaimer &&
  //     !Object.values(CALL_MODES).includes(manager.call_mode)
  //   ) {
  //     alert("Please choose the call Mode first");
  //     privacyModal.classList.add("hide");
  //     return;
  //   }

  //   manager.privacyConfirmed = true;
  //   disclaimerBox.classList.add("hide");
  //   userForm.classList.remove("hide");
  //   videoContainer.classList.add("hide");
  //   startBtnContainer.classList.add("hide");
  // });

  // rejectBtn.addEventListener("click", function () {
  //   manager.privacyConfirmed = false;
  //   privacyModal.classList.add("hide");
  //   disclaimerBox.classList.remove("hide");
  // });

  skipBtn.addEventListener("click", () => {
    userForm.classList.add("hide");
    disclaimerBox.classList.add("hide");

    if (
      manager.previewVideo?.trim() &&
      manager.call_mode === CALL_MODES.VIDEO
    ) {
      video.src = manager.previewVideo;
      videoContainer.classList.remove("hide");
    } else {
      startBtnContainer.classList.remove("hide");
    }
    localStorage.removeItem("userInfo");
  });

  // Validation functions
  const validateName = () => {
    console.log({ fullName: fullName.value });
    if (!fullName.value.trim()) {
      return false;
    }
    return true;
  };

  const validateMobile = () => {
    const mobileValue = mobile.value.trim();
    if (!/^\d{10}$/.test(mobileValue)) {
      return false;
    }
    return true;
  };

  const validateEmail = () => {
    const emailValue = email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
      return false;
    }
    return true;
  };

  // Next button handler with validation check
  nextBtn.addEventListener("click", () => {
    const isNameValid = validateName();
    const isMobileValid = validateMobile();
    const isEmailValid = validateEmail();

    if (isNameValid && isMobileValid && isEmailValid) {
      const countryCode = document.getElementById("countryCode").value;
      console.log("Values Recived Here");
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          countryCode,
          email: email.value,
          mobile: mobile.value,
          fullName: fullName.value,
        })
      );
    }
  });

  video.addEventListener("ended", () => {
    videoContainer.classList.add("hide");
    startBtnContainer.classList.remove("hide");
  });

  startCallBtn.addEventListener("click", async () => {
    privacyModal.classList.add("hide");
    disclaimerBox.classList.add("hide");
    userForm.classList.add("hide");
    videoContainer.classList.add("hide");
    startBtnContainer.classList.add("hide");
    await manager.startConversation();
  });

  cancelTranscript.addEventListener("click", () => {
    manager.transcript = [];
    transcriptMessageBox.innerHTML = "";
    privacyModal.classList.add("hide");
    callEndContainer.classList.add("hide");
  });

  downloadTranscript.addEventListener("click", async () => {
    transcriptMessageBox.innerHTML = "";
    downloadTranscriptPDF(manager.transcript);
    privacyModal.classList.add("hide");
    callEndContainer.classList.add("hide");
    manager.transcript = [];
  });
});

async function downloadTranscriptPDF(data) {
  if (!Array.isArray(data) || !data.length) return;

  // Create a temporary container
  const container = document.createElement("div");
  container.style.width = "800px";
  container.style.padding = "20px";
  container.style.fontFamily = "'Noto Sans Devanagari', Arial, sans-serif";
  container.style.backgroundColor = "white";
  container.style.position = "absolute";
  container.style.left = "-9999px";

  // Add content
  data.forEach(({ role, speech }) => {
    const isUser = role === "user";

    const messageDiv = document.createElement("div");
    messageDiv.style.marginBottom = "15px";
    messageDiv.style.textAlign = isUser ? "right" : "left";

    const label = document.createElement("div");
    label.style.fontWeight = "bold";
    label.style.fontSize = "12px";
    label.textContent = isUser ? "User :" : "Avatar :";

    const text = document.createElement("div");
    text.style.fontSize = "12px";
    text.style.marginTop = "5px";
    text.textContent = speech;

    messageDiv.appendChild(label);
    messageDiv.appendChild(text);
    container.appendChild(messageDiv);
  });

  document.body.appendChild(container);

  // Convert to PDF
  const { jsPDF } = window.jspdf;
  const canvas = await html2canvas(container, { scale: 2 });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save("transcript.pdf");

  // Cleanup
  document.body.removeChild(container);
}

async function handleSendMessage(manager) {
  try {
    const text = inputField.value.trim();
    if (!text) return;

    await sendTextMessage(manager, text);
    inputField.value = "";
    sendMessageBtn.disabled = true;
  } catch (error) {
    console.error("Error while working with the sending message", {
      cause: error,
    });
  }
}

function scrollToBottom() {
  transcriptMessageBox.scrollTop = transcriptMessageBox.scrollHeight;

  transcriptMessageBox.scrollTo({
    top: transcriptMessageBox.scrollHeight,
    behavior: "smooth",
  });
}

async function handleFetchProdConversation(audio_only) {
  if (ajaxurl) {
    let local_language;
    const saved = localStorage.getItem("selectedLanguage");
    if (saved) {
      const { langCode, flagEmoji, languageName } = JSON.parse(saved);

      const languageMap = {
        Español: "Spanish",
        Français: "French",
      };

      local_language = languageMap[languageName] || "English";
    }

    const userInfo = localStorage.getItem("userInfo");
    console.log({ userInfo });

    return await fetch(ajaxurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body: new URLSearchParams({
        audio_only: audio_only,
        language: local_language || "english",
        action: "avatar_studio_tavusConversation",
        userInfo: typeof userInfo === "string" ? userInfo : "",
      }),
    })
      .then((response) => response)
      .catch((error) => {
        console.error(
          "There was an error while creating converstioan on PRODUCTION!",
          error
        );
        return null;
      });
  }

  return null;
}

function toggleLanguageDropdown() {
  const dropdown = document.getElementById("languageDropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

const handleTranscriptButtonClick = async (manager) => {
  if (PROJECT_MODE === PROJECT_MODES.PRODUCTION) {
    if (manager.showChatBox && manager.showTranscript) {
      manager.toggleMicrophone(); // Mic Unmuted
      iconView.classList.remove("hide");
      iconHide.classList.add("hide");
      manager.showChatBox = false;
      manager.showTranscript = false;
      transcriptContainer.classList.add("hide");
      inputContainer.classList.add("hide");
      horizontalBoxes.classList.remove("transcript-open");
    } else if (!manager.showChatBox && manager.showTranscript) {
      iconView.classList.remove("hide");
      iconHide.classList.add("hide");
      manager.showTranscript = false;
      transcriptContainer.classList.add("hide");
      horizontalBoxes.classList.remove("transcript-open");
    } else {
      iconView.classList.add("hide");
      iconHide.classList.remove("hide");
      iconHide.style.display = "block";
      transcriptContainer.classList.remove("hide");
      horizontalBoxes.classList.add("transcript-open");
      manager.showTranscript = true;
    }
  } else {
    if (iconView && iconHide && transcriptContainer) {
      if (manager.showTranscript) {
        iconView.classList.remove("hide");
        iconHide.classList.add("hide");
        transcriptContainer.classList.add("hide");
        if (manager.showChatBox) {
          // Chat Box Management
          manager.updateChatButtonStates();
          const chatIcon = document.getElementById("toggle-chat-icon");
          if (chatIcon) {
            manager.showChatBox = false;
            chatIcon.className = "fa-solid fa-eye";
          }
          // Mic Mangement
          const micIcon = document.getElementById("micIcon");
          if (micIcon) {
            micIcon.className = "fa-solid fa-microphone";
            await manager.daily.setLocalAudio(true);
            micToggle.disabled = false;
            manager.isMicMuted = false;
          }
          if (inputContainer) {
            inputContainer.classList.add("hide");
          }
        }
      } else {
        iconHide.classList.remove("hide");
        iconView.classList.add("hide");
        transcriptContainer.classList.remove("hide");
      }
      scrollToBottom();
      manager.toggleTranscriptBox();
    }
  }
};
