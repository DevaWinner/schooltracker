import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";
import { TiThMenu } from "react-icons/ti";
import { TbMenuOrder, TbMenu } from "react-icons/tb";
import { useSearch } from "../context/SearchContext";
import SearchDropdown from "../components/search/SearchDropdown";
import { FaSearch } from "react-icons/fa";

const AppHeader: React.FC = () => {
	const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
	const { isMobileOpen, toggleMobileSidebar, setMobileOpen } = useSidebar();
	const {
		searchQuery,
		searchResults,
		isSearching,
		isSearchOpen,
		setIsSearchOpen,
		handleSearch,
		clearSearch,
	} = useSearch();
	const searchRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	// Add effect to handle screen resize and reset mobile sidebar state
	useEffect(() => {
		const handleResize = () => {
			const isMobile = window.innerWidth < 1024;

			// When switching to desktop view, reset mobile sidebar state
			if (!isMobile && isMobileOpen) {
				setMobileOpen(false);
			}
		};

		// Set initial state
		handleResize();

		// Add resize listener
		window.addEventListener("resize", handleResize);

		// Cleanup
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [isMobileOpen, setMobileOpen]);

	const toggleApplicationMenu = () => {
		setApplicationMenuOpen(!isApplicationMenuOpen);
	};

	// Handle clicks outside the search dropdown to close it
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setIsSearchOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [setIsSearchOpen]);

	// Keyboard shortcut for search input focus
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "k") {
				event.preventDefault();
				if (searchInputRef.current) {
					searchInputRef.current.focus();
					setIsSearchOpen(true);
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [setIsSearchOpen]);

	// Handle input change and ensure dropdown opens
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		handleSearch(value);
		if (value.trim()) {
			setIsSearchOpen(true);
		}
	};

	// Handle search input clearing with dropdown staying open
	const handleClearSearch = () => {
		clearSearch();
		if (searchInputRef.current) {
			searchInputRef.current.focus();
		}
	};

	return (
		<>
			<header className="sticky top-0 flex w-full bg-white border-gray-200 z-[60] dark:border-gray-800 dark:bg-gray-900 lg:border-b">
				<div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
					<div className="flex items-center w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
						{/* Add hamburger menu button for mobile */}
						<button
							className="flex lg:hidden items-center justify-center w-10 h-10 text-gray-400 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800"
							onClick={toggleMobileSidebar}
						>
							<div className="dark:block hidden">
								<TiThMenu size={26} className="text-gray-300" />
							</div>
							<div className="dark:hidden block">
								<TiThMenu size={26} className="text-gray-600" />
							</div>
						</button>

						{/* Logo - always visible */}
						<Link to="/" className="flex-1 text-center lg:text-left lg:hidden">
							<span className="text-2xl font-bold text-gray-900 dark:hidden">
								School Tracker
							</span>
							<span className="text-2xl font-bold text-white hidden dark:block">
								School Tracker
							</span>
						</Link>

						{/* Menu for mobile */}
						<button
							onClick={toggleApplicationMenu}
							className="flex lg:hidden items-center justify-center w-10 h-10 text-gray-400 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800"
						>
							{isApplicationMenuOpen ? (
								<>
									<div className="dark:block hidden">
										<TbMenu size={24} className="text-gray-400" />
									</div>
									<div className="dark:hidden block">
										<TbMenu size={24} className="text-gray-600" />
									</div>
								</>
							) : (
								<>
									<div className="dark:block hidden">
										<TbMenuOrder size={24} className="text-gray-400" />
									</div>
									<div className="dark:hidden block">
										<TbMenuOrder size={24} className="text-gray-600" />
									</div>
								</>
							)}
						</button>

						{/* Search bar - updated for inline search */}
						<div className="hidden lg:block pl-12 relative" ref={searchRef}>
							<div className="relative">
								<div className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
									<FaSearch
										className="text-gray-400 dark:text-gray-500"
										size={16}
									/>
								</div>
								<input
									ref={searchInputRef}
									id="global-search-input-app"
									type="text"
									placeholder="Search or type command..."
									value={searchQuery}
									onChange={handleInputChange}
									onFocus={() => setIsSearchOpen(true)}
									className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
								/>
								{searchQuery && (
									<button
										className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
										onClick={handleClearSearch}
									>
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M18 6L6 18M6 6L18 18"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</button>
								)}
								{!searchQuery && (
									<div className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
										<span> ⌘ </span>
										<span> K </span>
									</div>
								)}
							</div>

							{/* Search Dropdown */}
							<SearchDropdown
								isOpen={isSearchOpen}
								onClose={() => setIsSearchOpen(false)}
								applications={searchResults.applications}
								documents={searchResults.documents}
								institutions={searchResults.institutions}
								events={searchResults.events}
								isSearching={isSearching}
								query={searchQuery}
							/>
						</div>
					</div>

					{/* User menu section */}
					<div
						className={`${
							isApplicationMenuOpen ? "flex" : "hidden"
						} items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
					>
						<div className="flex items-center gap-2 2xsm:gap-3">
							{/* <!-- Dark Mode Toggler --> */}
							<ThemeToggleButton />
							{/* <!-- Dark Mode Toggler --> */}
							<NotificationDropdown />
							{/* <!-- Notification Menu Area --> */}
						</div>
						{/* <!-- User Area --> */}
						<UserDropdown />
					</div>
				</div>
			</header>
		</>
	);
};

export default AppHeader;
