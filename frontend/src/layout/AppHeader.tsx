import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";
import { TiThMenu } from "react-icons/ti";
import { TbMenuOrder, TbMenu } from "react-icons/tb";

const AppHeader: React.FC = () => {
	const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

	const { isMobileOpen, toggleMobileSidebar, setMobileOpen } = useSidebar();

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

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "k") {
				event.preventDefault();
				inputRef.current?.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
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

					{/* Search bar */}
					<div className="hidden lg:block pl-12">
						<form>
							<div className="relative">
								<span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
									<svg
										className="fill-gray-500 dark:fill-gray-400"
										width="20"
										height="20"
										viewBox="0 0 20 20"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
											fill=""
										/>
									</svg>
								</span>
								<input
									ref={inputRef}
									type="text"
									placeholder="Search or type command..."
									className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-90</motion.div>0 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
								/>

								<button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
									<span> ⌘ </span>
									<span> K </span>
								</button>
							</div>
						</form>
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
	);
};

export default AppHeader;
