import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Header from "../Header.jsx";
import { fetchEvent, deleteEvent } from "../../util/http.js";

export default function EventDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["event", params.id],
    queryFn: ({ signal }) => fetchEvent({ id: params.id, signal }),
  });

  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteEvent({ id: params.id }),
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      navigate("/events");
    },
    onError: (err) => {
      alert(`Error deleting event: ${err.message}`);
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  if (!data) return <p>No data found</p>;

  function handleDeleteEvent() {
    mutate();
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleDeleteEvent} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt="image" />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{data.date}</time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </article>
    </>
  );
}
