"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ExternalLink, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export function EventsScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const today = new Date().toDateString();

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/events");
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }

  const todayEvents = events.filter(
    (event) => new Date(event.date).toDateString() === today
  );
  const upcomingEvents = events.filter(
    (event) => new Date(event.date) > new Date()
  );
  const pastEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const now = new Date();
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    return eventDate < now && eventDate >= fiveDaysAgo;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold">Campus Events</h1>
        <p className="text-sm opacity-90 mt-1">
          Discover & register for events
        </p>
      </div>

      {/* Ad Placeholder */}
      <div className="bg-muted border border-border m-4 rounded-lg p-4 text-center">
        <p className="text-muted-foreground text-sm">Advertisement Banner</p>
      </div>

      <div className="px-4 pb-24 space-y-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-destructive">
                Error loading events
              </p>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-muted-foreground">
              Loading events...
            </div>
          </div>
        ) : events.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No events available</p>
            <p className="text-sm text-muted-foreground mt-2">
              Check back soon for upcoming campus events!
            </p>
          </Card>
        ) : (
          <>
            {/* Today's Events */}
            {todayEvents.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-accent rounded-full" />
                  <h2 className="text-lg font-semibold">Happening Today</h2>
                  <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                    {todayEvents.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {todayEvents.map((event) => (
                    <EventCard
                      key={event._id || event.id}
                      event={event}
                      isToday
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  <h2 className="text-lg font-semibold">Upcoming Events</h2>
                  <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full font-medium">
                    {upcomingEvents.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event._id || event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-muted-foreground rounded-full" />
                  <h2 className="text-lg font-semibold">Past Events</h2>
                  <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full font-medium">
                    {pastEvents.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {pastEvents.map((event) => (
                    <EventCard
                      key={event._id || event.id}
                      event={event}
                      isPast
                    />
                  ))}
                </div>
              </div>
            )}

            {todayEvents.length === 0 &&
              upcomingEvents.length === 0 &&
              pastEvents.length > 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">
                  No upcoming events at the moment. View past events below.
                </p>
              )}
          </>
        )}
      </div>
    </div>
  );
}

function EventCard({
  event,
  isToday = false,
  isPast = false,
}: {
  event: any;
  isToday?: boolean;
  isPast?: boolean;
}) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card
      className={`overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
        isPast ? "opacity-75" : ""
      }`}
    >
      {/* Event Image/Banner */}
      <div className="h-40 bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl overflow-hidden relative">
        {event.image ? (
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        ) : (
          "📅"
        )}
        {isPast && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span className="text-white font-bold text-sm px-3 py-1 bg-black/40 rounded-full">
              Past Event
            </span>
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="p-4 space-y-3">
        {/* Badge & Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {isToday && (
              <span className="inline-block bg-accent text-accent-foreground text-xs px-2.5 py-1 rounded-full font-medium">
                🔴 Today
              </span>
            )}
            {isPast && (
              <span className="inline-block bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full font-medium">
                ✓ Completed
              </span>
            )}
          </div>
          <h3 className="font-bold text-lg leading-tight">{event.name}</h3>
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Event Information */}
        <div className="space-y-2 pt-2 border-t border-border">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>
              {formattedDate}
              {event.time && ` at ${event.time}`}
            </span>
          </div>

          {/* Venue */}
          {event.venue && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{event.venue}</span>
            </div>
          )}
        </div>

        {/* Registration Button */}
        {!isPast ? (
          event.registrationLink ? (
            <Button
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg gap-2 mt-2"
              onClick={() => window.open(event.registrationLink, "_blank")}
            >
              Register Now
              <ExternalLink className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              className="w-full bg-muted text-muted-foreground cursor-not-allowed rounded-lg mt-2"
              disabled
            >
              Registration Closed
            </Button>
          )
        ) : (
          <div className="text-center text-xs text-muted-foreground py-2">
            Event has ended
          </div>
        )}
      </div>
    </Card>
  );
}
