import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, MessageSquare } from "lucide-react";

interface Command {
  id: string;
  text: string;
  timestamp: Date;
  status: 'processing' | 'completed' | 'error';
  response?: string;
}

interface CommandHistoryProps {
  commands: Command[];
}

export const CommandHistory = ({ commands }: CommandHistoryProps) => {
  const getStatusIcon = (status: Command['status']) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-4 h-4 text-ai-secondary animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-ai-accent" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: Command['status']) => {
    switch (status) {
      case 'processing':
        return 'bg-ai-secondary/20 text-ai-secondary border-ai-secondary/30';
      case 'completed':
        return 'bg-ai-accent/20 text-ai-accent border-ai-accent/30';
      case 'error':
        return 'bg-destructive/20 text-destructive border-destructive/30';
    }
  };

  return (
    <Card className="h-96 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-ai-primary" />
          Command History
        </h3>
      </div>
      
      <ScrollArea className="h-80">
        <div className="p-4 space-y-3">
          {commands.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No commands yet</p>
              <p className="text-xs">Start speaking to see your commands here</p>
            </div>
          ) : (
            commands.map((command) => (
              <div key={command.id} className="space-y-2">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(command.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        "{command.text}"
                      </p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(command.status)}`}
                      >
                        {command.status}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {command.timestamp.toLocaleTimeString()}
                    </p>
                    
                    {command.response && (
                      <div className="mt-2 p-2 bg-ai-primary/10 rounded border-l-2 border-ai-primary/30">
                        <p className="text-xs text-foreground">{command.response}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};