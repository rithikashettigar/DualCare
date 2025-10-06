'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
import { useState, useEffect } from 'react';

type Medicine = {
  id: number;
  user: string;
  name: string;
  dosage: string;
  time: string;
};

type Task = {
  id: number;
  user: string;
  description: string;
  time: string;
};

const initialMedicines: Medicine[] = [
  {
    id: 1,
    user: 'John Doe',
    name: 'Lisinopril',
    dosage: '10mg',
    time: '08:00',
  },
  {
    id: 2,
    user: 'John Doe',
    name: 'Vitamin D',
    dosage: '1000 IU',
    time: '08:00',
  },
  {
    id: 3,
    user: 'Jane Smith',
    name: 'Metformin',
    dosage: '500mg',
    time: '21:00',
  },
];

const initialTasks: Task[] = [
  {
    id: 1,
    user: 'John Doe',
    description: 'Morning Walk',
    time: '09:00',
  },
  {
    id: 2,
    user: 'Jane Smith',
    description: 'Check blood pressure',
    time: '10:00',
  },
  {
    id: 3,
    user: 'John Doe',
    description: 'Afternoon nap',
    time: '14:00',
  },
];

const users = ['John Doe', 'Jane Smith', 'Robert Brown'];

type ScheduleItem = Partial<Medicine & Task & { type?: 'medicine' | 'task' }>;

export default function SchedulesPage() {
  const [activeTab, setActiveTab] = useState('medicine');
  const [isFormDialogOpen, setFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ScheduleItem | null>(null);


  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Form state
  const [selectedUser, setSelectedUser] = useState('');
  const [nameOrDesc, setNameOrDesc] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (editingItem) {
      setSelectedUser(editingItem.user || '');
      setNameOrDesc(editingItem.name || editingItem.description || '');
      setDosage(editingItem.dosage || '');
      setTime(editingItem.time || '');
    } else {
      // Reset form when adding a new item
      setSelectedUser('');
      setNameOrDesc('');
      setDosage('');
      setTime('');
    }
  }, [editingItem]);

  const openAddDialog = () => {
    setEditingItem(null);
    setFormDialogOpen(true);
  };

  const openEditDialog = (item: ScheduleItem, type: 'medicine' | 'task') => {
    setEditingItem({ ...item, type });
    setFormDialogOpen(true);
  };
  
  const openDeleteDialog = (item: ScheduleItem, type: 'medicine' | 'task') => {
    setItemToDelete({ ...item, type });
    setDeleteDialogOpen(true);
  };
  
  const handleSave = () => {
    if (editingItem) {
      // Update existing item
      if (activeTab === 'medicine') {
        setMedicines(
          medicines.map((m) =>
            m.id === editingItem.id
              ? { ...m, user: selectedUser, name: nameOrDesc, dosage, time }
              : m
          )
        );
      } else {
        setTasks(
          tasks.map((t) =>
            t.id === editingItem.id
              ? { ...t, user: selectedUser, description: nameOrDesc, time }
              : t
          )
        );
      }
    } else {
      // Add new item
      if (activeTab === 'medicine') {
        const newMed: Medicine = {
            id: Date.now(),
            user: selectedUser,
            name: nameOrDesc,
            dosage,
            time,
        };
        setMedicines([...medicines, newMed]);
      } else {
        const newTask: Task = {
            id: Date.now(),
            user: selectedUser,
            description: nameOrDesc,
            time,
        };
        setTasks([...tasks, newTask]);
      }
    }

    setFormDialogOpen(false);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'medicine') {
      setMedicines(medicines.filter((m) => m.id !== itemToDelete.id));
    } else {
      setTasks(tasks.filter((t) => t.id !== itemToDelete.id));
    }

    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };


  const isFormValid = selectedUser && nameOrDesc && time && (activeTab === 'tasks' || dosage);

  return (
    <>
    <Dialog open={isFormDialogOpen} onOpenChange={setFormDialogOpen}>
      <Tabs defaultValue="medicine" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="medicine">Medicine</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          <Button onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Schedule Item
          </Button>
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
                  {medicines.map((med) => (
                    <TableRow key={med.id}>
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
                            <DropdownMenuItem
                              onClick={() => openEditDialog(med, 'medicine')}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(med, 'medicine')}
                              className="text-destructive"
                            >
                              Delete
                            </DropdownMenuItem>
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
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
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
                             <DropdownMenuItem
                              onClick={() => openEditDialog(task, 'task')}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(task, 'task')}
                              className="text-destructive"
                            >
                              Delete
                            </DropdownMenuItem>
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
          <DialogTitle>
            {editingItem ? 'Edit' : 'Add New'}{' '}
            {activeTab === 'medicine' ? 'Medicine' : 'Task'}
          </DialogTitle>
          <DialogDescription>
            Fill out the details below to{' '}
            {editingItem ? 'update the' : 'add a new'}{' '}
            item to the schedule.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user" className="text-right">
              User
            </Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user, index) => (
                  <SelectItem
                    key={index}
                    value={user}
                  >
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {activeTab === 'medicine' ? 'Medicine' : 'Task'}
            </Label>
            <Input
              id="name"
              value={nameOrDesc}
              onChange={(e) => setNameOrDesc(e.target.value)}
              placeholder={
                activeTab === 'medicine' ? 'e.g. Lisinopril' : 'e.g. Morning Walk'
              }
              className="col-span-3"
            />
          </div>
          {activeTab === 'medicine' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dosage" className="text-right">
                Dosage
              </Label>
              <Input
                id="dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 10mg"
                className="col-span-3"
              />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setFormDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave} disabled={!isFormValid}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              schedule item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
