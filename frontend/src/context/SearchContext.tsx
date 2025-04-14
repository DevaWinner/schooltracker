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
import { getInstitutions } from "../api/institutions";

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
	const [directoryInstitutions, setDirectoryInstitutions] = useState<
		Institution[]
	>([]);
	const [lastInstitutionsFetch, setLastInstitutionsFetch] =
		useState<Date | null>(null);

	const { applications } = useApplications();
	const { documents } = useDocuments();
	const { events } = useEvents();

	// Fetch institutions from directory for searching
	const fetchDirectoryInstitutions = useCallback(async () => {
		// Only fetch once every 30 minutes
		const shouldFetch =
			!lastInstitutionsFetch ||
			new Date().getTime() - lastInstitutionsFetch.getTime() > 30 * 60 * 1000;

		if (shouldFetch) {
			try {
				// Get top institutions for search (limit to 500 for performance)
				const response = await getInstitutions({ page_size: 500 });
				setDirectoryInstitutions(response.results);
				setLastInstitutionsFetch(new Date());
			} catch (error) {
				// Silently fail and use existing institutions data
				console.error("Error fetching institutions for search:", error);
			}
		}
	}, [lastInstitutionsFetch]);

	// Fetch institutions when the provider mounts
	useEffect(() => {
		fetchDirectoryInstitutions();
	}, [fetchDirectoryInstitutions]);

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

			// Search institutions from directory first
			const directoryFilteredInstitutions = directoryInstitutions
				.filter((inst) => {
					const name = inst.name.toLowerCase();
					const country = inst.country.toLowerCase();

					return (
						name.includes(normalizedQuery) || country.includes(normalizedQuery)
					);
				})
				.slice(0, 5); // Limit to 5 results

			// If we found less than 5 institutions from directory, also search from applications
			if (directoryFilteredInstitutions.length < 5) {
				// Create a set of institution IDs we've already found
				const institutionIds = new Set(
					directoryFilteredInstitutions.map((inst) => inst.id)
				);

				// Build an institutions map for remaining slots (if any)
				const institutionsMap = new Map<string, Institution>();

				// Only process if we need more results
				if (directoryFilteredInstitutions.length < 5) {
					applications.forEach((app) => {
						if (
							app.institution_details &&
							!institutionIds.has(app.institution_details.id)
						) {
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
				}

				// Combine the results, limiting to 5 total
				const combinedInstitutions = [
					...directoryFilteredInstitutions,
					...Array.from(institutionsMap.values()),
				].slice(0, 5);

				setSearchResults({
					applications: filteredApplications,
					documents: filteredDocuments,
					institutions: combinedInstitutions,
					events: filteredEvents,
				});
			} else {
				// Just use the directory institutions if we found enough
				setSearchResults({
					applications: filteredApplications,
					documents: filteredDocuments,
					institutions: directoryFilteredInstitutions,
					events: filteredEvents,
				});
			}

			setIsSearching(false);
		},
		[applications, documents, events, directoryInstitutions]
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
