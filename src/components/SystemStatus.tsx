import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Battery,
  Activity,
  Thermometer
} from "lucide-react";

export const SystemStatus = () => {
  const [systemInfo, setSystemInfo] = useState({
    cpuUsage: 45,
    memoryUsage: 68,
    diskUsage: 72,
    networkStatus: 'Connected',
    batteryLevel: 85,
    temperature: 42,
    uptime: '2h 34m'
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemInfo(prev => ({
        ...prev,
        cpuUsage: Math.floor(Math.random() * 30) + 30,
        memoryUsage: Math.floor(Math.random() * 20) + 60,
        batteryLevel: Math.max(prev.batteryLevel - Math.random() * 0.1, 75),
        temperature: Math.floor(Math.random() * 10) + 38,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds: [number, number] = [50, 80]) => {
    if (value < thresholds[0]) return 'text-ai-accent';
    if (value < thresholds[1]) return 'text-ai-secondary';
    return 'text-destructive';
  };

  const getProgressColor = (value: number, thresholds: [number, number] = [50, 80]) => {
    if (value < thresholds[0]) return 'bg-ai-accent';
    if (value < thresholds[1]) return 'bg-ai-secondary';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-4">
      {/* System Overview */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center">
            <Monitor className="w-5 h-5 mr-2 text-ai-primary" />
            System Status
          </h3>
          <Badge variant="outline" className="bg-ai-accent/20 text-ai-accent border-ai-accent/30">
            Online
          </Badge>
        </div>

        <div className="space-y-4">
          {/* CPU Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">CPU</span>
              </div>
              <span className={`text-sm font-mono ${getStatusColor(systemInfo.cpuUsage)}`}>
                {systemInfo.cpuUsage}%
              </span>
            </div>
            <Progress 
              value={systemInfo.cpuUsage} 
              className="h-2"
              style={{
                '--progress-foreground': getProgressColor(systemInfo.cpuUsage)
              } as any}
            />
          </div>

          {/* Memory Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Memory</span>
              </div>
              <span className={`text-sm font-mono ${getStatusColor(systemInfo.memoryUsage)}`}>
                {systemInfo.memoryUsage}%
              </span>
            </div>
            <Progress 
              value={systemInfo.memoryUsage} 
              className="h-2"
              style={{
                '--progress-foreground': getProgressColor(systemInfo.memoryUsage)
              } as any}
            />
          </div>

          {/* Disk Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Storage</span>
              </div>
              <span className={`text-sm font-mono ${getStatusColor(systemInfo.diskUsage)}`}>
                {systemInfo.diskUsage}%
              </span>
            </div>
            <Progress 
              value={systemInfo.diskUsage} 
              className="h-2"
              style={{
                '--progress-foreground': getProgressColor(systemInfo.diskUsage)
              } as any}
            />
          </div>
        </div>
      </Card>

      {/* Additional Status */}
      <Card className="p-4 bg-card/30 backdrop-blur-sm border-border/30">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-ai-accent" />
            <span className="text-muted-foreground">Network</span>
          </div>
          <div className="text-right font-mono text-ai-accent">
            {systemInfo.networkStatus}
          </div>

          <div className="flex items-center space-x-2">
            <Battery className="w-4 h-4 text-ai-accent" />
            <span className="text-muted-foreground">Battery</span>
          </div>
          <div className="text-right font-mono text-ai-accent">
            {Math.floor(systemInfo.batteryLevel)}%
          </div>

          <div className="flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-ai-secondary" />
            <span className="text-muted-foreground">Temp</span>
          </div>
          <div className="text-right font-mono text-ai-secondary">
            {systemInfo.temperature}°C
          </div>

          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-ai-primary" />
            <span className="text-muted-foreground">Uptime</span>
          </div>
          <div className="text-right font-mono text-ai-primary">
            {systemInfo.uptime}
          </div>
        </div>
      </Card>
    </div>
  );
};