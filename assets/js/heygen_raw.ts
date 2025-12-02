import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  STTProvider,
  TaskType,
  VoiceEmotion,
} from "@heygen/streaming-avatar";
const PLUGIN_OPTIONS = window.PLUGIN_OPTIONS;
const videoElement = document.getElementById("avatarVideo") as HTMLVideoElement;
const startButton = document.getElementById(
  "startSession"
) as HTMLButtonElement;
const endButton = document.getElementById("endSession") as HTMLButtonElement;
const interruptTask = document.getElementById(
  "interruptTask"
) as HTMLButtonElement;
const micToggle = document.getElementById("micToggler") as HTMLButtonElement;
const cameraToggle = document.getElementById(
  "cameraToggler"
) as HTMLButtonElement;
const micIcon = document.getElementById("micIcon");
const switchInteractionMode = document.getElementById(
  "switchInteractionMode"
) as HTMLButtonElement;
const speakButton = document.getElementById("speakButton") as HTMLButtonElement;
const userInput = document.getElementById("userInput") as HTMLInputElement;

const chatBoxContainer = document.getElementById("chatBox") as HTMLDivElement;
const avatarContainer = document.querySelector(
  ".avatarContainer"
) as HTMLDivElement;
const avatarError = document.getElementById("avatarError") as HTMLDivElement;
const ajaxURL = document.getElementById("ajaxURL") as HTMLInputElement;
const heygenNonce = document.getElementById(
  "avatar_studio_nonce"
) as HTMLInputElement;
const avatar_studio_nonce = heygenNonce ? heygenNonce?.value : "";
const ajaxurl = ajaxURL ? ajaxURL?.value : "";

const chatOnly = startButton.getAttribute("chatOnly") === "1";
const videoEnable = startButton.getAttribute("videoEnable") === "1";

const transcriptContainer = document.getElementById(
  "transcriptContainer"
) as HTMLDivElement;
const voiceTranscript = document.getElementById(
  "voiceTranscript"
) as HTMLDivElement;
const exportTranscriptToPDFButton = document.getElementById(
  "exportTranscriptToPDF"
) as HTMLButtonElement;
const sendTranscriptToEmailButton = document.getElementById(
  "sendTranscriptToEmail"
) as HTMLButtonElement;
const overlayQuestionContainer = document.getElementById(
  "overlayQuestion"
) as HTMLDivElement;
const overlayQuestionSubmitButton = document.getElementById(
  "overlayQuestionSubmit"
) as HTMLButtonElement;
const closeOverlayQuestionButton = document.getElementById(
  "closeOverlayQuestion"
) as HTMLButtonElement;
const countdownElement = document.getElementById(
  "streamingCountdown"
) as HTMLDivElement;

let avatar: StreamingAvatar | null = null;
let sessionData: any = null;
let tokenCall: number = 0;
let userTalkingText: string = "";
let avatarTalkingText: string = "";
let countdownTimer: NodeJS.Timeout | null = null;

let questionnaires: object[] = [];
let renderedQuestionnaires: object[] = [];

