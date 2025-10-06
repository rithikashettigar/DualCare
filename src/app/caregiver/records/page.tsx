'use client';

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
import { MoreHorizontal, PlusCircle, FileText, Download, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

type MedicalRecord = {
  id: string;
  user: string;
  fileName: string;
  fileType: 'PDF' | 'Image' | 'Report';
  uploadDate: string;
};

const initialRecords: MedicalRecord[] = [
  {
    id: 'rec1',
    user: 'John Doe',
    fileName: 'Blood Test Results - Jan 2024.pdf',
    fileType: 'PDF',
    uploadDate: '2024-01-15',
  },
  {
    id: 'rec2',
    user: 'John Doe',
    fileName: 'X-Ray_Scan_05.jpg',
    fileType: 'Image',
    uploadDate: '2024-02-02',
  },
  {
    id: 'rec3',
    user: 'Jane Smith',
    fileName: 'Cardiology_Consult_Summary.pdf',
    fileType: 'Report',
    uploadDate: '2024-02-20',
  },
  {
    id: 'rec4',
    user: 'Robert Brown',
    fileName: 'Prescription_Update.pdf',
    fileType: 'PDF',
    uploadDate: '2024-03-10',
  },
];


export default function RecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>(initialRecords);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Medical Records</CardTitle>
          <CardDescription>
            Access and manage medical records for your users.
          </CardDescription>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Upload Record
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date Uploaded</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.user}</TableCell>
                <TableCell>{record.fileName}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{record.fileType}</Badge>
                </TableCell>
                <TableCell>{new Date(record.uploadDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4"/>
                        View Details
                      </DropdownMenuItem>
                       <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4"/>
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4"/>
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
  );
}
