let sessionData = null;
let room = null;
let recognition = null;
let mediaStream = null;
let webSocket = null;
let sessionToken = null;

let avatarId = "Ann_Therapist_public";
let knowledgeId = "";
let language = "en";
let opening_text = "Hello, how can I help you?";
let tokenCall = 0;
let userTalkingText = "";
let avatarTalkingText = "";
let countdownTimer = null;

let questionnaires = [];
let renderedQuestionnaires = [];

let answerSubmit = true;
let isInputAudioMuted = true; // Default to muted

document.addEventListener("DOMContentLoaded", function () {
  const mediaElement = document.getElementById("avatarVideo");
  const startButton = document.getElementById("startSession");
  const endButton = document.getElementById("endSession");
  const interruptTask = document.getElementById("interruptTask");
  const micToggle = document.getElementById("micToggler");

  const switchInteractionMode = document.getElementById(
    "switchInteractionMode"
  );
  const speakButton = document.getElementById("speakButton");
  const userInput = document.getElementById("userInput");

  const chatBoxContainer = document.getElementById("chatBox");
  const avatarContainer = document.querySelector(".avatarContainer");
  const avatarError = document.getElementById("avatarError");
  const ajaxURL = document.getElementById("ajaxURL");
  const heygenNonce = document.getElementById("avatar_studio_nonce");
  const avatar_studio_nonce = heygenNonce ? heygenNonce?.value : "";
  const ajaxurl = ajaxURL ? ajaxURL?.value : "";

  // Add these DOM elements with your existing ones

  const transcriptContainer = document.getElementById("transcriptContainer");
  const voiceTranscript = document.getElementById("voiceTranscript");
  const exportTranscriptToPDFButton = document.getElementById(
    "exportTranscriptToPDF"
  );
  const sendTranscriptToEmailButton = document.getElementById(
    "sendTranscriptToEmail"
  );
  const overlayQuestionContainer = document.getElementById("overlayQuestion");
  const overlayQuestionSubmitButton = document.getElementById(
    "overlayQuestionSubmit"
  );
  const closeOverlayQuestionButton = document.getElementById(
    "closeOverlayQuestion"
  );
  const countdownElement = document.getElementById("streamingCountdown");

  // Start session

  if (startButton) {
    startButton.addEventListener("click", async () => {
      await createSession();
      await startStreamingSession();
    });
  }

  // Close session
  if (endButton) {
    endButton.addEventListener("click", closeSession);
  }

  if (micToggle) {
    micToggle.addEventListener("click", handleMuteAudio);
  }

  // Send text
  if (speakButton) {
    speakButton.addEventListener("click", () => {
      const text = userInput.value.trim();
      if (text) {
        sendText(text, "chat");
        createParagraphElement("user");
        addTextToTranscript(text, "user", false);
        userInput.value = "";
      }
    });
  }

  if (userInput) {
    userInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        const text = userInput.value.trim();
        if (text) {
          sendText(text, "chat");
          createParagraphElement("user");
          addTextToTranscript(text, "user", false);
          userInput.value = "";
        }
      }
    });
  }

  if (interruptTask) {
    interruptTask.addEventListener("click", async () => {
      await interruptAvatar();
    });
  }
  if (switchInteractionMode) {
    switchInteractionMode.addEventListener("click", toggleInteractionMode);
  }

  if (overlayQuestionSubmitButton) {
    overlayQuestionSubmitButton.addEventListener(
      "click",
      overlayQuestionSubmit
    );
  }
  if (closeOverlayQuestionButton) {
    closeOverlayQuestionButton.addEventListener("click", closeOverlayQuestion);
  }

  function updateStatus(message) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${message} `);
  }
  let audioRecorder = null;
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.error("🚫 Browser does not support Speech Recognition API.");
    if (!audioRecorder) {
      deepgramSTT();
    }
  } else {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let lastTranscript = "";
    let hasStartedSpeaking = false;
    let timeoutId = null;

    async function onFinalTranscript(text) {
      console.log("✅ Final transcript:", text);
      if (!text.trim()) {
        console.warn("Empty transcript received");
        return;
      }
      await onSpeechEnd(text);
    }

    function setIsSpeaking(isSpeaking) {
      console.log("🗣️ Is speaking:", isSpeaking);
    }

    function startSpeechRecognitionSession() {
      if (recognition) {
        recognition.stop();
      }
      recognition.start();
      isInputAudioMuted = false;
    }

    function stopSpeechRecognitionSession() {
      recognition.stop();
      isInputAudioMuted = true;
      lastTranscript = "";
      hasStartedSpeaking = false;
      clearTimeout(timeoutId);
      setIsSpeaking(false);
      if (chatBoxContainer.classList.contains("talking")) {
        chatBoxContainer.classList.remove("talking");
      }
    }
    recognition.onstart = function () {
      console.log("🗣️ started speaking:");
    };

    recognition.onspeechend = function () {
      console.log("🗣️ stoped speaking:");
      recognition.stop();
    };
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }

      if (transcript !== lastTranscript) {
        setIsSpeaking(true);

        if (!hasStartedSpeaking) {
          onSpeechStart();
          hasStartedSpeaking = true;
        }

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (transcript.trim()) {
            onFinalTranscript(transcript.trim());
          }
          lastTranscript = "";
          setIsSpeaking(false);
          hasStartedSpeaking = false;
        }, 1500);

        lastTranscript = transcript;
      }
    };

    recognition.onerror = (event) => {
      console.error("❌ Speech recognition error:", event.error);

      if (!audioRecorder) {
        deepgramSTT();
      }
      (async () => {
        await audioRecorder?.startRecording();
        updateMuteButton(!audioRecorder.audioRecording);
      })();
      if (!audioRecorder.audioRecording) {
        setTimeout(function () {
          toggleInteractionMode();
          if (avatarError) {
            avatarError.innerHTML = "";
          }
        }, 2000);
        if (avatarError) {
          avatarError.innerHTML = `<span style="padding:10px; ">Voice mode isn’t allowed now, Please check your microphone and try again. </span>`;
        }
      }
    };
  }
  async function onSpeechStart() {
    interruptAvatar();
    console.log("🟢 Speech started");
    if (!chatBoxContainer.classList.contains("talking")) {
      chatBoxContainer.classList.add("talking");
    }
  }

  async function onSpeechEnd(text) {
    createParagraphElement("user");
    addTextToTranscript(text, "user", false);
    if (AVANEW_AS_API_CONFIG.RAG_API_URL === "") {
      sendText(text, "chat");
    } else {
      try {
        const answer = await getAnswerFromRAG(
          text,
          language,
          sessionData.session_id
        );
        if (answer && answer.trim() !== "") {
          sendText(answer, "repeat");
        } else {
          sendText(text, "chat");
        }
      } catch (err) {
        console.error("❌ Error in processing speech:", err);
      }
    }

    if (chatBoxContainer.classList.contains("talking")) {
      chatBoxContainer.classList.remove("talking");
    }
  }

  async function deepgramSTT() {
    audioRecorder = new AudioRecorder(
      (state) => {
        if (state?.source == "microphone" && state?.error) {
          if (
            state.name === "NotAllowedError" ||
            state.name === "SecurityError"
          ) {
            alert(
              "Microphone access was denied. Please allow microphone permission to continue."
            );
          } else if (state.name === "NotFoundError") {
            alert(
              "No microphone found. Please connect a microphone and try again."
            );
          } else {
            alert("Error accessing microphone: " + error.message);
          }

          setTimeout(function () {
            toggleInteractionMode();
            if (avatarError) {
              avatarError.innerHTML = "";
            }
          }, 5000);
          if (avatarError) {
            avatarError.innerHTML = `<span style="padding:10px; ">Please check your microphone. Switching to chat mode  </span>`;
          }
        } else if (state?.source == "deepgram" && state?.error) {
          if (state?.name == "INVALID_AUTH") {
            setTimeout(function () {
              toggleInteractionMode();
              if (avatarError) {
                avatarError.innerHTML = "";
              }
            }, 5000);
            if (avatarError) {
              avatarError.innerHTML = `<span style="padding:10px; ">Please check your STT key and try again. Switching to chat mode  </span>`;
            }
          }
        }
      },
      async (text) => {
        await onSpeechEnd(text);
      }
    );
  }
  async function handleMuteAudio() {
    if (micToggle) {
      if (SpeechRecognition) {
        if (isInputAudioMuted) {
          startSpeechRecognitionSession();
        } else {
          stopSpeechRecognitionSession();
        }
        updateMuteButton(isInputAudioMuted);
      } else if (audioRecorder) {
        if (audioRecorder.audioRecording) {
          await audioRecorder?.stopRecording();
        } else {
          await audioRecorder?.startRecording();
        }
        updateMuteButton(!audioRecorder.audioRecording);
      } else {
        console.log("Audio not supported");
      }
    }
  }

  async function fetchAccessToken() {
    tokenCall++;
    if (ajaxurl) {
      return await fetch(ajaxurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "avatar_studio_heygenToken",
          nonce: avatar_studio_nonce,
        }),
      })
        .then((response) => response.json())
        .then(async (res) => {
          console.log("res", res);
          if (res.success && res?.data?.token != "") {
            return res.data.token;
          } else {
            if (tokenCall <= 5) {
              return await fetchAccessToken();
            }
          }
        })
        .catch((error) => {
          if (avatarContainer.classList.contains("loading")) {
            avatarContainer.classList.remove("loading");
          }
          console.error("There was an error!", error);
          return "";
        });
    }

    return "";
  }

  async function connectWebSocket(sessionId) {
    const params = new URLSearchParams({
      session_id: sessionId,
      session_token: sessionToken,
      silence_response: false,
      opening_text: opening_text,
      stt_language: language,
    });

    const wsUrl = `wss://${
      new URL(AVANEW_AS_API_CONFIG.serverUrl).hostname
    }/v1/ws/streaming.chat?${params}`;

    webSocket = new WebSocket(wsUrl);

    // Handle WebSocket events
    webSocket.addEventListener("message", (event) => {
      const eventData = JSON.parse(event.data);
      console.log("Raw WebSocket event:", eventData);
    });
  }
  async function createSession() {
    tokenCall = 0;
    if (avatarError) {
      avatarError.style.marginTop = "0px";
      avatarError.innerHTML = "";
    }
    if (!avatarContainer.classList.contains("loading")) {
      avatarContainer.classList.add("loading");
    }

    getAvatarQuestionnaires();
    sessionToken = await fetchAccessToken();

    if (sessionToken && sessionToken != "") {
      fetch(ajaxurl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          action: "insert_avatar_studio_user",
          provider: "heygen",
          token: sessionToken,
        }),
      });

      avatarId = startButton.getAttribute("aid");
      knowledgeId = startButton.getAttribute("kid");
      language = startButton.getAttribute("language");
      opening_text = startButton.getAttribute("opening_text");
      opening_text =
        opening_text && opening_text != ""
          ? opening_text
          : "Hello, how can I help you?";
      avatarId = avatarId ? avatarId : "Ann_Therapist_public";
      knowledgeId = knowledgeId ? knowledgeId : "";
      language = language ? language : "en";

      // Create new session
      const response = await fetch(
        `${AVANEW_AS_API_CONFIG.serverUrl}/v1/streaming.new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({
            version: "v2",
            video_encoding: "H264",
            avatar_id: avatarId,
            knowledge_base_id: knowledgeId,
            quality: "high",
            voice: {
              rate: 1.5,
              emotion: "excited",
            },
            disable_idle_timeout: false,
            stt_settings: { provider: "deepgram", confidence: 0.55 },
            activity_idle_timeout: 180,
          }),
        }
      );

      const data = await response.json();
      sessionData = data.data;
      // console.log("Session data:", sessionData);
      voiceTranscript.innerHTML = "";
      exportTranscriptToPDFButton.style.display = "none";
      sendTranscriptToEmailButton.style.display = "none";
      // Create LiveKit Room
      room = new LivekitClient.Room({
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: {
          resolution: LivekitClient.VideoPresets.h720.resolution,
        },
      });
      console.log("LiveKit room created", room);

      // Handle room events
      // Handle media streams
      mediaStream = new MediaStream();
      room.on(
        LivekitClient.RoomEvent.DataReceived,
        (payload, participant, kind) => {
          let data = new TextDecoder().decode(payload);
          try {
            data = JSON.parse(data);
            if (data.type === "avatar_talking_message") {
              avatarTalkingText += data.message;
            }
            if (data.type === "avatar_end_message") {
              const avatarFullMessage = avatarTalkingText.trim();
              createParagraphElement("avatar");
              addTextToTranscript(avatarFullMessage, "avatar", false);
              avatarTalkingText = "";
            }
          } catch (e) {
            console.error("Error parsing data:", e);
          }
          // console.log("Room message:", data);
        }
      );

      room.on(LivekitClient.RoomEvent.TrackSubscribed, (track) => {
        if (track.kind === "video" || track.kind === "audio") {
          mediaStream.addTrack(track.mediaStreamTrack);
          if (
            mediaStream.getVideoTracks().length > 0 &&
            mediaStream.getAudioTracks().length > 0
          ) {
            mediaElement.srcObject = mediaStream;
            updateStatus("Media stream ready");
          }
        }
      });

      // Handle media stream removal
      room.on(LivekitClient.RoomEvent.TrackUnsubscribed, (track) => {
        const mediaTrack = track.mediaStreamTrack;
        if (mediaTrack) {
          mediaStream.removeTrack(mediaTrack);
        }
      });
      // A participant has joined the room
      room.on(LivekitClient.RoomEvent.ParticipantConnected, (participant) => {
        console.log(`${participant.identity} joined`);
      });
      // A participant has left the room
      room.on(
        LivekitClient.RoomEvent.ParticipantDisconnected,
        (participant) => {
          console.log("Participant disconnected:", participant.identity);
        }
      );

      // A track was published by a participant
      room.on(
        LivekitClient.RoomEvent.TrackPublished,
        (publication, participant) => {
          console.log(`Track published by ${participant.identity}`);
        }
      );

      room.on(
        LivekitClient.RoomEvent.ConnectionQualityChanged,
        (quality, participant) => {
          // console.log(`${participant.identity}'s connection quality:`, quality);
        }
      );
      // Handle room connection state changes
      room.on(LivekitClient.RoomEvent.Disconnected, (reason) => {
        updateStatus(`Room disconnected: ${reason}`);
      });

      await room.prepareConnection(sessionData.url, sessionData.access_token);
      updateStatus("Connection prepared");

      // Connect WebSocket after room preparation
      await connectWebSocket(sessionData.session_id);

      updateStatus("Session created successfully");
      chatBoxContainer.classList.remove("text_mode");
      chatBoxContainer.classList.add("voice_mode");

      if (SpeechRecognition) {
        startSpeechRecognitionSession();
        updateStatus("Speech Recognition Session started");
        updateMuteButton(isInputAudioMuted);
      } else {
        if (!audioRecorder) {
          deepgramSTT();
        }
        (async () => {
          await audioRecorder?.startRecording();
          updateMuteButton(!audioRecorder.audioRecording);
        })();

        if (!audioRecorder.audioRecording) {
          voiceErrorMessage();
        }
      }

      setTimeout(() => {
        startCountDown(parseInt(PLUGIN_OPTIONS.time_limit));
        if (!chatBoxContainer.classList.contains("avatarSessionStarted")) {
          chatBoxContainer.classList.add("avatarSessionStarted");
        }
        if (!avatarContainer.classList.contains("streamReady")) {
          avatarContainer.classList.add("streamReady");
        }
        if (avatarContainer.classList.contains("loading")) {
          avatarContainer.classList.remove("loading");
        }
      }, 2000);
    } else {
      if (avatarError) {
        avatarError.style.marginTop = "70px";
        avatarError.innerHTML =
          '<span style="padding:10px; line-height: 26px; ">No Token Found, Please reload this page and Try again.</span>';
        if (avatarContainer.classList.contains("loading")) {
          avatarContainer.classList.remove("loading");
        }
      }
    }
  }
  // Start streaming session
  async function startStreamingSession() {
    const startResponse = await fetch(
      `${AVANEW_AS_API_CONFIG.serverUrl}/v1/streaming.start`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          session_id: sessionData.session_id,
        }),
      }
    );

    // Connect to LiveKit room
    await room.connect(sessionData.url, sessionData.access_token);
    updateStatus("Connected to room");

    updateStatus("Streaming started successfully");
  }
  async function sendText(text, taskType = "chat") {
    if (!sessionData) {
      updateStatus("No active session");
      return;
    }

    const response = await fetch(
      `${AVANEW_AS_API_CONFIG.serverUrl}/v1/streaming.task`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          session_id: sessionData.session_id,
          text: text,
          task_type: taskType,
        }),
      }
    );

    updateStatus(`Sent text (${taskType}): ${text}`);
  }
  async function interruptAvatar() {
    if (!sessionData) {
      updateStatus("No active session");
      return;
    }
    try {
      const res = await fetch(
        `${AVANEW_AS_API_CONFIG.serverUrl}/v1/streaming.interrupt`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session_id: sessionData.session_id }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        console.error("🛑 Interrupt failed:", err);
        return false;
      }

      console.log("✅ Interrupt sent for session:", sessionData.session_id);
      return true;
    } catch (err) {
      console.error("🌐 Network error during interrupt:", err);
      return false;
    }
  }

  // Close session
  async function closeSession() {
    if (!sessionData) {
      updateStatus("No active session");
      return;
    }

    const response = await fetch(
      `${AVANEW_AS_API_CONFIG.serverUrl}/v1/streaming.stop`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          session_id: sessionData.session_id,
        }),
      }
    );

    // Close WebSocket
    if (webSocket) {
      webSocket.close();
    }
    // Disconnect from LiveKit room
    if (room) {
      room.disconnect();
    }
    if (recognition) {
      recognition.stop();
    }
    sessionData = null;
    room = null;
    mediaStream = null;
    sessionToken = null;

    if (SpeechRecognition) {
      stopSpeechRecognitionSession();
      updateMuteButton(isInputAudioMuted);
    } else if (audioRecorder) {
      if (audioRecorder.audioRecording) {
        await audioRecorder?.stopRecording();
      }
      updateMuteButton(!audioRecorder.audioRecording);
    } else {
    }

    if (mediaElement) {
      mediaElement.srcObject = null;
    }
    if (avatarError) {
      avatarError.style.marginTop = "0px";
      avatarError.innerHTML = "";
    }
    if (countdownTimer !== null) {
      clearInterval(countdownTimer);
      countdownElement.textContent = "Session ended";
      countdownElement.style.color = "red";
      if (countdownElement.classList.contains("session_expired")) {
        countdownElement.classList.remove("session_expired");
      }
      if (!countdownElement.classList.contains("session_ended")) {
        countdownElement.classList.add("session_ended");
      }
    }
    if (chatBoxContainer.classList.contains("avatarSessionStarted")) {
      chatBoxContainer.classList.remove("avatarSessionStarted");
    }
    if (chatBoxContainer.classList.contains("showTranscript")) {
      chatBoxContainer.classList.remove("showTranscript");
    }
    if (avatarContainer.classList.contains("streamReady")) {
      avatarContainer.classList.remove("streamReady");
    }
    if (avatarContainer.classList.contains("loading")) {
      avatarContainer.classList.remove("loading");
    }
    if (chatBoxContainer.classList.contains("talking")) {
      chatBoxContainer.classList.remove("talking");
    }
    chatBoxContainer.classList.remove("voice_mode");
    chatBoxContainer.classList.remove("text_mode");
    updateStatus("Session closed");
  }

  async function toggleInteractionMode() {
    let activeMode = chatBoxContainer.classList.contains("text_mode")
      ? "text_mode"
      : "voice_mode";
    if (activeMode === "voice_mode") {
      chatBoxContainer.classList.remove("voice_mode");
      chatBoxContainer.classList.add("text_mode");
      chatBoxContainer.classList.add("showTranscript");
      transcriptContainer.style.setProperty("display", "block");
      // Functionality To Close Voice Chat

      if (SpeechRecognition) {
        stopSpeechRecognitionSession();
        updateMuteButton(isInputAudioMuted);
      } else if (audioRecorder) {
        if (audioRecorder.audioRecording) {
          await audioRecorder?.stopRecording();
        }
        updateMuteButton(!audioRecorder.audioRecording);
      }
    } else {
      chatBoxContainer.classList.remove("text_mode");
      chatBoxContainer.classList.add("voice_mode");
      try {
        // Functionality To Start Voice Chat
        if (SpeechRecognition) {
          startSpeechRecognitionSession();
          updateMuteButton(isInputAudioMuted);
        } else if (audioRecorder) {
          if (!audioRecorder.audioRecording) {
            await audioRecorder?.startRecording();
          }
          updateMuteButton(!audioRecorder.audioRecording);
          if (!audioRecorder.audioRecording) {
            voiceErrorMessage();
          }
        }
      } catch (error) {
        voiceErrorMessage();
      }
    }
  }
  function voiceErrorMessage() {
    setTimeout(function () {
      toggleInteractionMode();
      if (avatarError) {
        avatarError.innerHTML = "";
      }
    }, 1000);
    if (avatarError) {
      avatarError.innerHTML = `<span style="padding:10px; ">Voice mode isn’t allowed now, so we’ll switch to chat mode instead! </span>`;
    }
  }

  function startCountDown(sessionDuration = 300) {
    countdownElement.style.display = "block";

    if (countdownElement.classList.contains("session_ended")) {
      countdownElement.classList.remove("session_ended");
    }

    if (countdownElement.classList.contains("session_expired")) {
      countdownElement.classList.remove("session_expired");
    }

    const sessionStartTime = Date.now();

    countdownTimer = setInterval(() => {
      const now = Date.now();
      const elapsedTime = Math.floor((now - sessionStartTime) / 1000);
      const remainingTime = sessionDuration - elapsedTime; // remaining time in seconds

      if (remainingTime <= 0) {
        countdownElement.textContent = "Session expired!";
        countdownElement.style.color = "red";
        if (countdownElement.classList.contains("session_ended")) {
          countdownElement.classList.remove("session_ended");
        }
        if (!countdownElement.classList.contains("session_expired")) {
          countdownElement.classList.add("session_expired");
        }
        if (countdownTimer !== null) {
          clearInterval(countdownTimer);
          countdownTimer = null;
        }
        closeSession();
        return;
      }

      if (questionnaires.length) {
        let question = questionnaires[0];
        let renderOn = isNaN(parseInt(question?.renderOn))
          ? 600
          : parseInt(question?.renderOn);
        if (elapsedTime >= renderOn && answerSubmit) {
          getAvatarQuestionnaire(question.id);
        }
      }

      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;

      countdownElement.textContent = `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }, 1000);
  }

  function closeOverlayQuestion() {
    overlayQuestionContainer.classList.remove("show");
    overlayQuestionContainer.removeAttribute("data-question-title");
    overlayQuestionContainer.removeAttribute("data-question-type");
    overlayQuestionContainer.removeAttribute("data-question_id");
    const removed = questionnaires.shift();
    if (removed) renderedQuestionnaires.push(removed);
    answerSubmit = true;
    return true;
  }
  async function overlayQuestionSubmit() {
    const questionTitle = overlayQuestionContainer.getAttribute(
      "data-question-title"
    );
    const questionType =
      overlayQuestionContainer.getAttribute("data-question-type");
    const question_id =
      overlayQuestionContainer.getAttribute("data-question_id");
    let selectedOptions = [];

    if (questionType === "checkbox") {
      const checkedBoxes = document.querySelectorAll(
        'input[name="questionOption"]:checked'
      );
      checkedBoxes.forEach((checkbox) => {
        selectedOptions.push(checkbox.value);
      });
    } else if (questionType === "radio") {
      const selectedRadio = document.querySelector(
        'input[name="questionOption"]:checked'
      );
      if (selectedRadio) {
        selectedOptions.push(selectedRadio.value);
      }
    }
    if (sessionData) {
      const text = `Question: ${questionTitle}, Answer: ${selectedOptions.join(
        ", "
      )}`;
      sendText(text, "chat");
      createParagraphElement("user");
      addTextToTranscript(text, "user", false);
    }
    if (ajaxurl) {
      return await fetch(ajaxurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "post_user_answer",
          session_id: sessionData?.session_id ?? "",
          access_token: sessionData?.access_token ?? "",
          question_id: question_id ?? "",
          title: questionTitle ?? "",
          answer: JSON.stringify(selectedOptions),
        }),
      })
        .then((response) => response.json())
        .then(async (res) => {
          if (res.success) {
            const removed = questionnaires.shift();
            if (removed) renderedQuestionnaires.push(removed);
            answerSubmit = true;
            overlayQuestionContainer.classList.remove("show");
          } else {
            answerSubmit = false;
          }
        })
        .catch((error) => {
          answerSubmit = false;
          console.error("There was an error!", error);
          return "";
        });
    }

    return "";
  }

  async function getAvatarQuestionnaires() {
    let avatar_studio_id = document.getElementById("avatar_studio_id")
      ? document.getElementById("avatar_studio_id").value
      : 0;
    if (!avatar_studio_id || isNaN(parseInt(avatar_studio_id))) {
      console.warn("No Avatar Studio ID found");
      return;
    }
    if (ajaxurl) {
      return await fetch(ajaxurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "get_avatar_studio_questionnaires",
          avatar_studio_id: avatar_studio_id,
        }),
      })
        .then((response) => response.json())
        .then(async (res) => {
          if (res.success && res?.data) {
            questionnaires = res?.data;
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
          return "";
        });
    }

    return "";
  }

  async function getAvatarQuestionnaire(id) {
    if (ajaxurl) {
      answerSubmit = false;
      return await fetch(ajaxurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "get_avatar_studio_questionnaire",
          id: id,
        }),
      })
        .then((response) => response.json())
        .then(async (res) => {
          if (res.success && res?.data?.questionnaire) {
            const options = res?.data?.options;
            const questionnaire = res.data.questionnaire;

            overlayQuestionContainer.setAttribute(
              "data-question-title",
              escapeHtmlAttribute(questionnaire.title)
            );
            overlayQuestionContainer.setAttribute(
              "data-question-type",
              questionnaire.questionType
            );
            overlayQuestionContainer.setAttribute(
              "data-question_id",
              questionnaire.id
            );

            document.querySelector(".overlayQuestion-title").textContent =
              questionnaire.title;
            const overlayQuestionBody = document.querySelector(
              ".overlayQuestion-body"
            );
            if (
              questionnaire.questionType == "radio" ||
              questionnaire.questionType == "checkbox"
            ) {
              if (options && options.length > 0) {
                let optionsHtml = "";
                options.forEach((option) => {
                  // Create radio or checkbox inputs based on question type
                  if (questionnaire.questionType === "checkbox") {
                    optionsHtml += `<div class="checkbox-option">
                    <input type="checkbox" name="questionOption" value="${option.option_title}" id="option-${option.id}">
                    <label for="option-${option.id}">${option.option_title}</label>
                  </div>`;
                  }
                  // For radio type, create radio inputs
                  else if (questionnaire.questionType === "radio")
                    optionsHtml += `<div class="radio-option">
                  <input type="radio" name="questionOption" value="${option.option_title}" id="option-${option.id}">
                  <label for="option-${option.id}">${option.option_title}</label>
                </div>`;
                });
                overlayQuestionBody.innerHTML = `<p>${questionnaire.description}</p>
              <div class="radio-options">${optionsHtml}</div>`;
              } else {
                overlayQuestionBody.innerHTML = `<p>${questionnaire.description}</p>`;
              }
            }
            // interruptAvatar();

            overlayQuestionContainer.classList.add("show");
          }
        })
        .catch((error) => {
          answerSubmit = true;
          console.error("There was an error!", error);
          return "";
        });
    }

    return "";
  }

  async function getAnswerFromRAG(
    question = "",
    language = "en",
    sessionId = sessionData.session_id
  ) {
    if (!question.trim()) {
      console.warn("Empty Question");
      return;
    }

    try {
      const res = await fetch(AVANEW_AS_API_CONFIG.RAG_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: question,
          lng: language || "en",
          sessionId: sessionId,
        }),
      });

      const result = await res.json();

      const message =
        (result?.results || result?.result?.Output?.results || "")
          .replace(/\\"/g, '"')
          .replace(/\\n/g, " ")
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/__([^_]+)__/g, "$1")
          .replace(/\s+/g, " ")
          .trim() || "";

      return message;
    } catch (error) {
      console.error("🔴 Error talking to AI agent:", error);
      return "";
    }
  }

  function createParagraphElement(role) {
    let className = `${role} transcript`;
    const transcriptElements = voiceTranscript.querySelectorAll(`.transcript`);
    let lastTranscriptElement =
      transcriptElements[transcriptElements.length - 1];
    if (
      lastTranscriptElement &&
      lastTranscriptElement.className == className &&
      lastTranscriptElement?.textContent?.trim() == ""
    ) {
      return;
    }

    let p = document.createElement("p");
    p.className = className;
    p.style.margin = "0px";
    p.style.padding = "5px 10px";
    p.style.borderRadius = "5px";
    p.style.backgroundColor = role == "avatar" ? "#f0f0f0" : "#d0f0c0";
    p.style.color = role == "avatar" ? "#000" : "#333";
    p.style.fontSize = "14px";
    p.style.lineHeight = "1.5";
    p.style.whiteSpace = "pre-wrap";
    p.style.wordBreak = "break-word";
    p.style.marginBottom = "5px";
    voiceTranscript.appendChild(p);
  }
  function addTextToTranscript(
    text,
    role = "avatar",
    chunk = false,
    timeStamp = new Date().toISOString()
  ) {
    if (transcriptContainer) {
      if (
        window.getComputedStyle(exportTranscriptToPDFButton).display === "none"
      ) {
        exportTranscriptToPDFButton.style.display = "inline";
      }
      if (
        window.getComputedStyle(sendTranscriptToEmailButton).display === "none"
      ) {
        sendTranscriptToEmailButton.style.display = "inline";
      }

      const transcriptElements = voiceTranscript.querySelectorAll(
        `.${role}.transcript`
      );
      let lastTranscriptElement = transcriptElements.length
        ? transcriptElements[transcriptElements.length - 1]
        : null;
      if (!lastTranscriptElement) {
        createParagraphElement(role);
        lastTranscriptElement = voiceTranscript.querySelectorAll(
          `.${role}.transcript`
        )[0];
      }
      lastTranscriptElement.setAttribute("data-timestamp", timeStamp);
      if (lastTranscriptElement) {
        if (chunk) {
          lastTranscriptElement.textContent += ` ${text}`;
        } else {
          if (
            !lastTranscriptElement.textContent ||
            lastTranscriptElement?.textContent.trim() != text.trim()
          ) {
            lastTranscriptElement.textContent = `${text}`;
          }
        }
      }
    }
  }
  function escapeHtmlAttribute(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function formatDateTime(isoString) {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  function formatTime(isoString) {
    const date = new Date(isoString);

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }
  function updateMuteButton(isAudioMuted) {
    const micIcon = document.getElementById("micIcon");
    if (micIcon) {
      micIcon.className = isAudioMuted
        ? "fa-solid fa-microphone-slash"
        : "fa-solid fa-microphone";
    }
    if (micToggle) micToggle.style.display = "block";
  }
});
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
