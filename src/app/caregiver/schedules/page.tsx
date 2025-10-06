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
import { useState, useEffect, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase, WithId } from '@/firebase';
import {
  collection,
  collectionGroup,
  query,
  where,
} from 'firebase/firestore';
import {
  type User,
  type Medicine,
  type Task,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  addTask,
  updateTask,
  deleteTask,
} from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';

type ScheduleItem = (WithId<Medicine> | WithId<Task>) & {
  type: 'medicine' | 'task';
  userName?: string;
};

// A helper to map user IDs to names for display
const createUserMap = (users: WithId<User>[]) => {
    return users.reduce((acc, user) => {
        acc[user.id] = user.name;
        return acc;
    }, {} as Record<string, string>);
}

export default function SchedulesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('medicine');
  const [isFormDialogOpen, setFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ScheduleItem | null>(null);

  // Fetch users to populate selector and map names
  const usersQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'users'), where('userType', '==', 'endUser')) : null, [firestore]);
  const { data: usersData, isLoading: isUsersLoading } = useCollection<User>(usersQuery);
  const userMap = useMemo(() => usersData ? createUserMap(usersData) : {}, [usersData]);

  // Fetch all medicines using a collection group query
  const medicinesQuery = useMemoFirebase(() => firestore ? collectionGroup(firestore, 'medicines') : null, [firestore]);
  const { data: medicinesData, isLoading: isMedsLoading } = useCollection<Medicine>(medicinesQuery);
  const medicines = useMemo(() => medicinesData?.map(m => ({...m, userName: userMap[m.userId]})) || [], [medicinesData, userMap]);

  // Fetch all tasks using a collection group query
  const tasksQuery = useMemoFirebase(() => firestore ? collectionGroup(firestore, 'tasks') : null, [firestore]);
  const { data: tasksData, isLoading: isTasksLoading } = useCollection<Task>(tasksQuery);
  const tasks = useMemo(() => tasksData?.map(t => ({...t, userName: userMap[t.userId]})) || [], [tasksData, userMap]);

  // Form state
  const [selectedUser, setSelectedUser] = useState('');
  const [nameOrDesc, setNameOrDesc] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (isFormDialogOpen && editingItem) {
      setSelectedUser(editingItem.userId || '');
      setNameOrDesc(
        'name' in editingItem ? editingItem.name || '' : ('description' in editingItem ? editingItem.description || '' : '')
      );
      setDosage('dosage' in editingItem ? editingItem.dosage || '' : '');
      setTime(editingItem.time || '');
    } else {
      resetForm();
    }
  }, [isFormDialogOpen, editingItem]);

  const resetForm = () => {
    setSelectedUser('');
    setNameOrDesc('');
    setDosage('');
    setTime('');
  };

  const openAddDialog = () => {
    setEditingItem(null);
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
    if (!isFormValid || !firestore) return;

    if (editingItem) {
      // Update existing item
      if (editingItem.type === 'medicine') {
        updateMedicine(firestore, selectedUser, editingItem.id, { user: selectedUser, name: nameOrDesc, dosage, time });
        toast({ title: "Medicine Updated" });
      } else {
        updateTask(firestore, selectedUser, editingItem.id, { user: selectedUser, description: nameOrDesc, time });
        toast({ title: "Task Updated" });
      }
    } else {
      // Add new item
      if (activeTab === 'medicine') {
        addMedicine(firestore, selectedUser, { name: nameOrDesc, dosage, time });
        toast({ title: "Medicine Added" });
      } else {
        addTask(firestore, selectedUser, { description: nameOrDesc, time });
        toast({ title: "Task Added" });
      }
    }
    setFormDialogOpen(false);
  };

  const handleDelete = () => {
    if (!itemToDelete || !firestore) return;

    if (itemToDelete.type === 'medicine') {
      deleteMedicine(firestore, itemToDelete.userId, itemToDelete.id);
      toast({ title: "Medicine Deleted" });
    } else {
      deleteTask(firestore, itemToDelete.userId, itemToDelete.id);
      toast({ title: "Task Deleted" });
    }

    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const isLoading = isUsersLoading || isMedsLoading || isTasksLoading;
  const isFormValid = selectedUser && nameOrDesc && time && (activeTab === 'tasks' || dosage);

  return (
    <>
      <Dialog open={isFormDialogOpen} onOpenChange={setFormDialogOpen}>
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
                    {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>}
                    {!isLoading && medicines.map((med) => (
                      <TableRow key={med.id}>
                        <TableCell className="font-medium">{med.userName || med.userId}</TableCell>
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
                    {isLoading && <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>}
                    {!isLoading && tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">
                          {task.userName || task.userId}
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
              <Select value={selectedUser} onValueChange={setSelectedUser} disabled={!!editingItem}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {usersData?.map((user) => (
                    <SelectItem
                      key={user.id}
                      value={user.id}
                    >
                      {user.name}
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
