'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, Check, Zap, Smile, Meh, Frown, CheckCircle2, Circle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

type ScheduleItem = {
  time: string;
  name: string;
  type: 'medicine' | 'task';
  icon: React.ElementType;
  details: string;
  completed: boolean;
};

const initialSchedule: Omit<ScheduleItem, 'completed'>[] = [
  { time: '07:00', name: 'Morning Walk', type: 'task', icon: Zap, details: '30 minutes' },
  { time: '08:00', name: 'Lisinopril', type: 'medicine', icon: Pill, details: '10mg' },
  { time: '08:00', name: 'Aspirin', type: 'medicine', icon: Pill, details: '81mg' },
  { time: '09:00', name: 'Breakfast', type: 'task', icon: Zap, details: 'High-fiber' },
  { time: '13:00', name: 'Metformin', type: 'medicine', icon: Pill, details: '500mg' },
  { time: '14:00', name: 'Afternoon Rest', type: 'task', icon: Zap, details: '1 hour' },
  { time: '21:00', name: 'Sleep Aid', type: 'medicine', icon: Pill, details: '1 pill' },
];

const getSortedSchedule = () => 
  initialSchedule
    .map(item => ({...item, completed: Math.random() > 0.5})) // Randomly mark some as completed for demo
    .sort((a, b) => a.time.localeCompare(b.time));


export default function UserHomePage() {
  const [greeting, setGreeting] = useState('Good Day');
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  useEffect(() => {
    // This runs only on the client to avoid hydration errors
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour < 12) {
      setGreeting('Good Morning');
    } else if (currentHour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
    setSchedule(getSortedSchedule());
  }, []);
  
  const handleToggleComplete = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].completed = !newSchedule[index].completed;
    setSchedule(newSchedule);
  }

  const progress = useMemo(() => {
    if (schedule.length === 0) return 0;
    const completedCount = schedule.filter(item => item.completed).length;
    return (completedCount / schedule.length) * 100;
  }, [schedule]);

  return (
    <div className="space-y-8 pb-24">
      <header className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          {greeting}, John!
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          How are you feeling today?
        </p>
         <div className="flex justify-center gap-4 pt-4">
            <Button
              variant={selectedMood === 'Happy' ? 'default' : 'outline'}
              size="lg"
              className="rounded-full h-20 w-20 flex-col gap-1"
              onClick={() => setSelectedMood('Happy')}
            >
              <Smile className="h-8 w-8" />
              <span>Happy</span>
            </Button>
            <Button
              variant={selectedMood === 'Neutral' ? 'default' : 'outline'}
              size="lg"
              className="rounded-full h-20 w-20 flex-col gap-1"
              onClick={() => setSelectedMood('Neutral')}
            >
              <Meh className="h-8 w-8" />
              <span>Neutral</span>
            </Button>
            <Button
              variant={selectedMood === 'Sad' ? 'default' : 'outline'}
              size="lg"
              className="rounded-full h-20 w-20 flex-col gap-1"
              onClick={() => setSelectedMood('Sad')}
            >
              <Frown className="h-8 w-8" />
              <span>Sad</span>
            </Button>
          </div>
      </header>

      <Separator />

      <section>
        <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-bold font-headline">
                Today's Schedule
            </h2>
            <div className='flex items-center gap-2'>
                <Progress value={progress} className="w-full h-3" />
                <span className='text-sm font-medium text-muted-foreground'>{Math.round(progress)}%</span>
            </div>
            
        </div>
        <div className="space-y-4">
          {schedule.map((item, index) => (
            <Card
              key={index}
              className={cn('transition-all', item.completed ? 'bg-secondary/50' : 'bg-card')}
              onClick={() => handleToggleComplete(index)}
            >
              <CardContent className="p-4 flex items-center gap-4 cursor-pointer">
                 <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 grid grid-cols-[1fr_auto] items-center gap-4">
                    <div>
                        <p className="text-xl font-semibold">{item.name}</p>
                        <p className="text-muted-foreground">{item.details} &bull; {item.time}</p>
                    </div>
                    <div className='flex items-center gap-2 text-lg font-semibold'>
                        {item.completed ? (
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                        ) : (
                            <Circle className="h-8 w-8 text-muted-foreground/50" />
                        )}
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
