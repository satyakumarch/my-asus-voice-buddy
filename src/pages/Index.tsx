import { useState, useEffect } from "react";
import { VoiceInput } from "@/components/VoiceInput";
import { CommandHistory } from "@/components/CommandHistory";
import { SystemStatus } from "@/components/SystemStatus";
import { QuickActions } from "@/components/QuickActions";
import { Mic, Settings, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
    } catch (error) {
      setCommands(prev => prev.map(cmd => 
        cmd.id === newCommand.id 
          ? { ...cmd, status: 'error' as const, response: `Error: ${error}` }
          : cmd
      ));
    }
  };

  const processSystemCommand = async (command: string): Promise<string> => {
    // Chrome/Browser commands
    if (command.includes('chrome') || command.includes('browser')) {
      window.open('https://www.google.com', '_blank');
      return 'Opening Chrome browser';
    }
    
    // Gmail
    if (command.includes('gmail') || command.includes('email')) {
      window.open('https://gmail.com', '_blank');
      return 'Opening Gmail';
    }
    
    // WhatsApp
    if (command.includes('whatsapp') || command.includes('whats app')) {
      window.open('https://web.whatsapp.com', '_blank');
      return 'Opening WhatsApp Web';
    }
    
    // Social Media
    if (command.includes('facebook')) {
      window.open('https://facebook.com', '_blank');
      return 'Opening Facebook';
    }
    
    if (command.includes('messenger')) {
      window.open('https://messenger.com', '_blank');
      return 'Opening Messenger';
    }
    
    // System commands (these will work when deployed as desktop app)
    if (command.includes('calculator') || command.includes('calc')) {
      if (typeof (window as any).electronAPI !== 'undefined') {
        (window as any).electronAPI.openApp('calc');
        return 'Opening Calculator';
      }
      return 'Calculator command received - deploy as desktop app for full functionality';
    }
    
    if (command.includes('notepad') || command.includes('text editor')) {
      if (typeof (window as any).electronAPI !== 'undefined') {
        (window as any).electronAPI.openApp('notepad');
        return 'Opening Notepad';
      }
      return 'Notepad command received - deploy as desktop app for full functionality';
    }
    
    if (command.includes('file explorer') || command.includes('files') || command.includes('folder')) {
      if (typeof (window as any).electronAPI !== 'undefined') {
        (window as any).electronAPI.openApp('explorer');
        return 'Opening File Explorer';
      }
      return 'File Explorer command received - deploy as desktop app for full functionality';
    }
    
    if (command.includes('shutdown') || command.includes('power off')) {
      if (typeof (window as any).electronAPI !== 'undefined') {
        (window as any).electronAPI.shutdown();
        return 'Shutting down system';
      }
      return 'Shutdown command received - deploy as desktop app for full functionality';
    }
    
    if (command.includes('restart') || command.includes('reboot')) {
      if (typeof (window as any).electronAPI !== 'undefined') {
        (window as any).electronAPI.restart();
        return 'Restarting system';
      }
      return 'Restart command received - deploy as desktop app for full functionality';
    }
    
    // Default response
    return `Command "${command}" processed. Web version has limited system access - deploy as desktop app for full functionality.`;
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