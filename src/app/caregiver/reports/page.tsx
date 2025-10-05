'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>View Reports</CardTitle>
          <CardDescription>
            See reports on medicine adherence, task completion, and mood logs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Reporting functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
