(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) a(s);
  new MutationObserver((s) => {
    for (const o of s)
      if (o.type === "childList")
        for (const h of o.addedNodes)
          h.tagName === "LINK" && h.rel === "modulepreload" && a(h);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(s) {
    const o = {};
    return (
      s.integrity && (o.integrity = s.integrity),
      s.referrerPolicy && (o.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === "use-credentials"
        ? (o.credentials = "include")
        : s.crossOrigin === "anonymous"
        ? (o.credentials = "omit")
        : (o.credentials = "same-origin"),
      o
    );
  }
  function a(s) {
    if (s.ep) return;
    s.ep = !0;
    const o = t(s);
    fetch(s.href, o);
  }
})();
const F = "",
  q = "",
  H = "",
  x = {
    STOP: "conversation.user.stopped_speaking",
    START: "conversation.user.started_speaking",
  },
  L = { PRODUCTION: "production", DEVELOPMENT: "development" },
  w = L.PRODUCTION,
  d = document.getElementById("avatarVideo"),
  r = document.getElementById("userVideo"),
  m = document.querySelector(".avatarContainer"),
  c = document.getElementById("startSession"),
  v = document.getElementById("endSession"),
  u = document.getElementById("micToggler"),
  p = document.getElementById("cameraToggler"),
  C = document.getElementById("switchInteractionMode"),
  T = document.getElementById("input-container"),
  M = document.getElementById("userInput"),
  A = document.getElementById("send-btn"),
  R = document.getElementById("streamingCountdown"),
  _ = c.getAttribute("chatOnly") === "1",
  G = c.getAttribute("videoEnable") === "1";
c.getAttribute("timer");
const y = document.getElementsByClassName("language-switcher")[0],
  n = document.getElementById("chatBox"),
  V = document.querySelector("#listeningIcon"),
  J = document.getElementById("chatBox-close"),
  k = document.querySelector("#transcriptContainer"),
  j = document.querySelector("#voiceTranscript");
document.querySelector("#exportTranscriptToPDF");
let N = document.getElementById("ajaxURL");
const D = N ? N?.value : "";
let S = null,
  I = null,
  l = null;
const W = async (i, e) => {
    try {
      await i.daily.sendAppMessage(
        {
          message_type: "conversation",
          event_type: "conversation.respond",
          conversation_id: i.conversationId,
          properties: { text: e },
        },
        "*"
      );
    } catch (t) {
      console.error("Error while sending text to the avatar", { cause: t });
    }
  },
  Y = () => {
    if (!w.trim()) {
      console.warn("Please specify the Project mode");
      return;
    }
    let i, e;
    return (
      (i = c.getAttribute("timer") || 300),
      (e = b()),
      {
        timer: i,
        local_language: e,
        mode: w,
        local_api_key: F,
        local_avatar_id: q,
        local_knowledge_id: H,
      }
    );
  },
  Q = Y();
class X {
  constructor() {
    (this.apiKey = F),
      (this.personaId = H),
      (this.replicaId = q),
      (this.daily = null),
      (this.transcript = []),
      (this.showChatBox = !1),
      (this.isConnected = !1),
      (this.isConnecting = !1),
      (this.isMicMuted = !1),
      (this.isCameraMuted = !1),
      (this.showTranscript = !1),
      (this.conversationUrl = null),
      (this.conversationId = null),
      (this.isUserSpeaking = !1),
      (this.speechRecognition = null),
      (this.isListening = !1),
      (this.speechRecognitionSupported =
        "webkitSpeechRecognition" in window || "SpeechRecognition" in window),
      (this.lastProcessedMessageId = null),
      (this.avatarMessagePollingInterval = null),
      (this.timerSeconds = Q.timer),
      (this.remainingSeconds = 0),
      (this.timerInterval = null),
      this.initializeButtons(),
      this.updateUIState();
  }
  async checkForNewAvatarMessages() {
    if (this.conversationId)
      try {
        const e = await fetch(
          `https://tavusapi.com/v2/conversations/${this.conversationId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": this.apiKey,
            },
          }
        );
        if (e.ok) {
          const t = await e.json();
          t.messages &&
            t.messages.length > 0 &&
            (t.messages
              .filter((s) =>
                this.lastProcessedMessageId
                  ? s.id > this.lastProcessedMessageId && s.role === "assistant"
                  : s.role === "assistant"
              )
              .forEach((s) => {
                s.content &&
                  (console.log("🤖 AVATAR SPEAKING:", s.content),
                  console.log(
                    `🤖 AVATAR [${new Date().toLocaleTimeString()}]:`,
                    s.content
                  ));
              }),
            t.messages.length > 0 &&
              (this.lastProcessedMessageId = Math.max(
                ...t.messages.map((s) => s.id || 0)
              )));
        }
      } catch (e) {
        console.error("Error checking for avatar messages:", e);
      }
  }
  startTimer(e = 30) {
    this.endTimer(),
      (this.remainingSeconds = e),
      this.updateTimerDisplay(),
      (this.timerInterval = setInterval(() => {
        this.remainingSeconds--,
          this.updateTimerDisplay(),
          this.remainingSeconds <= 0 &&
            (this.endTimer(),
            this.endConversation(),
            this.updateStatus("⏰ Timer ended – conversation time is up!"));
      }, 1e3));
  }
  endTimer() {
    this.timerInterval &&
      (clearInterval(this.timerInterval), (this.timerInterval = null));
  }
  resetTimer() {
    this.endTimer(),
      (this.remainingSeconds = this.timerSeconds),
      this.updateTimerDisplay();
  }
  updateTimerDisplay() {
    if (!R) return;
    const e = Math.floor(this.remainingSeconds / 60),
      t = this.remainingSeconds % 60;
    R.textContent = `${e}:${t.toString().padStart(2, "0")}`;
  }
  initializeButtons() {
    c && c.addEventListener("click", () => this.startConversation()),
      v && v.addEventListener("click", () => this.endConversation()),
      u && u.addEventListener("click", () => this.toggleMicrophone()),
      p && p.addEventListener("click", () => this.toggleCamera());
  }
  updateUIState() {
    m &&
      (this.isConnecting
        ? (m.classList.add("loading"),
          m.classList.remove("streamReady"),
          n.classList.remove(
            "avatarSessionStarted",
            "text_mode",
            "voice_mode",
            "talking"
          ),
          c && (c.disabled = !0),
          y && y.classList.add("hide"))
        : this.isConnected
        ? (m.classList.remove("loading"),
          m.classList.add("streamReady"),
          n.classList.add("avatarSessionStarted"),
          _
            ? (n.classList.remove("voice_mode"),
              n.classList.add("text_mode"),
              n.classList.add("showTranscript"),
              k.style.setProperty("display", "block"),
              (C.style.display = "none"))
            : (n.classList.remove("text_mode"),
              n.classList.add("voice_mode"),
              (C.style.display = "block")),
          c && (c.disabled = !1),
          this.updateMicButtonState(),
          this.updateCameraButtonState())
        : (m.classList.remove("loading", "streamReady"),
          n.classList.remove(
            "avatarSessionStarted",
            "text_mode",
            "voice_mode",
            "talking"
          ),
          c && (c.disabled = !1)),
      v && (v.disabled = !this.isConnected));
  }
  appendMessage(e, t) {
    const a = e === "user" ? "right" : "left",
      s = [...this.transcript];
    (this.transcript = [...s, { role: e, speech: t }]),
      j.insertAdjacentHTML(
        "beforeend",
        `<div class="chat-message transcript ${e} ${a}">
        <p>${t}</p>
      </div>`
      );
  }
  updateMicButtonState() {
    const e = document.getElementById("micIcon");
    e &&
      (e.className = this.isMicMuted
        ? "fa-solid fa-microphone-slash"
        : "fa-solid fa-microphone"),
      u && (u.style.display = "flex");
  }
  updateCameraButtonState() {
    const e = document.getElementById("cameraIcon");
    e &&
      (e.className = this.isCameraMuted
        ? "fa-solid fa-video-slash"
        : "fa-solid fa-video"),
      r &&
        (this.isCameraMuted
          ? r.classList.add("hide")
          : r.classList.remove("hide")),
      p && (p.style.display = "flex");
  }
  async createConversation() {
    try {
      let e;
      if (
        (w === L.DEVELOPMENT || (w === L.PRODUCTION && (e = await Z())), !e.ok)
      ) {
        const a = await e.json();
        throw new Error(a.error || "Failed to create conversation");
      }
      const t = await e.json();
      return (
        (this.transcript = []),
        (j.innerHTML = ""),
        (this.conversationUrl = t.conversation_url),
        (this.conversationId = t.conversation_id),
        console.log("Conversation created:", t),
        fetch(D, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            action: "insert_avatar_studio_user",
            provider: "tavus",
            token: t.conversation_id,
          }),
        }),
        t
      );
    } catch (e) {
      throw (
        (console.error("Error creating conversation:", e),
        this.updateStatus(`Error: ${e.message}`, !0),
        e)
      );
    }
  }
  async getFrontCameraDeviceId() {
    try {
      await navigator.mediaDevices.getUserMedia({ video: !0, audio: !0 });
      const t = (await navigator.mediaDevices.enumerateDevices()).filter(
        (s) => s.kind === "videoinput"
      );
      console.log(
        "📹 Available cameras:",
        t.map((s) => ({ id: s.deviceId, label: s.label }))
      );
      let a = t.find((s) => s.label.toLowerCase().includes("front"));
      return (
        a || (a = t.find((s) => s.label.toLowerCase().includes("user"))),
        !a && t.length > 1 && (a = t[1]),
        !a && t.length > 0 && (a = t[0]),
        a
          ? (console.log("✅ Selected front camera:", a.label, a.deviceId),
            a.deviceId)
          : null
      );
    } catch (e) {
      return console.error("❌ Error getting camera devices:", e), null;
    }
  }
  async startConversation() {
    try {
      (this.isConnecting = !0),
        this.updateUIState(),
        await this.createConversation(),
        (this.daily = DailyIframe.createCallObject({
          showLeaveButton: !1,
          showFullscreenButton: !1,
        })),
        this.setupEventListeners();
      const e = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent),
        t = /Android/i.test(navigator.userAgent);
      if (e)
        if ((console.log("📱 Mobile detected → setting up front camera"), t)) {
          console.log("🤖 Android detected - using enhanced camera selection");
          const a = await this.getFrontCameraDeviceId();
          a
            ? (await this.daily.setInputDevicesAsync({
                videoDeviceId: a,
                audioDeviceId: "default",
              }),
              console.log("✅ Android front camera set with device ID:", a))
            : (await this.daily.setInputDevicesAsync({
                videoDeviceId: { facingMode: "user" },
                audioDeviceId: "default",
              }),
              console.log("✅ Android front camera set with facingMode"));
        } else
          await this.daily.setInputDevicesAsync({
            videoDeviceId: { facingMode: "user" },
            audioDeviceId: "default",
          }),
            console.log("✅ iOS front camera set");
      else
        console.log("💻 Desktop detected → using default devices"),
          await this.daily.setInputDevicesAsync({
            videoDeviceId: "default",
            audioDeviceId: "default",
          });
      await this.daily.join({
        url: this.conversationUrl,
        userName: "User",
        startVideoOff: !1,
        startAudioOff: !1,
      }),
        (this.transcript = []),
        console.log("✅ Joined conversation"),
        this.updateStatus("🔄 Waiting for avatar to join...");
    } catch (e) {
      console.error("Error starting conversation:", e),
        this.updateStatus(`Error: ${e.message}`, !0),
        (this.isConnecting = !1),
        this.updateUIState();
    }
  }
  async endConversation() {
    try {
      this.endTimer(),
        this.resetTimer(),
        this.daily &&
          (await this.daily.leave(), this.daily.destroy(), (this.daily = null)),
        (this.isConnected = !1),
        (this.isConnecting = !1),
        (this.isMicMuted = !1),
        (this.isCameraMuted = !1),
        (this.conversationUrl = null),
        (this.conversationId = null),
        (this.lastProcessedMessageId = null),
        this.updateUIState(),
        this.updateStatus("Conversation ended. Ready to start a new one."),
        d && (d.srcObject = null),
        r && ((r.srcObject = null), r.classList.add("hide")),
        (S = null),
        (I = null),
        (l = null),
        u && (u.style.display = "none"),
        p && (p.style.display = "none"),
        this.endTimer(),
        y && y.classList.remove("hide");
    } catch (e) {
      console.error("Error ending conversation:", e),
        this.updateStatus(`Error ending conversation: ${e.message}`, !0);
    }
  }
  async toggleMicrophone() {
    this.daily &&
      ((this.isMicMuted = !this.isMicMuted),
      this.isMicMuted && V && V.classList.add("hide"),
      await this.daily.setLocalAudio(!this.isMicMuted),
      this.updateMicButtonState(),
      this.updateStatus(
        `🎤 Microphone ${this.isMicMuted ? "muted" : "unmuted"}`
      ));
  }
  async toggleCamera() {
    this.daily &&
      ((this.isCameraMuted = !this.isCameraMuted),
      await this.daily.setLocalVideo(!this.isCameraMuted),
      this.updateCameraButtonState(),
      this.updateStatus(
        `📹 Camera ${this.isCameraMuted ? "turned off" : "turned on"}`
      ));
  }
  async setupUserVideo() {
    try {
      const t = this.daily.participants().local;
      t &&
        t.video &&
        ((l = t.video.track),
        this.handleUserVideoTrack(l),
        console.log("✅ User video track setup:", {
          enabled: l?.enabled,
          muted: l?.muted,
          readyState: l?.readyState,
        }));
    } catch (e) {
      console.error("Error setting up user video:", e);
    }
  }
  handleUserVideoTrack(e) {
    if (r && e) {
      const t = new MediaStream([e]);
      (r.srcObject = t),
        (r.muted = !0),
        (r.onloadedmetadata = () => r.play().catch(console.error)),
        console.log("User video track setup complete");
    }
  }
  setupEventListeners() {
    this.daily.on("joined-meeting", async () => {
      (this.isConnected = !0),
        (this.isConnecting = !1),
        this.updateUIState(),
        this.updateStatus("🔄 Waiting for avatar to join...");
      try {
        _ ||
          (await this.daily.setLocalAudio(!0),
          G && (await this.daily.setLocalVideo(!0)));
        const t = this.daily.participants().local?.video;
        console.log("📹 Camera status after join:", {
          hasVideo: !!t,
          videoState: t?.state,
          trackEnabled: t?.track?.enabled,
        });
      } catch (e) {
        console.warn("Could not verify media immediately:", e);
      }
      this.setupUserVideo();
    }),
      this.daily.on("participant-joined", (e) => {
        const t = e.participant;
        !t.local &&
          t.user_id.includes("tavus-replica") &&
          (this.startTimer(this.timerSeconds),
          r && r.classList.remove("hide"),
          this.updateStatus("🤖 Avatar joined the conversation!"),
          console.log("🤖 Avatar joined - checking video feed availability"));
      }),
      this.daily.on("participant-updated", (e) => {
        const t = e.participant;
        !t.local &&
          t.user_name.includes("Replica") &&
          this.handleAvatarVideoTrack(t),
          t.local &&
            t.video &&
            console.log("📹 Local video updated:", {
              state: t.video.state,
              hasTrack: !!t.video.track,
            });
      }),
      this.daily.on("track-started", (e) => {
        const { participant: t, track: a } = e;
        !t.local && a.kind === "video" && (I = a),
          !t.local &&
            a.kind === "audio" &&
            ((S = a), this.setupAvatarAudioAnalysis(a)),
          I && S && this.handleAvatarVideoTrack(I, S),
          t.local &&
            a.kind === "video" &&
            ((l = a),
            this.handleUserVideoTrack(a),
            console.log("✅ Local video track started successfully"));
      }),
      this.daily.on("app-message", (e) => {
        if (
          (e?.data?.event_type === x.START
            ? (n.classList.add("talking"), (this.isUserSpeaking = !0))
            : e?.data?.event_type === x.STOP &&
              ((this.isUserSpeaking = !1), n.classList.remove("talking")),
          e?.data?.message_type === "conversation" &&
            e?.data?.properties &&
            e?.data?.properties?.role)
        ) {
          const { role: t, speech: a } = e?.data?.properties;
          a && this.appendMessage(t, a);
        }
      }),
      this.daily.on("participant-left", (e) => {
        e.participant.user_name.includes("Replica") &&
          this.updateStatus("🤖 Avatar left the conversation");
      }),
      this.daily.on("error", (e) => {
        console.error("Daily error:", e),
          this.updateStatus(`Error: ${e.message}`, !0),
          (this.isConnected = !1),
          (this.isConnecting = !1),
          this.updateUIState();
      });
  }
  setupAvatarAudioAnalysis(e) {
    try {
      const t = new (window.AudioContext || window.webkitAudioContext)();
      t.state === "suspended" && t.resume().catch(console.error);
      const a = new MediaStream([e]),
        s = t.createMediaStreamSource(a),
        o = t.createAnalyser();
      (o.fftSize = 256), s.connect(o);
      const h = o.frequencyBinCount,
        B = new Uint8Array(h);
      let g = !1,
        E = null;
      const P = 30,
        K = 300,
        O = () => {
          o.getByteFrequencyData(B);
          const U = B.reduce((f, z) => f + z, 0) / h;
          if (U > P && !g) (g = !0), (E = Date.now());
          else if (U <= P && g) {
            const f = Date.now() - E;
            f > K && console.log(`🤖 AVATAR AUDIO: Finished speaking (${f}ms)`),
              (g = !1),
              (E = null);
          }
          this.isConnected && requestAnimationFrame(O);
        };
      O();
    } catch (t) {
      console.error("Error setting up avatar audio analysis:", t);
    }
  }
  handleAvatarVideoTrack(e, t) {
    if (d && e) {
      const a = new MediaStream([e, t]);
      (d.srcObject = a),
        (d.muted = !1),
        (d.onloadedmetadata = () => d.play().catch(console.error)),
        this.updateStatus("🤖 Avatar is ready! You can start talking.");
    }
  }
  updateStatus(e, t = !1) {
    console.log(`Status: ${e}`), t && console.error(`Error: ${e}`);
  }
  toggleTranscriptBox() {
    this.showTranscript = !this.showTranscript;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const i = new X();
  M.addEventListener("input", (t) => {
    A.disabled = !t.target.value.trim();
  });
  const e = async () => {
    let t = n.classList.contains("text_mode") ? "text_mode" : "voice_mode";
    if (!i.daily) return;
    t === "voice_mode"
      ? (n.classList.remove("voice_mode"),
        n.classList.add("text_mode"),
        n.classList.add("showTranscript"),
        k.style.setProperty("display", "block"))
      : (n.classList.remove("text_mode"), n.classList.add("voice_mode"));
    const a = !!n.classList.contains("voice_mode");
    (i.isMicMuted = !a),
      (i.isCameraMuted = !a),
      (u.disabled = !a),
      await i.daily.setLocalAudio(a),
      i.updateMicButtonState(),
      i.updateCameraButtonState(),
      i.updateStatus(`🎤 Microphone ${i.isMicMuted ? "muted" : "unmuted"}`),
      (i.showChatBox = !a),
      k && (i.showTranscript = !0),
      T && (T.classList.toggle("show", !a), T.classList.toggle("hide", a));
  };
  C && !_ && C.addEventListener("click", async () => await e()),
    M.addEventListener("keydown", async (t) => {
      t.key === "Enter" && (await $(i));
    }),
    A.addEventListener("click", async () => await $(i)),
    J.addEventListener("click", () => i.endConversation());
});
async function $(i) {
  try {
    const e = M.value.trim();
    if (!e) return;
    await W(i, e), (M.value = ""), (A.disabled = !0);
  } catch (e) {
    console.error("Error while working with the sending message", { cause: e });
  }
}
async function Z() {
  if (D) {
    console.log("getLanguage", b());
    let i = document.getElementById("pageId"),
      e = document.getElementById("avatarStudioId");

    const userInfo = localStorage.getItem("userInfo");
    console.log("user Info", userInfo);
    return await fetch(D, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "avatar_studio_tavusConversation",
        language: b(),
        userInfo: typeof userInfo === "string" ? userInfo : "",
        page_id: i ? i.value : 0,
        avatar_studio_id: e ? e.value : 0,
      }),
    })
      .then((t) => t)
      .catch(
        (t) => (
          console.error(
            "There was an error while creating converstioan on PRODUCTION!",
            t
          ),
          null
        )
      );
  }
  return null;
}
function b() {
  let i = c.getAttribute("language");
  return (
    (i = i && i != "null" ? i : "en"),
    { es: "Spanish", fr: "French", en: "English" }[i] || "English"
  );
}
