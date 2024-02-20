import { AuthContextData } from "../contexts/AuthContext";
import { TEvent } from "./eventTypes";

const EVENTS_ENDPOINT = "https://api.hackthenorth.com/v3/graphql";

export function getAllEventsPreview(
  loginData: AuthContextData
): Promise<TEvent[]> {
  const query = `
          query {
            sampleEvents {
            id
            name
            event_type
            permission
            start_time
          }
        }`;
  const reqBody = JSON.stringify({ query: query });

  return new Promise((resolve, reject) => {
    fetch(EVENTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: reqBody,
    })
      .then((response) => {
        return response.json();
      })
      .then((response_json) => {
        const events_raw: TEvent[] = response_json.data.sampleEvents;

        // filter for public events if logged out
        let events_filtered;
        if (loginData.loginState === "logged out") {
          events_filtered = events_raw.filter(
            (event) => event.permission == "public"
          );
        } else {
          events_filtered = events_raw;
        }

        //sort by starttime
        const events_sorted = events_filtered.sort(
          (a, b) => a.start_time - b.start_time
        );
        resolve(events_sorted);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function getEventFullFromId(
  event_id: number,
  loginData: AuthContextData
): Promise<TEvent> {
  let query;
  //if logged in, get private url, otherwise, get public url
  //this way, if user is not logged in, private url will never make it to client-side for increased security
  if (loginData.loginState === "logged in") {
    query = `
        query {
            sampleEvent (id: ${event_id}) {
            id
            name
            event_type
            permission
            start_time
            end_time
            description
            speakers {
            name
            }
            private_url
            related_events
            }
        }`;
  } else {
    query = `
        query {
            sampleEvent (id: ${event_id}) {
            id
            name
            event_type
            permission
            start_time
            end_time
            description
            speakers {
            name
            }
            public_url
            related_events
            }
        }`;
  }
  const reqBody = JSON.stringify({ query: query });
  const response = await fetch(EVENTS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: reqBody,
  });
  const response_json = await response.json();
  return response_json.data.sampleEvent;
}

export async function getEventNameFromId(related_event_id: number) {
  const query = `
      query {
        sampleEvent (id: ${related_event_id}) {
        id
        name
        permission
        }
      }`;
  const reqBody = JSON.stringify({ query: query });
  const response = await fetch(EVENTS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: reqBody,
  });
  const response_json = await response.json();
  return response_json.data.sampleEvent;
}

export async function getAllEventsNamesFromId(
  eventIds: number[],
  loginData: AuthContextData
) {
  //send all requests for events data concurrently for better performance
  const events_promises = eventIds.map((event_id) => {
    return getEventNameFromId(event_id);
  });
  const events_raw = await Promise.all(events_promises);

  // if logged out, filter out events that are private
  let events_filtered;
  if (loginData.loginState === "logged out") {
    events_filtered = events_raw.filter(
      (event) => event.permission === "public"
    );
  } else {
    events_filtered = events_raw;
  }
  return events_filtered;
}
