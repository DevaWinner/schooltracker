import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useCallback,
	useEffect,
} from "react";
import { Application } from "../types/applications";
import { Document } from "../types/documents";
import { Institution } from "../types/institutions";
import { Events } from "../types/events";
import { useApplications } from "./ApplicationContext";
import { useDocuments } from "./DocumentContext";
import { useEvents } from "./EventContext";

interface SearchResults {
	applications: Application[];
	documents: Document[];
	institutions: Institution[];
	events: Events[];
}

interface SearchContextType {
	searchQuery: string;
	searchResults: SearchResults;
	isSearching: boolean;
	isSearchOpen: boolean;
	setIsSearchOpen: (isOpen: boolean) => void;
	handleSearch: (query: string) => void;
	clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType>({
	searchQuery: "",
	searchResults: {
		applications: [],
		documents: [],
		institutions: [],
		events: [],
	},
	isSearching: false,
	isSearchOpen: false,
	setIsSearchOpen: () => {},
	handleSearch: () => {},
	clearSearch: () => {},
});

export const SearchProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [searchResults, setSearchResults] = useState<SearchResults>({
		applications: [],
		documents: [],
		institutions: [],
		events: [],
	});

	const { applications } = useApplications();
	const { documents } = useDocuments();
	const { events } = useEvents();

	// Handle search input change
	const handleSearch = useCallback(
		(query: string) => {
			setSearchQuery(query);

			// Always open dropdown when typing (fixes issue where dropdown doesn't show after clearing)
			if (query.trim()) {
				setIsSearchOpen(true);
			}

			setIsSearching(true);

			if (!query.trim()) {
				setSearchResults({
					applications: [],
					documents: [],
					institutions: [],
					events: [],
				});
				setIsSearching(false);
				return;
			}

			const normalizedQuery = query.toLowerCase().trim();

			// Search applications
			const filteredApplications = applications
				.filter((app) => {
					const institutionName = (
						app.institution_details?.name ||
						app.institution_name ||
						app.institution ||
						""
					).toLowerCase();
					const programName = app.program_name.toLowerCase();
					const degreeType = app.degree_type?.toLowerCase() || "";
					const notes = app.notes?.toLowerCase() || "";

					return (
						institutionName.includes(normalizedQuery) ||
						programName.includes(normalizedQuery) ||
						degreeType.includes(normalizedQuery) ||
						notes.includes(normalizedQuery)
					);
				})
				.slice(0, 5); // Limit to 5 results

			// Search documents
			const filteredDocuments = documents
				.filter((doc) => {
					const fileName = doc.file_name.toLowerCase();
					const documentType = doc.document_type.toLowerCase();

					return (
						fileName.includes(normalizedQuery) ||
						documentType.includes(normalizedQuery)
					);
				})
				.slice(0, 5); // Limit to 5 results

			// Search events
			const filteredEvents = events
				.filter((event) => {
					const eventTitle = event.event_title.toLowerCase();
					const eventNotes = event.notes?.toLowerCase() || "";

					return (
						eventTitle.includes(normalizedQuery) ||
						eventNotes.includes(normalizedQuery)
					);
				})
				.slice(0, 5); // Limit to 5 results

			// Search institutions (from application data since we don't have separate institutions loaded)
			const institutionsMap = new Map<string, Institution>();

			applications.forEach((app) => {
				if (app.institution_details) {
					// Fix the TypeScript error by creating a proper Institution object
					// from the InstitutionDetails
					const details = app.institution_details;
					const institution: Institution = {
						id: details.id,
						name: details.name,
						country: details.country,
						rank: details.rank,
						overall_score: details.overall_score || "", // Provide empty string as fallback
					};

					const name = institution.name.toLowerCase();
					const country = institution.country.toLowerCase();

					if (
						name.includes(normalizedQuery) ||
						country.includes(normalizedQuery)
					) {
						institutionsMap.set(institution.id, institution);
					}
				}
			});

			setSearchResults({
				applications: filteredApplications,
				documents: filteredDocuments,
				institutions: Array.from(institutionsMap.values()).slice(0, 5),
				events: filteredEvents,
			});

			setIsSearching(false);
		},
		[applications, documents, events]
	);

	// Clear search results
	const clearSearch = useCallback(() => {
		setSearchQuery("");
		setSearchResults({
			applications: [],
			documents: [],
			institutions: [],
			events: [],
		});
		// Don't automatically close dropdown when clearing
		// Let the user decide if they want to start typing again
	}, []);

	// Only auto-close search when search is empty and focus is lost
	useEffect(() => {
		if (!searchQuery.trim() && !isSearching) {
			// Don't immediately close - this allows for refocus and new searches
			// setIsSearchOpen(false);
		}
	}, [searchQuery, isSearching]);

	return (
		<SearchContext.Provider
			value={{
				searchQuery,
				searchResults,
				isSearching,
				isSearchOpen,
				setIsSearchOpen,
				handleSearch,
				clearSearch,
			}}
		>
			{children}
		</SearchContext.Provider>
	);
};

export const useSearch = () => useContext(SearchContext);
