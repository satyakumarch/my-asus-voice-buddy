import { useState, useEffect } from "react";
import { VoiceInput } from "@/components/VoiceInput";
import { CommandHistory } from "@/components/CommandHistory";
import { SystemStatus } from "@/components/SystemStatus";
import { QuickActions } from "@/components/QuickActions";
import { Mic, Settings, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createElevenLabsService } from "@/services/elevenlabs";
import heroImage from "@/assets/jarvis-hero.jpg";

interface Command {
  id: string;
  text: string;
  timestamp: Date;
  status: 'processing' | 'completed' | 'error';
  response?: string;
}

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elevenLabsService, setElevenLabsService] = useState<any>(null);

  useEffect(() => {
    // Initialize ElevenLabs service
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (apiKey) {
      setElevenLabsService(createElevenLabsService(apiKey));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVoiceSpeak = async (text: string) => {
    if (elevenLabsService) {
      await elevenLabsService.textToSpeech(text);
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

  const handleVoiceCommand = async (command: string) => {
    const newCommand: Command = {
      id: Date.now().toString(),
      text: command,
      timestamp: new Date(),
      status: 'processing'
    };
    
    setCommands(prev => [newCommand, ...prev]);
    
    // Process actual system commands
    try {
      const result = await processSystemCommand(command.toLowerCase());
      
      setCommands(prev => prev.map(cmd => 
        cmd.id === newCommand.id 
          ? { ...cmd, status: 'completed' as const, response: result }
          : cmd
      ));
      
      // Speak the response
      await handleVoiceSpeak(result);
    } catch (error) {
      const errorMessage = `Error: ${error}`;
      setCommands(prev => prev.map(cmd => 
        cmd.id === newCommand.id 
          ? { ...cmd, status: 'error' as const, response: errorMessage }
          : cmd
      ));
      
      // Speak the error
      await handleVoiceSpeak(errorMessage);
    }
  };

  const processSystemCommand = async (command: string): Promise<string> => {
    const isDesktop = typeof (window as any).electronAPI !== 'undefined';
    
    // Google search functionality  
    if (command.includes('search') && (command.includes('google') || command.includes('for'))) {
      const searchQuery = command.replace(/search|google|for/g, '').trim();
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      
      if (isDesktop) {
        await (window as any).electronAPI.openUrl(searchUrl);
        return `Searching Google for: ${searchQuery}`;
      } else {
        window.open(searchUrl, '_blank');
        return `Opened Google search for: ${searchQuery}`;
      }
    }

    // YouTube search
    if (command.includes('youtube') && command.includes('search')) {
      const searchQuery = command.replace(/youtube|search/g, '').trim();
      const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
      
      if (isDesktop) {
        await (window as any).electronAPI.openUrl(youtubeUrl);
        return `Searching YouTube for: ${searchQuery}`;
      } else {
        window.open(youtubeUrl, '_blank');
        return `Opened YouTube search for: ${searchQuery}`;
      }
    }
    
    // Desktop Applications
    if (command.includes('calculator') || command.includes('calc')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openApp('calculator');
      }
      return 'Calculator command received - run as desktop app for full functionality';
    }
    
    if (command.includes('notepad') || command.includes('text editor')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openApp('notepad');
      }
      return 'Notepad command received - run as desktop app for full functionality';
    }
    
    if (command.includes('file explorer') || command.includes('files') || command.includes('folder')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openApp('explorer');
      }
      return 'File Explorer command received - run as desktop app for full functionality';
    }
    
    if (command.includes('paint') || command.includes('drawing')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openApp('paint');
      }
      return 'Paint command received - run as desktop app for full functionality';
    }
    
    if (command.includes('word') || command.includes('document')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openApp('word');
      }
      return 'Word command received - run as desktop app for full functionality';
    }
    
    if (command.includes('excel') || command.includes('spreadsheet')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openApp('excel');
      }
      return 'Excel command received - run as desktop app for full functionality';
    }
    
    if (command.includes('control panel') || command.includes('settings')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openApp('control');
      }
      return 'Control Panel command received - run as desktop app for full functionality';
    }
    
    if (command.includes('task manager') || command.includes('taskmgr')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openApp('taskmgr');
      }
      return 'Task Manager command received - run as desktop app for full functionality';
    }
    
    if (command.includes('powershell') || command.includes('power shell')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openApp('powershell');
      }
      return 'PowerShell command received - run as desktop app for full functionality';
    }
    
    if (command.includes('command prompt') || command.includes('cmd')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openApp('cmd');
      }
      return 'Command Prompt command received - run as desktop app for full functionality';
    }
    
    if (command.includes('windows settings') || (command.includes('settings') && !command.includes('control'))) {
      if (isDesktop) {
        return await (window as any).electronAPI.openApp('settings');
      }
      return 'Windows Settings command received - run as desktop app for full functionality';
    }
    
    // Folder Commands
    if (command.includes('desktop') && command.includes('open')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openFolder('desktop');
      }
      return 'Desktop folder command received - run as desktop app for full functionality';
    }
    
    if (command.includes('documents') && command.includes('open')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openFolder('documents');
      }
      return 'Documents folder command received - run as desktop app for full functionality';
    }
    
    if (command.includes('downloads') && command.includes('open')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openFolder('downloads');
      }
      return 'Downloads folder command received - run as desktop app for full functionality';
    }
    
    if (command.includes('pictures') && command.includes('open')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openFolder('pictures');
      }
      return 'Pictures folder command received - run as desktop app for full functionality';
    }
    
    if (command.includes('videos') && command.includes('open')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openFolder('videos');
      }
      return 'Videos folder command received - run as desktop app for full functionality';
    }
    
    if (command.includes('music') && command.includes('open')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openFolder('music');
      }
      return 'Music folder command received - run as desktop app for full functionality';
    }
    
    // System Commands
    if (command.includes('shutdown') || command.includes('power off')) {
      if (isDesktop) {
        return await (window as any).electronAPI.systemCommand('shutdown');
      }
      return 'Shutdown command received - run as desktop app for full functionality';
    }
    
    if (command.includes('restart') || command.includes('reboot')) {
      if (isDesktop) {
        return await (window as any).electronAPI.systemCommand('restart');
      }
      return 'Restart command received - run as desktop app for full functionality';
    }
    
    if (command.includes('sleep') || command.includes('hibernate')) {
      if (isDesktop) {
        return await (window as any).electronAPI.systemCommand('sleep');
      }
      return 'Sleep command received - run as desktop app for full functionality';
    }
    
    if (command.includes('lock') || command.includes('lock screen')) {
      if (isDesktop) {
        return await (window as any).electronAPI.systemCommand('lock');
      }
      return 'Lock command received - run as desktop app for full functionality';
    }
    
    // Web Applications (work in both web and desktop)
    if (command.includes('chrome') || command.includes('browser')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openUrl('https://www.google.com');
      } else {
        window.open('https://www.google.com', '_blank');
        return 'Opening Chrome browser';
      }
    }
    
    if (command.includes('gmail') || command.includes('email')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openUrl('https://gmail.com');
      } else {
        window.open('https://gmail.com', '_blank');
        return 'Opening Gmail';
      }
    }
    
    if (command.includes('whatsapp') || command.includes('whats app')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openUrl('https://web.whatsapp.com');
      } else {
        window.open('https://web.whatsapp.com', '_blank');
        return 'Opening WhatsApp Web';
      }
    }
    
    if (command.includes('facebook')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openUrl('https://facebook.com');
      } else {
        window.open('https://facebook.com', '_blank');
        return 'Opening Facebook';
      }
    }
    
    if (command.includes('messenger')) {
      if (isDesktop) {
        return await (window as any).electronAPI.openUrl('https://messenger.com');
      } else {
        window.open('https://messenger.com', '_blank');
        return 'Opening Messenger';
      }
    }
    
    // Email sending
    if (command.includes('send email') || command.includes('compose email')) {
      if (isDesktop) {
        const emailData = {
          to: '',
          subject: 'Message from JARVIS',
          body: 'Hello from your AI assistant!'
        };
        return await (window as any).electronAPI.sendEmail(emailData);
      }
      return 'Email composition - run as desktop app for full functionality';
    }
    
    // Default response
    return `Command "${command}" processed. ${isDesktop ? 'Desktop functionality active!' : 'Run as desktop app for full system control.'}`;
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
      
      {/* Animated Background Overlays */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-voice rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-ai-secondary/20 rounded-full blur-2xl animate-pulse"></div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center animate-pulse-glow">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                JARVIS AI
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Power className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Voice Input - Center Column */}
          <div className="lg:col-span-1 lg:order-2">
            <VoiceInput 
              isListening={isListening}
              onListeningChange={setIsListening}
              onCommand={handleVoiceCommand}
              onSpeak={handleVoiceSpeak}
            />
          </div>
          
          {/* System Status - Left Column */}
          <div className="lg:col-span-1 lg:order-1">
            <SystemStatus />
          </div>
          
          {/* Command History - Right Column */}
          <div className="lg:col-span-1 lg:order-3">
            <CommandHistory commands={commands} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <QuickActions onAction={handleVoiceCommand} />
        </div>

        {/* Status Bar */}
        <div className="fixed bottom-4 left-4 right-4 mx-auto max-w-md">
          <Card className="p-3 bg-card/80 backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-ai-accent animate-pulse' : 'bg-muted'}`}></div>
                <span className="text-muted-foreground">
                  {isListening ? 'Listening...' : 'Ready'}
                </span>
              </div>
              <div className="text-muted-foreground">
                Commands: {commands.length}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;