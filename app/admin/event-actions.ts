"use server";

import dbConnect from "@/app/db";
import Event from "@/app/models/events.model";
import { revalidatePath } from "next/cache";

export async function createEventAction(formData: FormData) {
  try {
    await dbConnect();

    const name = formData.get("name") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const venue = formData.get("venue") as string;
    const registrationLink = formData.get("registrationLink") as string;
    const image = formData.get("image") as string;
    const description = formData.get("description") as string;

    if (!name || !date) {
      return { success: false, error: "Name and date are required" };
    }

    // Generate unique ID from name and timestamp
    const eventId = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

    const newEvent = await Event.create({
      id: eventId,
      name,
      date: new Date(date),
      time: time || undefined,
      venue: venue || undefined,
      registrationLink: registrationLink || undefined,
      image: image || undefined,
      description: description || undefined,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/events");
    revalidatePath("/");
    return { success: true, event: newEvent };
  } catch (error) {
    console.error("Create event error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create event",
    };
  }
}

export async function updateEventAction(formData: FormData) {
  try {
    await dbConnect();

    const eventId = formData.get("eventId") as string;
    const name = formData.get("name") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const venue = formData.get("venue") as string;
    const registrationLink = formData.get("registrationLink") as string;
    const image = formData.get("image") as string;
    const description = formData.get("description") as string;

    if (!eventId || !name || !date) {
      return { success: false, error: "Event ID, name, and date are required" };
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        name,
        date: new Date(date),
        time: time || undefined,
        venue: venue || undefined,
        registrationLink: registrationLink || undefined,
        image: image || undefined,
        description: description || undefined,
      },
      { new: true }
    );

    if (!updatedEvent) {
      return { success: false, error: "Event not found" };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/events");
    revalidatePath("/");
    return { success: true, event: updatedEvent };
  } catch (error) {
    console.error("Update event error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update event",
    };
  }
}

export async function deleteEventAction(eventId: string) {
  try {
    await dbConnect();

    if (!eventId) {
      return { success: false, error: "Event ID is required" };
    }

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return { success: false, error: "Event not found" };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/events");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete event error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete event",
    };
  }
}
