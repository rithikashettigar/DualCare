'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, Check, Zap, Apple, Bed, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const initialMedicines = [
  { time: '08:00 AM', name: 'Heart Medication', dosage: '1 pill', taken: false },
  { time: '01:00 PM', name: 'Vitamin D', dosage: '2 pills', taken: true },
  { time: '09:00 PM', name: 'Sleep Aid', dosage: '1 pill', taken: false },
];

const initialTasks = [
  { icon: Apple, name: 'Breakfast', done: true },
  { icon: Zap, name: 'Morning Exercise', done: false },
  { icon: Bed, name: 'Afternoon Rest', done: false },
];

export default function UserHomePage() {
  const [greeting, setGreeting] = useState('Good Day');

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour < 12) {
      setGreeting('Good Morning');
    } else if (currentHour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);
  
  // States to manage interactions. In a real app, this would come from a data store.
  const [medicines, setMedicines] = useState(initialMedicines);
  const [tasks, setTasks] = useState(initialTasks);

  const handleTakeMedicine = (index: number) => {
    const newMedicines = [...medicines];
    newMedicines[index].taken = true;
    setMedicines(newMedicines);
  }

  const handleDoTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].done = true;
    setTasks(newTasks);
  }


  return (
    <div className="space-y-8 pb-24">
      <header className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          {greeting}, John!
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Here is your schedule for today.
        </p>
      </header>

      <section>
        <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2">
          <Pill className="text-primary" /> Your Medicines
        </h2>
        <div className="space-y-4">
          {medicines.map((med, index) => (
            <Card
              key={index}
              className={`transition-all ${
                med.taken ? 'bg-secondary/50' : 'bg-card'
              }`}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="text-center w-24">
                  <p className="text-xl font-bold font-headline">
                    {med.time.split(' ')[0]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {med.time.split(' ')[1]}
                  </p>
                </div>
                <Separator orientation="vertical" className="h-16" />
                <div className="flex-1">
                  <p className="text-xl font-semibold">{med.name}</p>
                  <p className="text-muted-foreground">{med.dosage}</p>
                </div>
                <Button
                  size="lg"
                  className="h-20 w-32 text-xl shrink-0"
                  disabled={med.taken}
                  variant={med.taken ? 'outline' : 'default'}
                  style={{ minHeight: '44px', minWidth: '44px' }}
                  aria-label={`Mark ${med.name} as taken`}
                  onClick={() => handleTakeMedicine(index)}
                >
                  {med.taken ? <Check className="h-8 w-8" /> : 'Take'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2">
          <Zap className="text-primary" /> Daily Routine
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task, index) => (
            <Card
              key={index}
              className={`transition-all ${
                task.done ? 'bg-secondary/50' : 'bg-card'
              }`}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center gap-4 h-56">
                <task.icon className="h-16 w-16 text-muted-foreground" />
                <p className="text-xl font-semibold text-center">{task.name}</p>
                <Button
                  size="lg"
                  className="h-14 w-full text-lg"
                  disabled={task.done}
                  variant={task.done ? 'outline' : 'default'}
                  style={{ minHeight: '44px' }}
                  aria-label={`Mark ${task.name} as done`}
                  onClick={() => handleDoTask(index)}
                >
                  {task.done ? <Check className="h-6 w-6" /> : 'Done'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <footer className="text-center pt-8">
        <Button variant="ghost" asChild>
          <Link href="/">
            <User className="mr-2 h-4 w-4" /> Switch Account / Logout
          </Link>
        </Button>
      </footer>
    </div>
  );
}
