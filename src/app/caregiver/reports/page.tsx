'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useState, useEffect } from 'react';

const users = ['John Doe', 'Jane Smith', 'Robert Brown'];
const dateRanges = [
  'Last 7 days',
  'Last 30 days',
  'Last 3 months',
  'All time',
];

const taskCompletionData = [
  { name: 'John D.', completed: 80, remaining: 20 },
  { name: 'Jane S.', completed: 95, remaining: 5 },
  { name: 'Robert B.', completed: 60, remaining: 40 },
];

const medicineAdherenceData = [
  { name: 'Taken', value: 85 },
  { name: 'Missed', value: 15 },
];
const COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))'];

const moodData = [
  { mood: '😊', count: 15, emoji: '😊' },
  { mood: '😐', count: 5, emoji: '😐' },
  { mood: '😢', count: 2, emoji: '😢' },
  { mood: '😠', count: 1, emoji: '😠' },
];

export default function ReportsPage() {
  const [selectedUser, setSelectedUser] = useState('all');
  const [dateRange, setDateRange] = useState('last-30-days');

  // Client-side state to prevent hydration errors for charts
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Reports</CardTitle>
            <CardDescription>
              Analyze medicine adherence, task completion, and mood trends.
            </CardDescription>
          </div>
          <div className="flex gap-2 items-center mt-4 md:mt-0">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select Date Range" />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
             <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">Export Reports</span>
            </Button>
          </div>
        </CardHeader>
      </Card>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Medicine Adherence</CardTitle>
            <CardDescription>
              Percentage of doses taken vs. missed in the selected period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isClient && (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={medicineAdherenceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {medicineAdherenceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Task Completion</CardTitle>
            <CardDescription>
              Weekly task completion rate by user.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isClient && (
               <ResponsiveContainer width="100%" height={300}>
                <BarChart data={taskCompletionData} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--accent))' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                    }}
                  />
                  <Bar
                    dataKey="completed"
                    stackId="a"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 4, 4]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Mood Log Summary</CardTitle>
          <CardDescription>
            Overview of moods logged by users in the selected period.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-around items-center pt-6">
          {moodData.map((mood) => (
            <div key={mood.mood} className="text-center">
              <span className="text-5xl md:text-6xl">{mood.emoji}</span>
              <p className="text-lg font-bold mt-2">{mood.count}</p>
              <p className="text-sm text-muted-foreground">Entries</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}