import React, { useState } from 'react';
import { useClasses, useCreateClass, useDeleteClass } from "@/hooks/queries/useClasses";
import { School, Plus, Trash2, Loader2, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';


export default function ClassesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [section, setSection] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const {
    data: classes = [],
    isLoading,
    error,
  } = useClasses();

  const createClassMutation = useCreateClass();
  const deleteClassMutation = useDeleteClass();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !section.trim()) {
      setSubmitError('Class name and Section are required.');
      return;
    }
    createClassMutation.mutate(
      {
        name,
        section,
        room_number: roomNumber || undefined,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setName('');
          setSection('');
          setRoomNumber('');
          setSubmitError('');
        },
        onError: (err: any) => {
          setSubmitError(err.message || 'Failed to create class.');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-destructive">
        <h2 className="text-lg font-bold">Error loading Classes</h2>
        <p className="text-sm mt-1">
          {error instanceof Error ? error.message : 'Something went wrong.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-left">
            Classes
          </h1>
          <p className="text-muted-foreground text-left text-sm mt-1">
            Manage academic classrooms, grade divisions, and assigned room
            locations.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="cursor-pointer">
          <Plus className="size-4 mr-2" />
          Add Class
        </Button>
      </div>

      {deleteError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-fade-in">
          <AlertCircle className="size-4 shrink-0 text-destructive" />
          <span className="text-sm font-semibold">{deleteError}</span>
        </div>
      )}

      {classes.length === 0 ? (
        <Card className="border-dashed border-2 py-16 flex flex-col items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <School className="size-6" />
          </div>
          <h3 className="font-semibold text-lg text-foreground">
            No Classes Yet
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-sm text-center">
            Get started by creating your first grade or classroom section to
            enroll students.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer"
          >
            <Plus className="size-4 mr-2" />
            Add First Class
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map(cls => (
            <Card
              key={cls.id}
              className="hover:shadow-md transition-all border-border relative overflow-hidden group"
            >
              <CardHeader className="pb-2 text-left">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold">
                      {cls.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Section: {cls.section}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteClassMutation.mutate(cls.id, {
                      onSuccess: () => setDeleteError(''),
                      onError: (err: any) => setDeleteError(err.message || 'Failed to delete class.')
                    })}
                    disabled={
                      deleteClassMutation.isPending &&
                      deleteClassMutation.variables === cls.id
                    }
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer size-8"
                  >
                    {deleteClassMutation.isPending &&
                    deleteClassMutation.variables === cls.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-left pt-4 border-t border-border/50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    Room: {cls.room_number || 'Not assigned'}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {cls.students_count}{' '}
                    {cls.students_count === 1 ? 'student' : 'students'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Class Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-card border-border animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="relative text-left pb-4 border-b border-border">
              <CardTitle className="text-xl">Create New Class</CardTitle>
              <CardDescription>
                Configure name, section, and room location.
              </CardDescription>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-6 text-left">
                {submitError && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-fade-in">
                    <AlertCircle className="size-4 shrink-0 text-destructive" />
                    <span className="text-xs font-semibold">{submitError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-foreground"
                  >
                    Class Name *
                  </label>
                  <Input
                    id="name"
                    placeholder="e.g. Grade 10, Kindergarten"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="section"
                    className="text-sm font-semibold text-foreground"
                  >
                    Section / Division *
                  </label>
                  <Input
                    id="section"
                    placeholder="e.g. A, B, Red, Blue"
                    value={section}
                    onChange={e => setSection(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="room"
                    className="text-sm font-semibold text-foreground"
                  >
                    Room Number
                  </label>
                  <Input
                    id="room"
                    placeholder="e.g. 102, Lab A (Optional)"
                    value={roomNumber}
                    onChange={e => setRoomNumber(e.target.value)}
                  />
                </div>
              </CardContent>

              <div className="flex justify-end gap-3 p-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createClassMutation.isPending}
                  className="cursor-pointer"
                >
                  {createClassMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Class'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
