'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function SchedulesPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Schedules</CardTitle>
          <CardDescription>
            Set up and manage medicine and task schedules for your users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Schedules management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
