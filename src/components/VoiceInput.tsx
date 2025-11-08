import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VoiceInputProps {
  isListening: boolean;
  onListeningChange: (listening: boolean) => void;
  onCommand: (command: string) => void;
  onSpeak?: (text: string) => void;
}

export const VoiceInput = ({ isListening, onListeningChange, onCommand, onSpeak }: VoiceInputProps) => {
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          onCommand(finalTranscript.trim());
          setTranscript("");
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Voice Recognition Error",
          description: "Please check your microphone permissions.",
          variant: "destructive",
        });
        onListeningChange(false);
      };

      recognition.onend = () => {
        onListeningChange(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onCommand, onListeningChange]);

  const toggleListening = () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      onListeningChange(true);
    }
  };

  const speakText = (text: string) => {
    if (onSpeak) {
      onSpeak(text);
    } else {
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Voice Button */}
      <Card className="p-8 text-center bg-card/50 backdrop-blur-sm border-border/50">
        <div className="relative">
          <Button
            onClick={toggleListening}
            size="lg"
            className={`w-32 h-32 rounded-full transition-all duration-300 ${
              isListening 
                ? 'bg-gradient-primary shadow-voice animate-pulse-glow scale-110' 
                : 'bg-muted hover:bg-gradient-primary/20'
            }`}
          >
            {isListening ? (
              <MicOff className="w-12 h-12" />
            ) : (
              <Mic className="w-12 h-12" />
            )}
          </Button>
          
          {/* Voice Visualization */}
          {isListening && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-ai-primary rounded-full animate-voice-wave"
                    style={{
                      height: Math.random() * 20 + 10,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <h2 className="text-xl font-semibold mt-4 mb-2">
          {isListening ? "Listening..." : "Tap to Speak"}
        </h2>
        
        {transcript && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-foreground">{transcript}</p>
          </div>
        )}
      </Card>

      {/* Voice Commands Help */}
      <Card className="p-4 bg-card/30 backdrop-blur-sm border-border/30">
        <h3 className="font-medium mb-3 text-ai-primary">Voice Commands</h3>
        <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
          <div>"Open Calculator" - Desktop calculator</div>
          <div>"Open Notepad" - Text editor</div>
          <div>"Open PowerShell" - Terminal</div>
          <div>"Open CMD" - Command Prompt</div>
          <div>"Open Task Manager" - System monitor</div>
          <div>"Open Windows Settings" - System settings</div>
          <div>"Search Google for..." - Web search</div>
          <div>"Shutdown system" - System control</div>
        </div>
        
        <Button
          onClick={() => speakText("Voice assistant is ready. How can I help you?")}
          variant="ghost"
          size="sm"
          className="mt-3 w-full"
        >
          <Volume2 className="w-4 h-4 mr-2" />
          Test Voice Feedback
        </Button>
      </Card>
    </div>
  );
};