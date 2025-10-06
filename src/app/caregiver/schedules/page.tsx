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
import { useToast } from '@/hooks/use-toast';

type Medicine = {
  id: string;
  user: string;
  name: string;
  dosage: string;
  time: string;
};

type Task = {
  id: string;
  user: string;
  description: string;
  time: string;
};

type ScheduleItem = (Medicine | Task) & {
  type: 'medicine' | 'task';
};

const users = ['John Doe', 'Jane Smith', 'Robert Brown'];

const initialMedicines: Medicine[] = [
  { id: 'med1', user: 'John Doe', name: 'Lisinopril', dosage: '10mg', time: '08:00' },
  { id: 'med2', user: 'Jane Smith', name: 'Metformin', dosage: '500mg', time: '09:00' },
  { id: 'med3', user: 'John Doe', name: 'Aspirin', dosage: '81mg', time: '08:00' },
];

const initialTasks: Task[] = [
  { id: 'task1', user: 'John Doe', description: 'Morning Walk', time: '07:00' },
  { id: 'task2', user: 'Jane Smith', description: 'Check Blood Sugar', time: '09:00' },
  { id: 'task3', user: 'Robert Brown', description: 'Physical Therapy', time: '11:00' },
];

export default function SchedulesPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('medicine');

  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const [isFormDialogOpen, setFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ScheduleItem | null>(null);

  // Form state
  const [selectedUser, setSelectedUser] = useState('');
  const [nameOrDesc, setNameOrDesc] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (isFormDialogOpen) {
      if (editingItem) {
        setSelectedUser(editingItem.user);
        setNameOrDesc('name' in editingItem ? editingItem.name : editingItem.description);
        setTime(editingItem.time);
        if ('dosage' in editingItem) {
          setDosage(editingItem.dosage);
        }
      } else {
        resetForm();
      }
    }
  }, [isFormDialogOpen, editingItem]);

  const resetForm = () => {
    setSelectedUser('');
    setNameOrDesc('');
    setDosage('');
    setTime('');
    setEditingItem(null);
  };

  const openAddDialog = () => {
    resetForm();
    setFormDialogOpen(true);
  };

  const openEditDialog = (item: ScheduleItem) => {
    setEditingItem(item);
    setFormDialogOpen(true);
  };

  const openDeleteDialog = (item: ScheduleItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!isFormValid) {
         toast({
            variant: 'destructive',
            title: 'Missing Fields',
            description: 'Please fill out all required fields.',
        });
        return;
    }

    if (editingItem) {
      // Update existing item
      if (editingItem.type === 'medicine') {
        setMedicines(medicines.map(m => m.id === editingItem.id ? { ...m, user: selectedUser, name: nameOrDesc, dosage, time } : m));
        toast({ title: "Medicine Updated" });
      } else {
        setTasks(tasks.map(t => t.id === editingItem.id ? { ...t, user: selectedUser, description: nameOrDesc, time } : t));
        toast({ title: "Task Updated" });
      }
    } else {
      // Add new item
      if (activeTab === 'medicine') {
        const newMed: Medicine = { id: `med-${Date.now()}`, user: selectedUser, name: nameOrDesc, dosage, time };
        setMedicines([newMed, ...medicines]);
        toast({ title: "Medicine Added" });
      } else {
        const newTask: Task = { id: `task-${Date.now()}`, user: selectedUser, description: nameOrDesc, time };
        setTasks([newTask, ...tasks]);
        toast({ title: "Task Added" });
      }
    }
    setFormDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'medicine') {
      setMedicines(medicines.filter(m => m.id !== itemToDelete.id));
      toast({ title: "Medicine Deleted" });
    } else {
      setTasks(tasks.filter(t => t.id !== itemToDelete.id));
      toast({ title: "Task Deleted" });
    }

    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const isFormValid = selectedUser && nameOrDesc && time && (activeTab === 'tasks' || (activeTab === 'medicine' && dosage));

  return (
    <>
        <Tabs defaultValue="medicine" value={activeTab} onValueChange={setActiveTab}>
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
                                onClick={() => openEditDialog({ ...med, type: 'medicine' })}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog({ ...med, type: 'medicine' })}
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
                                onClick={() => openEditDialog({ ...task, type: 'task' })}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog({ ...task, type: 'task' })}
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
      
      <Dialog open={isFormDialogOpen} onOpenChange={(isOpen) => {
          if (!isOpen) resetForm();
          setFormDialogOpen(isOpen);
      }}>
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
                  {users.map((user) => (
                    <SelectItem
                      key={user}
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
