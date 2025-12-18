"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Edit2, Trash2, Loader2, Calendar, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  updateEventAction,
  deleteEventAction,
  createEventAction,
} from "../event-actions";

interface Event {
  _id: string;
  id: string;
  name: string;
  date: string;
  time?: string;
  venue?: string;
  registrationLink?: string;
  image?: string;
  description?: string;
}

export function EventsListClient({
  initialEvents,
}: {
  initialEvents: Event[];
}) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleCreateEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await createEventAction(formData);

      if (result.success) {
        toast({
          title: "Success",
          description: `Event "${result.event.name}" created successfully`,
        });
        setEvents([result.event, ...events]);
        e.currentTarget.reset();
        setCreateOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("eventId", editingEvent?._id || "");
      const result = await updateEventAction(formData);

      if (result.success) {
        toast({
          title: "Success",
          description: `Event "${result.event.name}" updated successfully`,
        });
        setEvents(
          events.map((evt) =>
            evt._id === editingEvent?._id ? result.event : evt
          )
        );
        setEditingEvent(null);
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteEvent(eventId: string) {
    setLoading(true);

    try {
      const result = await deleteEventAction(eventId);

      if (result.success) {
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
        setEvents(events.filter((evt) => evt._id !== eventId));
        setDeleteId(null);
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Create Event Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger asChild>
          <Button className="rounded-lg gap-2">
            <Plus className="w-4 h-4" />
            Create New Event
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-lg max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <EventForm onSubmit={handleCreateEvent} loading={loading} />
        </DialogContent>
      </Dialog>

      {/* Events List */}
      {events.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No events yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create your first event to get started
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <Card key={event._id} className="overflow-hidden">
              <div className="flex gap-4 p-4">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-24 h-24 object-cover rounded-lg shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg">{event.name}</h3>
                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {event.description}
                    </p>
                  )}
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(event.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        {event.time && ` at ${event.time}`}
                      </span>
                    </div>
                    {event.venue && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.venue}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingEvent(event)}
                        className="rounded-lg gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-lg max-w-md max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                      </DialogHeader>
                      <EventForm
                        onSubmit={handleUpdateEvent}
                        loading={loading}
                        initialEvent={editingEvent || undefined}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteId(event._id)}
                    className="rounded-lg gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Alert Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="rounded-lg">
          <AlertDialogTitle>Delete Event?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The event will be permanently deleted.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDeleteEvent(deleteId)}
              disabled={loading}
              className="rounded-lg"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface EventFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
  initialEvent?: Event;
}

function EventForm({ onSubmit, loading, initialEvent }: EventFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-sm font-medium">
          Event Name *
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., Tech Talk 2025"
          required
          disabled={loading}
          defaultValue={initialEvent?.name}
          className="rounded-lg border-2 mt-1"
        />
      </div>

      <div>
        <Label htmlFor="date" className="text-sm font-medium">
          Date *
        </Label>
        <Input
          id="date"
          name="date"
          type="date"
          required
          disabled={loading}
          defaultValue={
            initialEvent?.date
              ? new Date(initialEvent.date).toISOString().split("T")[0]
              : ""
          }
          className="rounded-lg border-2 mt-1"
        />
      </div>

      <div>
        <Label htmlFor="time" className="text-sm font-medium">
          Time
        </Label>
        <Input
          id="time"
          name="time"
          type="time"
          disabled={loading}
          defaultValue={initialEvent?.time}
          className="rounded-lg border-2 mt-1"
        />
      </div>

      <div>
        <Label htmlFor="venue" className="text-sm font-medium">
          Venue
        </Label>
        <Input
          id="venue"
          name="venue"
          placeholder="e.g., Main Auditorium"
          disabled={loading}
          defaultValue={initialEvent?.venue}
          className="rounded-lg border-2 mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Event details..."
          disabled={loading}
          defaultValue={initialEvent?.description}
          className="rounded-lg border-2 mt-1 min-h-20"
        />
      </div>

      <div>
        <Label htmlFor="image" className="text-sm font-medium">
          Event Photo URL
        </Label>
        <Input
          id="image"
          name="image"
          type="url"
          placeholder="https://..."
          disabled={loading}
          defaultValue={initialEvent?.image}
          className="rounded-lg border-2 mt-1"
        />
        {initialEvent?.image && (
          <img
            src={initialEvent.image}
            alt="Preview"
            className="mt-2 max-h-32 rounded-lg object-cover"
          />
        )}
      </div>

      <div>
        <Label htmlFor="registrationLink" className="text-sm font-medium">
          Registration Link
        </Label>
        <Input
          id="registrationLink"
          name="registrationLink"
          type="url"
          placeholder="https://..."
          disabled={loading}
          defaultValue={initialEvent?.registrationLink}
          className="rounded-lg border-2 mt-1"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          className="flex-1 rounded-lg"
          onClick={() => {
            // Form will close via Dialog's onOpenChange
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading
            ? "Saving..."
            : initialEvent
            ? "Update Event"
            : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
