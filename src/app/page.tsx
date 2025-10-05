import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, User, HeartHandshake } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-image');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center container">
        <Logo />
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_650px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Compassionate care, connected.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    DualCare Connect simplifies daily care for your loved ones,
                    providing peace of mind for caregivers and accessible
                    support for users.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/login?role=caregiver">
                      <HeartHandshake className="mr-2 h-5 w-5" />
                      Caregiver Portal
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/login?role=user">
                      <User className="mr-2 h-5 w-5" />
                      User Login
                    </Link>
                  </Button>
                </div>
              </div>
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={650}
                  height={450}
                  className="mx-auto aspect-[4/3] overflow-hidden rounded-xl object-cover sm:w-full"
                  data-ai-hint={heroImage.imageHint}
                  priority
                />
              )}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Choose Your Path
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Whether you're providing care or receiving it, DualCare
                  Connect offers a tailored experience designed for your needs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-2 mt-12">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HeartHandshake className="w-8 h-8 text-primary" />
                    <span className="text-2xl font-headline">
                      For Caregivers
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Manage schedules, track progress, and stay connected with
                    ease.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Register and manage multiple users.</li>
                    <li>Set medicine and task schedules.</li>
                    <li>Receive real-time alerts and updates.</li>
                    <li>View activity dashboards and reports.</li>
                  </ul>
                  <Button asChild variant="link" className="px-0">
                    <Link href="/login?role=caregiver">
                      Go to Caregiver Portal{' '}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-8 h-8 text-primary" />
                    <span className="text-2xl font-headline">For Users</span>
                  </CardTitle>
                  <CardDescription>
                    A simple, accessible interface for your daily routine.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Large, easy-to-press buttons.</li>
                    <li>Clear view of daily medicines and tasks.</li>
                    <li>One-tap SOS button for emergencies.</li>
                    <li>Mood tracking and simple interactions.</li>
                  </ul>
                  <Button asChild variant="link" className="px-0">
                    <Link href="/login?role=user">
                      Go to User Login <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t container">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} DualCare Connect. All rights
          reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
