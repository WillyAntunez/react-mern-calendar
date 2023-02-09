import { parseISO } from "date-fns";

export const convertEventsToDateEvents = (eventSource) => {
    return eventSource.map(event => {
        event.end = parseISO( event.end );
        event.start = parseISO( event.start );

        return event;
    });
};