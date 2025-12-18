"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { createEventAction } from "./event-actions";
import { useToast } from "@/components/ui/use-toast";

export function EventFormClient() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
        e.currentTarget.reset();
        setOpen(false);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full rounded-lg gap-2">
          <Plus className="w-4 h-4" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="rounded-lg border-2 mt-1"
            />
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
              className="rounded-lg border-2 mt-1"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
