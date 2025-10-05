'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function UsersPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
          <CardDescription>
            Here you can add, edit, and view the users you are caring for.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>User management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
