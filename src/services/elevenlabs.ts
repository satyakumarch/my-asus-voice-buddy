class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async textToSpeech(text: string, voiceId: string = 'N2lVS1w4EtoT3dr4eOWO'): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const audioContext = new AudioContext();
      const audioBufferDecoded = await audioContext.decodeAudioData(audioBuffer);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBufferDecoded;
      source.connect(audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
      }
    }
  }
}

export const createElevenLabsService = (apiKey: string) => {
  return new ElevenLabsService(apiKey);
};

export type { ElevenLabsService };