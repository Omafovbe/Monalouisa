'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSubjects } from '@/actions/actions'
import { enrollInSubject } from '@/actions/subject-actions'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { BookOpen, CheckCircle, AlertCircle, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link'

interface AvailableSubjectsProps {
  studentId: string;
  enrolledSubjectIds?: number[];
  hasActiveSubscription?: boolean;
}

// Define subject categories with their colors
const subjectCategories = {
  'Modern Art and Design': {
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    headerGradient:
      'from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900',
    icon: <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
    label: 'DESIGN',
    startDays: 3,
  },
  Presentation: {
    color: 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300',
    headerGradient:
      'from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900',
    icon: <BookOpen className="h-5 w-5 text-pink-600 dark:text-pink-400" />,
    label: 'SKILLS',
    startDays: 5,
  },
  'Artificial Intelligence': {
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    headerGradient:
      'from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900',
    icon: <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
    label: 'TECHNOLOGY',
    startDays: 2,
  },
  Business: {
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    headerGradient:
      'from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
    icon: <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    label: 'BUSINESS',
    startDays: 7,
  },
  Technology: {
    color:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
    headerGradient:
      'from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900',
    icon: <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
    label: 'TECHNOLOGY',
    startDays: 4,
  },
  'User Experience': {
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    headerGradient:
      'from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900',
    icon: <BookOpen className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
    label: 'DESIGN',
    startDays: 3,
  },
  // Default category
  default: {
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    headerGradient:
      'from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
    icon: <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    label: 'SUBJECT',
    startDays: 5,
  },
};

export function AvailableSubjects({
  studentId,
  enrolledSubjectIds = [],
  hasActiveSubscription = false,
}: AvailableSubjectsProps) {
  const [expandedSubject, setExpandedSubject] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['available-subjects'],
    queryFn: getSubjects,
  });

  const enrollMutation = useMutation({
    mutationFn: (subjectId: number) => enrollInSubject(subjectId, studentId),
    onSuccess: (result) => {
      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Successfully enrolled in subject',
      });
      queryClient.invalidateQueries({ queryKey: ['enrolled-subjects'] });
      queryClient.invalidateQueries({ queryKey: ['enrolled-subject-ids'] });
      queryClient.invalidateQueries({ queryKey: ['available-subjects'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to enroll in subject',
        variant: 'destructive',
      });
    },
  });

  const handleEnroll = (subjectId: number) => {
    if (!hasActiveSubscription) {
      toast({
        title: 'Subscription Required',
        description: 'You need an active subscription to enroll in subjects.',
        variant: 'destructive',
      });
      return;
    }
    enrollMutation.mutate(subjectId);
  };

  // Helper function to get category styling
  const getCategoryStyle = (subjectName: string) => {
    // Try to match subject name with a category
    const category =
      Object.keys(subjectCategories).find((cat) =>
        subjectName.toLowerCase().includes(cat.toLowerCase()),
      ) || 'default';

    return (
      subjectCategories[category as keyof typeof subjectCategories] ||
      subjectCategories.default
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading subjects:{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  const availableSubjects =
    data?.subjects?.filter(
      (subject: { id: number }) => !enrolledSubjectIds.includes(subject.id),
    ) || [];

  if (availableSubjects.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-3 text-lg font-semibold">No Available Subjects</h3>
          <p className="text-sm text-muted-foreground">
            You're already enrolled in all available subjects.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {!hasActiveSubscription && (
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Subscription Required</AlertTitle>
          <AlertDescription className="flex items-center gap-2">
            <span>You need an active subscription to enroll in subjects.</span>
            <Button asChild variant="link" className="h-auto p-0 font-normal">
              <Link href="/student/payments">Upgrade Now</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availableSubjects.map(
          (subject: {
            id: number;
            name: string;
            description: string | null;
          }) => {
            const categoryStyle = getCategoryStyle(subject.name);

            return (
              <Card
                key={subject.id}
                className="overflow-hidden rounded-xl border-0 transition-all hover:shadow-lg"
              >
                <CardHeader
                  className={`bg-gradient-to-r ${categoryStyle.headerGradient} p-6`}
                >
                  <div className="flex items-start justify-between">
                    <Badge
                      className={`${categoryStyle.color} mb-3 text-xs font-semibold uppercase`}
                    >
                      {categoryStyle.label}
                    </Badge>
                  </div>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    {subject.name}
                  </CardTitle>
                  <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>10 Sessions</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      <span>12 Students</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pt-6">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {subject.description || 'No description available.'}
                  </p>
                  {expandedSubject === subject.id && subject.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {subject.description}
                    </p>
                  )}
                  {subject.description && subject.description.length > 150 && (
                    <button
                      onClick={() =>
                        setExpandedSubject(
                          expandedSubject === subject.id ? null : subject.id,
                        )
                      }
                      className="mt-2 text-xs text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {expandedSubject === subject.id
                        ? 'Show less'
                        : 'Read more'}
                    </button>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3 px-6 pb-6 pt-2">
                  {/* <div className='text-sm text-muted-foreground'>
                    Starts in {categoryStyle.startDays} days
                  </div> */}
                  <Button
                    className="w-full"
                    onClick={() => handleEnroll(subject.id)}
                    disabled={
                      enrollMutation.isPending || !hasActiveSubscription
                    }
                  >
                    {enrollMutation.isPending &&
                    enrollMutation.variables === subject.id ? (
                      <>
                        <Spinner size={16} className="mr-2" />
                        Enrolling...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {hasActiveSubscription
                          ? 'Enroll'
                          : 'Subscription Required'}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          },
        )}
      </div>
    </div>
  );
}
