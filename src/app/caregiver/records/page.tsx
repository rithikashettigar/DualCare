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
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  PlusCircle,
  FileText,
  Download,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type MedicalRecord = {
  id: string;
  user: string;
  fileName: string;
  fileType: 'PDF' | 'Image' | 'Report' | 'Other';
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

const users = ['John Doe', 'Jane Smith', 'Robert Brown'];

export default function RecordsPage() {
  const { toast } = useToast();
  const [records, setRecords] = useState<MedicalRecord[]>(initialRecords);
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isDetailDialogOpen, setDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  // Form state for new record
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // State for editing file name in details view
  const [editingFileName, setEditingFileName] = useState('');

  const getFileType = (fileName: string): MedicalRecord['fileType'] => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'PDF';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) return 'Image';
    return 'Other';
  };

  const handleUpload = () => {
    if (!selectedFile || !selectedUser) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'Please select a user and a file to upload.',
      });
      return;
    }

    const newRecord: MedicalRecord = {
      id: `rec-${Date.now()}`,
      user: selectedUser,
      fileName: selectedFile.name,
      fileType: getFileType(selectedFile.name),
      uploadDate: new Date().toISOString().split('T')[0],
    };

    setRecords([newRecord, ...records]);
    setUploadDialogOpen(false);
    setSelectedFile(null);
    setSelectedUser('');
    toast({
      title: 'Record Uploaded',
      description: `${selectedFile.name} has been added.`,
    });
  };

  const handleViewDetails = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setEditingFileName(record.fileName);
    setDetailDialogOpen(true);
  };
  
  const handleSaveDetails = () => {
    if (!selectedRecord) return;
    setRecords(records.map(r => r.id === selectedRecord.id ? {...r, fileName: editingFileName} : r));
    setDetailDialogOpen(false);
    setSelectedRecord(null);
    toast({
        title: 'Record Updated',
        description: `The file name has been updated.`
    })
  }

  const handleDelete = () => {
    if (!selectedRecord) return;
    setRecords(records.filter((r) => r.id !== selectedRecord.id));
    setDeleteDialogOpen(false);
    setSelectedRecord(null);
    toast({
      title: 'Record Deleted',
      description: 'The medical record has been removed.',
    });
  };

  const openDeleteDialog = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };


  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Medical Records</CardTitle>
            <CardDescription>
              Access and manage medical records for your users.
            </CardDescription>
          </div>
          <Button onClick={() => setUploadDialogOpen(true)}>
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
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.user}</TableCell>
                  <TableCell>{record.fileName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        record.fileType === 'Image'
                          ? 'default'
                          : record.fileType === 'PDF'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {record.fileType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(record.uploadDate).toLocaleDateString()}
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
                        <DropdownMenuItem onClick={() => handleViewDetails(record)}>
                          <FileText className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert('Simulating file download...')}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => openDeleteDialog(record)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
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
      
      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Medical Record</DialogTitle>
            <DialogDescription>
              Select a user and choose a file to upload.
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
                    <SelectItem key={index} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                File
              </Label>
              <Input
                id="file"
                type="file"
                className="col-span-3"
                onChange={(e) =>
                  setSelectedFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setUploadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleUpload}
              disabled={!selectedUser || !selectedFile}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
       {/* View/Edit Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Record Details</DialogTitle>
             <DialogDescription>
              View and edit the details for this medical record.
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label className="text-right">User</Label>
                 <p className="col-span-3 text-sm font-medium">{selectedRecord.user}</p>
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fileName" className="text-right">
                  File Name
                </Label>
                <Input
                  id="fileName"
                  value={editingFileName}
                  onChange={(e) => setEditingFileName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                 <Label className="text-right">File Type</Label>
                 <p className="col-span-3 text-sm">{selectedRecord.fileType}</p>
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label className="text-right">Upload Date</Label>
                 <p className="col-span-3 text-sm">{new Date(selectedRecord.uploadDate).toLocaleDateString()}</p>
               </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDetailDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleSaveDetails}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              record for &quot;{selectedRecord?.fileName}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedRecord(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
