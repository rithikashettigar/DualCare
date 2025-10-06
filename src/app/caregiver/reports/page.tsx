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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Download, Search } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

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
  { mood: 'Happy', count: 15, emoji: '😊' },
  { mood: 'Neutral', count: 5, emoji: '😐' },
  { mood: 'Sad', count: 2, emoji: '😢' },
  { mood: 'Angry', count: 1, emoji: '😠' },
];

const detailedMoodLogs = [
    { id: 1, user: 'John Doe', mood: 'Happy', timestamp: '2024-05-20 09:00 AM', notes: 'Felt great after morning walk.' },
    { id: 2, user: 'Jane Smith', mood: 'Happy', timestamp: '2024-05-20 10:30 AM', notes: 'Enjoyed the sunshine.' },
    { id: 3, user: 'John Doe', mood: 'Neutral', timestamp: '2024-05-19 03:15 PM', notes: 'Just a normal afternoon.' },
    { id: 4, user: 'Robert Brown', mood: 'Sad', timestamp: '2024-05-19 08:00 PM', notes: 'Missing family.' },
    { id: 5, user: 'John Doe', mood: 'Happy', timestamp: '2024-05-18 11:00 AM', notes: 'Had a nice video call with grandchildren.' },
    { id: 6, user: 'Jane Smith', mood: 'Angry', timestamp: '2024-05-18 01:00 PM', notes: 'Frustrated with TV remote.' },
    { id: 7, user: 'Jane Smith', mood: 'Sad', timestamp: '2024-05-20 01:00 PM', notes: 'Feeling a bit down.' },
    { id: 8, user: 'Robert Brown', mood: 'Happy', timestamp: '2024-05-21 02:00 PM', notes: 'Visitor today.' },
    { id: 9, user: 'John Doe', mood: 'Happy', timestamp: '2024-05-21 09:00 AM', notes: 'Feeling rested.' },
    { id: 10, user: 'Jane Smith', mood: 'Happy', timestamp: '2024-05-21 10:30 AM', notes: 'The garden looks beautiful.' },
    { id: 11, user: 'John Doe', mood: 'Neutral', timestamp: '2024-05-20 03:15 PM', notes: 'Watching a movie.' },
    { id: 12, user: 'Robert Brown', mood: 'Neutral', timestamp: '2024-05-20 08:00 PM', notes: 'Reading a book.' },
    { id: 13, user: 'John Doe', mood: 'Happy', timestamp: '2024-05-19 11:00 AM', notes: 'Good breakfast.' },
];

const LOGS_PER_PAGE = 5;

export default function ReportsPage() {
  const [selectedUser, setSelectedUser] = useState('all');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMoodClick = (mood: string) => {
    if (selectedMood === mood) {
      setSelectedMood(null); // Deselect if clicking the same mood again
    } else {
      setSelectedMood(mood);
      setCurrentPage(1); // Reset to first page when mood changes
      setLogSearchTerm(''); // Reset search term
    }
  };

  const filteredLogs = useMemo(() => {
    if (!selectedMood) return [];
    return detailedMoodLogs.filter(
      (log) =>
        log.mood === selectedMood &&
        log.notes.toLowerCase().includes(logSearchTerm.toLowerCase())
    );
  }, [selectedMood, logSearchTerm]);

  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * LOGS_PER_PAGE;
    return filteredLogs.slice(startIndex, startIndex + LOGS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  const totalPages = Math.ceil(filteredLogs.length / LOGS_PER_PAGE);

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
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
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
                <BarChart
                  data={taskCompletionData}
                  layout="vertical"
                  margin={{ left: 10 }}
                >
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
            Overview of moods logged by users. Click an emoji to see details.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-around items-center pt-6">
          {moodData.map((mood) => (
            <div
              key={mood.mood}
              onClick={() => handleMoodClick(mood.mood)}
              className={cn(
                'text-center p-3 rounded-lg cursor-pointer transition-all',
                selectedMood === mood.mood
                  ? 'bg-accent scale-110'
                  : 'hover:bg-accent/50'
              )}
            >
              <span className="text-5xl md:text-6xl">{mood.emoji}</span>
              <p className="text-lg font-bold mt-2">{mood.count}</p>
              <p className="text-sm text-muted-foreground">Entries</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {selectedMood && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Detailed Logs for: {selectedMood}</CardTitle>
                <CardDescription>
                  Showing all entries logged as &quot;{selectedMood}&quot;.
                </CardDescription>
              </div>
              <div className="relative mt-4 sm:mt-0 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search in notes..."
                  className="pl-8"
                  value={logSearchTerm}
                  onChange={(e) => {
                    setLogSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {paginatedLogs.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>
                          {log.notes || (
                            <span className="text-muted-foreground">
                              No notes
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No detailed logs found for this mood with the current search.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