let answerSubmit: boolean = true;

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
  const question_id = overlayQuestionContainer.getAttribute("data-question_id");
  let selectedOptions = [];

  if (questionType === "checkbox") {
    const checkedBoxes = document.querySelectorAll(
      'input[name="questionOption"]:checked'
    );
    checkedBoxes.forEach((checkbox) => {
      selectedOptions.push((checkbox as HTMLInputElement).value);
    });
  } else if (questionType === "radio") {
    const selectedRadio = document.querySelector(
      'input[name="questionOption"]:checked'
    ) as HTMLInputElement;
    if (selectedRadio) {
      selectedOptions.push(selectedRadio.value);
    }
  }
  if (avatar) {
    await avatar.speak({
      text: `${questionTitle} and user answer is ${selectedOptions.join(",")}`,
    });
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
          console.log("questionnaires", questionnaires);
          console.log("renderedQuestionnaires", renderedQuestionnaires);
          answerSubmit = true;
          overlayQuestionContainer!.classList.remove("show");
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

async function getAvatarQuestionnaires(): Promise<any> {
  const avatarStudioIdElem = document.getElementById(
    "avatar_studio_id"
  ) as HTMLInputElement | null;
  let avatar_studio_id = avatarStudioIdElem ? avatarStudioIdElem.value : "0";
  if (!avatar_studio_id || isNaN(parseInt(String(avatar_studio_id)))) {
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

async function getAvatarQuestionnaire(id: any): Promise<any> {
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

          document.querySelector(".overlayQuestion-title")!.textContent =
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
              options.forEach((option: any) => {
                if (questionnaire.questionType === "checkbox") {
                  optionsHtml += `<div class="checkbox-option">
                    <input type="checkbox" name="questionOption" value="${option.option_title}" id="option-${option.id}">
                    <label for="option-${option.id}">${option.option_title}</label>
                  </div>`;
                } else if (questionnaire.questionType === "radio")
                  optionsHtml += `<div class="radio-option">
                  <input type="radio" name="questionOption" value="${option.option_title}" id="option-${option.id}">
                  <label for="option-${option.id}">${option.option_title}</label>
                </div>`;
              });
              overlayQuestionBody!.innerHTML = `<p>${questionnaire.description}</p>
              <div class="radio-options">${optionsHtml}</div>`;
            } else {
              overlayQuestionBody!.innerHTML = `<p>${questionnaire.description}</p>`;
            }
          }

          /* handleInterrupt(); */
          overlayQuestionContainer!.classList.add("show");
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
async function fetchAccessToken(): Promise<string> {
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

async function initializeAvatarSession() {
  tokenCall = 0;
  if (avatarError) {
    avatarError.style.marginTop = "0px";
    avatarError.innerHTML = "";
  }
  if (!avatarContainer.classList.contains("loading")) {
    avatarContainer.classList.add("loading");
  }

  getAvatarQuestionnaires();
  const token = await fetchAccessToken();
  if (token && token != "") {
    fetch(ajaxurl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "insert_avatar_studio_user",
        provider: "heygen",
        token: token,
      }),
    });
    avatar = new StreamingAvatar({ token });

    /**
     *
     */
    avatar.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
      console.log("Avatar started talking", e);
      if (avatarContainer.classList.contains("loading")) {
        avatarContainer.classList.remove("loading");
      }
    });
    avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
      console.log("Avatar stopped talking", e);
    });

    avatar.on(StreamingEvents.STREAM_READY, handleStreamReady);
    avatar.on(StreamingEvents.STREAM_DISCONNECTED, handleStreamDisconnected);

    avatar.on(StreamingEvents.USER_START, (event) => {
      console.log(">>>>> User started talking:", event);
      userTalkingText = "";
      if (!chatBoxContainer.classList.contains("talking")) {
        chatBoxContainer.classList.add("talking");
      }
    });
    avatar.on(StreamingEvents.USER_STOP, (event) => {
      console.log(">>>>> User stopped talking:", event);
      if (chatBoxContainer.classList.contains("talking")) {
        chatBoxContainer.classList.remove("talking");
      }
    });
    avatar.on(StreamingEvents.USER_SILENCE, () => {
      console.log("User is silent");
    });
    avatar.on(StreamingEvents.USER_TALKING_MESSAGE, (event: any) => {
      const chunk = event?.detail?.message ?? "";
      userTalkingText += ` ${chunk}`;
      createParagraphElement("user");
      addTextToTranscript(chunk, "user", false);

      console.log("🗣️ USER_TALKING_MESSAGE:", chunk, event.timeStamp);
    });

    avatar.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (event: any) => {
      const chunk = event?.detail?.message ?? "";
      avatarTalkingText += ` ${chunk}`;
    });
    avatar.on(StreamingEvents.USER_END_MESSAGE, (event: any) => {
      let userFullMessage = userTalkingText.trim();
      console.log("USER_END_MESSAGE", event, userFullMessage);
      userTalkingText = "";
    });
    avatar.on(StreamingEvents.AVATAR_END_MESSAGE, (event: any) => {
      const avatarFullMessage = avatarTalkingText.trim();
      console.log("AVATAR_END_MESSAGE", event, avatarFullMessage);
      if (avatarFullMessage.length > 0) {
        createParagraphElement("avatar");
        addTextToTranscript(avatarFullMessage, "avatar", false);
        avatarTalkingText = "";
      }
    });
    /**
     *
     */

    var avatarId = startButton.getAttribute("aid");
    var knowledgeId = startButton.getAttribute("kid");
    var language = startButton.getAttribute("language");
    var opening_text = startButton.getAttribute("opening_text");

    opening_text =
      opening_text && opening_text != ""
        ? opening_text
        : "Hello, how can I help you?";
    avatarId = avatarId ? avatarId : "Ann_Therapist_public";
    knowledgeId = knowledgeId ? knowledgeId : "";
    language = language && language != "null" ? language : "en";

    let emotion = VoiceEmotion.EXCITED;
    if (PLUGIN_OPTIONS?.voice_emotion) {
      if (PLUGIN_OPTIONS?.voice_emotion == "excited") {
        emotion = VoiceEmotion.EXCITED;
      } else if (PLUGIN_OPTIONS?.voice_emotion == "serious") {
        emotion = VoiceEmotion.SERIOUS;
      } else if (PLUGIN_OPTIONS?.voice_emotion == "friendly") {
        emotion = VoiceEmotion.FRIENDLY;
      } else if (PLUGIN_OPTIONS?.voice_emotion == "soothing") {
        emotion = VoiceEmotion.SOOTHING;
      } else if (PLUGIN_OPTIONS?.voice_emotion == "broadcaster") {
        emotion = VoiceEmotion.BROADCASTER;
      }
    }

    sessionData = await avatar.createStartAvatar({
      quality: AvatarQuality.High,
      avatarName: avatarId,
      knowledgeId: knowledgeId,
      voice: {
        rate: 1.5,
        emotion: emotion,
      },
      language: language,
      sttSettings: {
        provider: STTProvider.DEEPGRAM,
        confidence: 0.55,
      },
      /* voiceChatTransport: VoiceChatTransport.WEBSOCKET, */
      /* voiceChatTransport: VoiceChatTransport.LIVEKIT,*/
      useSilencePrompt: false,
      disableIdleTimeout: true,
      activityIdleTimeout: 180,
    });

    voiceTranscript.innerHTML = "";
    exportTranscriptToPDFButton.style.display = "none";
    sendTranscriptToEmailButton.style.display = "none";
    console.log("Session data:", sessionData);

    try {
      if (!chatOnly) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            console.log("Microphone access granted.", stream);
          })
          .catch((err) => {
            console.error("Permission denied or error:", err);
          });

        await avatar.startVoiceChat({ isInputAudioMuted: false });
        await avatar.speak({
          text: opening_text,
          task_type: TaskType.REPEAT,
        });
        chatBoxContainer.classList.remove("text_mode");
        chatBoxContainer.classList.add("voice_mode");

        if (micIcon) {
          micIcon.className = avatar?.isInputAudioMuted
            ? "fa-solid fa-microphone-slash"
            : "fa-solid fa-microphone";
        }
        if (micToggle) micToggle.style.display = "block";
        if (cameraToggle && videoEnable) cameraToggle.style.display = "none";
      } else {
        chatBoxContainer.classList.add("text_mode");
        chatBoxContainer.classList.add("showTranscript");
        transcriptContainer.style.setProperty("display", "block");
        switchInteractionMode.style.display = "none";
      }
    } catch (error: any) {
      setTimeout(function () {
        toggleInteractionMode();
        if (avatarError) {
          avatarError.innerHTML = "";
        }
      }, 1000);
      if (avatarError) {
        avatarError.innerHTML = `<span style="padding:10px; ">Voice mode isn’t allowed now, so we’ll switch to text mode instead! </span>`;
      }
    }
    startCountDown(PLUGIN_OPTIONS?.time_limit);
    if (!chatBoxContainer.classList.contains("avatarSessionStarted")) {
      chatBoxContainer.classList.add("avatarSessionStarted");
    }
    if (avatarContainer.classList.contains("loading")) {
      avatarContainer.classList.remove("loading");
    }
    if (!avatarContainer.classList.contains("streamReady")) {
      avatarContainer.classList.add("streamReady");
    }
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

