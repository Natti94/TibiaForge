import { useState, useEffect } from "react";
import { fetchEvents } from "../../../../../services/media/events";

function Events() {
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const isProd = import.meta.env.PROD;

  const assets = {
    events_banner: isProd
      ? `/api/getAsset?assets=events_banner`
      : import.meta.env.VITE_CLOUDINARY_EVENTS_BANNER,
  };

  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoading(true);
        const data = await fetchEvents();
        setEvent(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, []);

  return (
    <div className="media__events-card">
      <img
        className="media__events-banner"
        src={assets.events_banner}
        alt="Events Banner"
      />
      <div className="media__events-title">Current Event</div>
      {loading && <div className="media__events">Loading events…</div>}
      {!loading && error && <div className="media__events">{error}</div>}
      {!loading && !error && event && (
        <div className="media__events">
          {event?.excerpt && (
            <p className="media__events-excerpt">{event.excerpt}</p>
          )}
          {[
            { label: "Name", value: event.name },
            { label: "Location", value: event.location },
            { label: "Start Date", value: event.start_date },
            { label: "Reward", value: event.reward },
            { label: "Time", value: event.time },
            { label: "Level", value: event.level },
            { label: "Dangers", value: event.danger },
          ].map(({ label, value }) => (
            <p key={label} className="media__events-property">
              <strong>{label}:</strong> {value || "Unknown"}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
export default Events;
