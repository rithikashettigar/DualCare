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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

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

export default function SchedulesPage() {
  return (
    <Tabs defaultValue="medicine">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="medicine">Medicine</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <Button>
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
                    <TableCell className="font-medium">{task.user}</TableCell>
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
  );
}
