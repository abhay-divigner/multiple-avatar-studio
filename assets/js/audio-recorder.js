class AudioRecorder {
    constructor(onStatusChange, onTranscriptionComplete) {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.onStatusChange = onStatusChange;
        this.onTranscriptionComplete = onTranscriptionComplete;
        this.speechSegments = [];
        this.chatWidgetContainer = document.getElementById('chat-widget');
        this.avatarContainer = document.querySelector('.avatarContainer');
    }

    audioRecording() {
        return this.isRecording;
    }

    onUserStartedTalking() {
        this.speechStartTime = Date.now();
        console.log("🎤 User started talking at:", new Date(this.speechStartTime).toLocaleTimeString());

        if (this.mediaRecorder.state === "inactive") {
            this.audioChunks = [];
            this.mediaRecorder.start(500);
        }
        if (!this.chatWidgetContainer.classList.contains('talking')) {
            this.chatWidgetContainer.classList.add('talking');
        }
    }

    onUserStoppedTalking() {
        this.speechEndTime = Date.now();
        console.log("🔇 User stopped talking at:", new Date(this.speechEndTime).toLocaleTimeString());

        if (this.mediaRecorder.state === "recording") {
            this.mediaRecorder.stop();
        }
        if (this.chatWidgetContainer.classList.contains('talking')) {
            this.chatWidgetContainer.classList.remove('talking');
        }
        const duration = (this.speechEndTime - this.speechStartTime) / 1000;
        console.log(`🕒 User spoke for ${duration.toFixed(2)} seconds`);
        this.speechSegments.push({
            start: this.speechStartTime,
            end: this.speechEndTime,
            duration
        });
    }
    async startRecording() {

        console.log('Requesting microphone access...');
        let stream = null;
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    noiseSuppression: true,
                    echoCancellation: true,
                    autoGainControl: true,
                    sampleRate: 44100,
                }
            });
            console.log('Microphone access granted');

        } catch (error) {
            this.onStatusChange({ source: 'microphone', error: true, name: error.name, message: error.message });
        }

        if (stream) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);

            const highPassFilter = audioContext.createBiquadFilter();
            highPassFilter.type = "highpass";
            // Cut off frequencies below 200Hz
            highPassFilter.frequency.value = 200;
            source.connect(highPassFilter);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            highPassFilter.connect(analyser);

            const dataArray = new Uint8Array(analyser.fftSize);

            const silenceThreshold = 0.010;
            const silenceDelay = 1000;
            let silenceStart = performance.now();
            let isSilent = true;
            let volume = 0;

            const checkVolume = () => {
                analyser.getByteTimeDomainData(dataArray);
                let sumSquares = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    const normalized = (dataArray[i] - 128) / 128;
                    sumSquares += normalized * normalized;
                }
                volume = Math.sqrt(sumSquares / dataArray.length);


                const now = performance.now();
                if (volume < silenceThreshold) {
                    if (!isSilent && now - silenceStart > silenceDelay) {
                        isSilent = true;
                        this.onUserStoppedTalking();
                    }
                } else {
                    silenceStart = now;
                    if (isSilent) {
                        isSilent = false;
                        this.onUserStartedTalking();
                    }
                }

                requestAnimationFrame(checkVolume);
            };

            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            this.isRecording = true;

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = async () => {
                let duration = parseFloat(((this.speechEndTime - this.speechStartTime) / 1000).toFixed(2));
                if (duration < ((silenceDelay / 1000) + 0.1)) {
                    return;
                }
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                console.log('Audio blob size:', audioBlob.size, 'bytes');
                await this.sendToDeepgram(audioBlob);
            };

            checkVolume();
        }


    }


    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            // Stop all tracks in the stream
            const stream = this.mediaRecorder.stream;
            stream.getTracks().forEach(track => track.stop());
        }
        if (this.chatWidgetContainer.classList.contains('talking')) {
            this.chatWidgetContainer.classList.remove('talking');
        }
    }

    async sendToDeepgram(audioBlob) {
        try {

            console.log('Sending audio to Deepgram API...');
            // const formData = new FormData();
            // formData.append('file', audioBlob, 'audio.webm'); 


            const response = await fetch('https://api.deepgram.com/v1/listen', {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    Authorization: `Token ${STT_CONFIG.deepgramKEY}`,
                },
                body: audioBlob
            });


            const deepgramData = await response.json();

            // console.log('Received transcription:', deepgramData);
            let { results, err_code, err_msg } = deepgramData;

            if (err_code) {
                this.onStatusChange({ source: 'deepgram', error: true, name: err_code, message: err_msg });
            }
            const alternatives = results?.channels?.[0]?.alternatives;
            if (Array.isArray(alternatives)) {
                alternatives.forEach((alt, index) => {
                    console.log(`Alternative ${index + 1}:`, alt.transcript);
                    if (alt.transcript != '') {
                        this.onTranscriptionComplete(alt.transcript);
                    }
                });
            } else {
                console.log("No alternatives found.");
            }

        } catch (error) {
            console.error('Error transcribing audio:', error);
        }
    }

    async sendToOpenAI(audioBlob) {
        try {
            console.log('Sending audio to Whisper API...');
            const formData = new FormData();
            formData.append('file', audioBlob, 'audio.webm');
            formData.append('model', 'whisper-1');

            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${''}`,
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
            }

            const data = await response.json();
            console.log('Received transcription:', data.text);
            this.onTranscriptionComplete(data.text);
        } catch (error) {
            console.error('Error transcribing audio:', error);
        }
    }

}
