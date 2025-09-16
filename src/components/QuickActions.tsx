import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Chrome, 
  Mail, 
  MessageCircle, 
  Power, 
  Folder,
  Calculator,
  Music,
  Settings,
  Search,
  Calendar
} from "lucide-react";

interface QuickActionsProps {
  onAction: (command: string) => void;
}

export const QuickActions = ({ onAction }: QuickActionsProps) => {
  const quickCommands = [
    {
      icon: Chrome,
      label: "Chrome",
      command: "open chrome browser",
      color: "text-ai-primary"
    },
    {
      icon: Mail,
      label: "Gmail",
      command: "open gmail",
      color: "text-ai-secondary"
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      command: "open whatsapp web",
      color: "text-ai-accent"
    },
    {
      icon: Folder,
      label: "Files",
      command: "open file explorer",
      color: "text-ai-primary"
    },
    {
      icon: Calculator,
      label: "Calculator",
      command: "open calculator",
      color: "text-ai-secondary"
    },
    {
      icon: Music,
      label: "Spotify",
      command: "open spotify",
      color: "text-ai-accent"
    },
    {
      icon: Settings,
      label: "Settings",
      command: "open system settings",
      color: "text-ai-primary"
    },
    {
      icon: Search,
      label: "Search",
      command: "search for files",
      color: "text-ai-secondary"
    },
    {
      icon: Calendar,
      label: "Calendar",
      command: "open calendar",
      color: "text-ai-accent"
    },
    {
      icon: Power,
      label: "Shutdown",
      command: "shutdown system",
      color: "text-destructive"
    }
  ];

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <h3 className="font-semibold mb-4 text-ai-primary">Quick Actions</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
        {quickCommands.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              onClick={() => onAction(item.command)}
              className="h-auto flex-col space-y-2 p-4 hover:bg-muted/50 hover:scale-105 transition-all duration-200 group"
            >
              <IconComponent className={`w-6 h-6 ${item.color} group-hover:animate-bounce`} />
              <span className="text-xs text-muted-foreground group-hover:text-foreground">
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <h4 className="text-sm font-medium mb-2 text-ai-primary">Sample Voice Commands:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>"Send email to John about the meeting"</div>
          <div>"What's the weather like today?"</div>
          <div>"Set a reminder for 3 PM"</div>
          <div>"Play my favorite playlist"</div>
          <div>"Show me my calendar for tomorrow"</div>
          <div>"Take a screenshot"</div>
        </div>
      </div>
    </Card>
  );
};