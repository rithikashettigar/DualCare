'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

const medicines = [
  {
    user: 'John Doe',
    name: 'Lisinopril',
    dosage: '10mg',
    time: '08:00 AM',
  },
  {
    user: 'John Doe',
    name: 'Vitamin D',
    dosage: '1000 IU',
    time: '08:00 AM',
  },
  {
    user: 'Jane Smith',
    name: 'Metformin',
    dosage: '500mg',
    time: '09:00 PM',
  },
];

const tasks = [
  {
    user: 'John Doe',
    description: 'Morning Walk',
    time: '09:00 AM',
  },
  {
    user: 'Jane Smith',
    description: 'Check blood pressure',
    time: '10:00 AM',
  },
  {
    user: 'John Doe',
    description: 'Afternoon nap',
    time: '02:00 PM',
  },
];

const users = ['John Doe', 'Jane Smith', 'Robert Brown'];

export default function SchedulesPage() {
  const [activeTab, setActiveTab] = useState('medicine');
  
  const handleSave = () => {
    // In a real app, you'd handle form validation and saving data to Firestore here.
    console.log('Saving schedule item...');
    // After saving, you would close the dialog and refresh the list.
  }

  return (
    <Dialog>
      <Tabs defaultValue="medicine" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="medicine">Medicine</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Schedule Item
            </Button>
          </DialogTrigger>
        </div>
        <TabsContent value="medicine" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Medicine Schedules</CardTitle>
              <CardDescription>
                Manage medicine schedules for all your users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicines.map((med, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{med.user}</TableCell>
                      <TableCell>{med.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{med.dosage}</Badge>
                      </TableCell>
                      <TableCell>{med.time}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Schedules</CardTitle>
              <CardDescription>
                Manage daily routine tasks for all your users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {task.user}
                      </TableCell>
                      <TableCell>{task.description}</TableCell>
                      <TableCell>{task.time}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New {activeTab === 'medicine' ? 'Medicine' : 'Task'}</DialogTitle>
          <DialogDescription>
            Fill out the details below to add a new item to the schedule.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user" className="text-right">
              User
            </Label>
            <Select>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                    {users.map((user, index) => (
                        <SelectItem key={index} value={user.toLowerCase().replace(' ', '-')}>{user}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {activeTab === 'medicine' ? 'Medicine' : 'Task'}
            </Label>
            <Input id="name" placeholder={activeTab === 'medicine' ? 'e.g. Lisinopril' : 'e.g. Morning Walk'} className="col-span-3" />
          </div>
           {activeTab === 'medicine' && (
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dosage" className="text-right">
                    Dosage
                </Label>
                <Input id="dosage" placeholder="e.g. 10mg" className="col-span-3" />
            </div>
           )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input id="time" type="time" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
