'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function RecordsPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Medical Records</CardTitle>
          <CardDescription>
            Access and manage medical records for your users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Medical records functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
