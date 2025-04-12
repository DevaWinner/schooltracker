import { Application } from "./applications";

export interface EventResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Application[];
}
