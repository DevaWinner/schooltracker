export interface EventResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Events[];
}

export interface Events {
    id: 1,
    application: number | null,
    event_title: string,
    event_color: string,
    event_date: string,
    notes: string,
    created_at: string,
    updated_at: string
}

export interface EventRequest {
    application: number | null,
    event_title: string,
    event_color: string,
    event_date: string,
    notes: string
}