function handleStreamReady(event: any) {
  console.log(">>>>> Stream ready:", event);
  if (event.detail && videoElement) {
    videoElement.srcObject = event.detail;
    videoElement.onloadedmetadata = () => {
      videoElement.play().catch(console.error);
    };
  } else {
    console.error("Stream is not available");
  }
}

function handleStreamDisconnected() {
  console.log("Stream disconnected");
  if (videoElement) {
    videoElement.srcObject = null;
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
}

async function terminateAvatarSession() {
  if (!avatar || !sessionData) return;

  await avatar.stopAvatar();
  videoElement.srcObject = null;
  avatar = null;
  if (avatarError) {
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
}

async function handleInterrupt() {
  if (avatar) {
    await avatar.interrupt();
  }
}
function handleMuteAudio() {
  if (avatar && micToggle) {
    avatar.isInputAudioMuted
      ? avatar.unmuteInputAudio()
      : avatar.muteInputAudio();
    if (micIcon) {
      micIcon.className = avatar?.isInputAudioMuted
        ? "fa-solid fa-microphone-slash"
        : "fa-solid fa-microphone";
    }
    micToggle.style.display = "block";
  }
}

async function handleSpeak() {
  if (avatar && userInput.value) {
    await avatar.speak({
      text: userInput.value,
      task_type: TaskType.TALK,
    });
    userInput.value = "";
  }
}
function createParagraphElement(role: string) {
  let className = `${role} transcript`;
  const transcriptElements = voiceTranscript.querySelectorAll(`.transcript`);
  let lastTranscriptElement = transcriptElements[transcriptElements.length - 1];
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
  text: string,
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

async function toggleInteractionMode() {
  let activeMode = chatBoxContainer.classList.contains("text_mode")
    ? "text_mode"
    : "voice_mode";
  if (activeMode === "voice_mode") {
    chatBoxContainer.classList.remove("voice_mode");
    chatBoxContainer.classList.add("text_mode");
    chatBoxContainer.classList.add("showTranscript");
    transcriptContainer.style.setProperty("display", "block");
    avatar?.muteInputAudio();
    avatar?.closeVoiceChat();
    if (avatar && micToggle) {
      if (micIcon) {
        micIcon.className = avatar?.isInputAudioMuted
          ? "fa-solid fa-microphone-slash"
          : "fa-solid fa-microphone";
      }
      micToggle.style.display = "block";
    }
  } else {
    chatBoxContainer.classList.remove("text_mode");
    chatBoxContainer.classList.add("voice_mode");
    try {
      await avatar?.startVoiceChat({ isInputAudioMuted: false });
      avatar?.unmuteInputAudio();
      if (avatar && micToggle) {
        if (micIcon) {
          micIcon.className = avatar?.isInputAudioMuted
            ? "fa-solid fa-microphone-slash"
            : "fa-solid fa-microphone";
        }
        micToggle.style.display = "block";
      }
    } catch (error: any) {
      setTimeout(function () {
        toggleInteractionMode();
        if (avatarError) {
          avatarError.innerHTML = "";
        }
      }, 1000);
      if (avatarError) {
        avatarError.innerHTML = `<span style="padding:10px; ">Voice mode isn’t allowed now, so we’ll switch to text mode instead! </span>`;
      }
    }
  }
}

/* * Countdown timer for session expiration */

function startCountDown(sessionDuration = 300) {
  countdownElement.style.display = "block";

  if (!sessionDuration) {
    sessionDuration = 300;
  }
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
    const remainingTime = sessionDuration - elapsedTime;

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
      terminateAvatarSession();
      return;
    }

    if (questionnaires.length) {
      let question: any = questionnaires[0];
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

if (startButton) {
  startButton.addEventListener("click", initializeAvatarSession);
}
if (endButton) {
  endButton.addEventListener("click", terminateAvatarSession);
}
if (interruptTask) {
  interruptTask.addEventListener("click", handleInterrupt);
}
if (micToggle) {
  micToggle.addEventListener("click", handleMuteAudio);
}

if (speakButton) {
  speakButton.addEventListener("click", handleSpeak);
}
if (switchInteractionMode && !chatOnly) {
  switchInteractionMode.addEventListener("click", toggleInteractionMode);
}

if (overlayQuestionSubmitButton) {
  overlayQuestionSubmitButton.addEventListener("click", overlayQuestionSubmit);
}
if (closeOverlayQuestionButton) {
  closeOverlayQuestionButton.addEventListener("click", closeOverlayQuestion);
}

if (userInput) {
  userInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      handleSpeak();
    }
  });
}

function escapeHtmlAttribute(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
