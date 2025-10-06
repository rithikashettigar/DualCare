'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
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
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  useFirestore,
  useCollection,
  WithId,
  useMemoFirebase,
} from '@/firebase';
import { collection } from 'firebase/firestore';
import { User, addUser, updateUser, deleteUser } from '@/lib/firestore';

const generateInitials = (name: string) =>
  name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '';

export default function UsersPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const usersQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'users') : null),
    [firestore]
  );
  const { data: users, isLoading: isUsersLoading } = useCollection<User>(
    usersQuery
  );

  const [isFormDialogOpen, setFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<WithId<User> | null>(null);
  const [userToDelete, setUserToDelete] = useState<WithId<User> | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isFormDialogOpen) {
      if (editingUser) {
        setName(editingUser.name);
        setEmail(editingUser.email);
      } else {
        resetForm();
      }
    }
  }, [isFormDialogOpen, editingUser]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setEditingUser(null);
  };

  const handleOpenAddDialog = () => {
    setEditingUser(null);
    resetForm();
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (user: WithId<User>) => {
    setEditingUser(user);
    setFormDialogOpen(true);
  };

  const handleOpenDeleteDialog = (user: WithId<User>) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (!isFormValid) {
      toast({
        variant: 'destructive',
        title: 'Invalid Form',
        description: 'Please fill in both name and email.',
      });
      return;
    }
    if (!firestore) return;

    if (editingUser) {
      // Update user
      updateUser(firestore, editingUser.id, { name, email });
      toast({ title: 'User updated successfully!' });
    } else {
      // Add new user
      const newUser: Omit<User, 'id'> = {
        name,
        email,
        status: 'Active',
        lastActivity: new Date().toISOString(),
        userType: 'endUser',
        language: 'en',
      };
      addUser(firestore, newUser);
      toast({ title: 'User added successfully!' });
    }

    setFormDialogOpen(false);
    resetForm();
  };

  const handleDeleteUser = () => {
    if (!userToDelete || !firestore) return;
    deleteUser(firestore, userToDelete.id);
    toast({
      title: 'User removed.',
      description: `${userToDelete.name} has been removed.`,
    });
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const isFormValid = name && email;

  const displayedUsers = useMemo(() => {
    return (users || []).map((user) => ({
      ...user,
      initials: generateInitials(user.name),
    }));
  }, [users]);

  return (
    <>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Manage Users</CardTitle>
            <CardDescription>
              Here you can add, edit, and view the users you are caring for.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Last Activity
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isUsersLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : displayedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No users found. Add one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>{user.initials}</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground hidden md:block">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          variant={
                            user.status === 'Active' ? 'default' : 'secondary'
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(user.lastActivity).toLocaleString()}
                      </TableCell>
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
                              onClick={() =>
                                alert('Viewing details for ' + user.name)
                              }
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenEditDialog(user)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenDeleteDialog(user)}
                              className="text-destructive"
                            >
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleOpenAddDialog}>Add New User</Button>
          </CardFooter>
        </Card>
      </div>
      <Dialog
        open={isFormDialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) resetForm();
          setFormDialogOpen(isOpen);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Edit User' : 'Add New User'}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? 'Update the details for this user.'
                : 'Enter the details for the new user you will be caring for.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                placeholder="e.g. john.doe@example.com"
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
            <Button
              type="submit"
              onClick={handleSaveUser}
              disabled={!isFormValid}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the user
              and all their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive hover:bg-destructive/90"
            >
              Remove User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
