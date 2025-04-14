import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
	GridIcon,
	CalenderIcon,
	ListIcon,
	PageIcon,
	BoxCubeIcon,
	PlugInIcon,
	ChevronDownIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import {
	TbLayoutSidebarRightExpandFilled,
	TbLayoutSidebarLeftExpandFilled,
} from "react-icons/tb";

type NavItem = {
	name: string;
	icon: React.ReactNode;
	path?: string;
	subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
	{
		icon: <GridIcon />,
		name: "Dashboard",
		path: "/",
	},
	{
		icon: <ListIcon />,
		name: "Applications",
		path: "/applications/tracker",
	},
	{
		icon: <PageIcon />,
		name: "Documents",
		path: "/documents/library",
	},
	{
		icon: <BoxCubeIcon />,
		name: "School Directory",
		path: "/directory/search",
	},
	{
		icon: <CalenderIcon />,
		name: "Calendar",
		path: "/calendar",
	},
	{
		icon: <PlugInIcon />,
		name: "Recommendations",
		path: "/recommendations",
	},
];

const AppSidebar: React.FC = () => {
	const {
		isExpanded,
		isMobileOpen,
		isHovered,
		setIsHovered,
		isHoverEnabled,
		toggleMobileSidebar,
		toggleSidebar,
	} = useSidebar();
	const [isMobileScreen, setIsMobileScreen] = useState(false);
	const location = useLocation();

	const [openSubmenu, setOpenSubmenu] = useState<{ index: number } | null>(
		null
	);
	const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
		{}
	);
	const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

	const hoverTimeoutRef = useRef<number | null>(null);

	const [tooltipItem, setTooltipItem] = useState<string | null>(null);
	const [tooltipPosition, setTooltipPosition] = useState({ top: 0 });

	const isActive = useCallback(
		(path: string) => location.pathname === path,
		[location.pathname]
	);

	const handleTooltipEnter = (
		name: string,
		e: React.MouseEvent<HTMLElement>
	) => {
		if (!isExpanded && !isHovered) {
			const target = e.currentTarget;
			const rect = target.getBoundingClientRect();
			setTooltipPosition({
				top: rect.top + rect.height / 2,
			});
			setTooltipItem(name);
		}
	};

	const handleTooltipLeave = () => {
		setTooltipItem(null);
	};

	useEffect(() => {
		let submenuMatched = false;
		navItems.forEach((nav, index) => {
			if (nav.subItems) {
				nav.subItems.forEach((subItem) => {
					if (isActive(subItem.path)) {
						setOpenSubmenu({ index });
						submenuMatched = true;
					}
				});
			}
		});

		if (!submenuMatched) {
			setOpenSubmenu(null);
		}
	}, [location, isActive]);

	useEffect(() => {
		if (openSubmenu !== null) {
			const key = `main-${openSubmenu.index}`;
			if (subMenuRefs.current[key]) {
				setSubMenuHeight((prevHeights) => ({
					...prevHeights,
					[key]: subMenuRefs.current[key]?.scrollHeight || 0,
				}));
			}
		}
	}, [openSubmenu]);

	const handleSubmenuToggle = (index: number) => {
		setOpenSubmenu((prev) => (prev && prev.index === index ? null : { index }));
	};

	useEffect(() => {
		return () => {
			if (hoverTimeoutRef.current) {
				clearTimeout(hoverTimeoutRef.current);
			}
		};
	}, []);

	useEffect(() => {
		const handleResize = () => {
			setIsMobileScreen(window.innerWidth < 1024);
			if (window.innerWidth < 1200) {
				setIsHovered(false);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [setIsHovered]);

	const handleNavItemClick = () => {
		if (isMobileScreen || window.innerWidth < 1024) {
			toggleMobileSidebar();
		}
	};

	const renderMenuItems = (items: NavItem[]) => (
		<ul className="flex flex-col gap-4">
			{items.map((nav, index) => (
				<li
					key={nav.name}
					onMouseEnter={(e) => handleTooltipEnter(nav.name, e)}
					onMouseLeave={handleTooltipLeave}
					className="relative"
				>
					{nav.subItems ? (
						<button
							onClick={() => handleSubmenuToggle(index)}
							className={`menu-item group ${
								openSubmenu?.index === index
									? "menu-item-active"
									: "menu-item-inactive"
							} cursor-pointer ${
								!isExpanded && !isHovered
									? "lg:justify-center"
									: "lg:justify-start"
							}`}
						>
							<span
								className={`menu-item-icon-size ${
									openSubmenu?.index === index
										? "menu-item-icon-active"
										: "menu-item-icon-inactive"
								}`}
							>
								{nav.icon}
							</span>
							{(isExpanded || isHovered || isMobileOpen) && (
								<span className="menu-item-text">{nav.name}</span>
							)}
							{(isExpanded || isHovered || isMobileOpen) && (
								<ChevronDownIcon
									className={`ml-auto w-5 h-5 transition-transform duration-200 ${
										openSubmenu?.index === index
											? "rotate-180 text-brand-500"
											: ""
									}`}
								/>
							)}
						</button>
					) : (
						nav.path && (
							<Link
								to={nav.path}
								onClick={handleNavItemClick}
								className={`menu-item group ${
									isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
								}`}
							>
								<span
									className={`menu-item-icon-size ${
										isActive(nav.path)
											? "menu-item-icon-active"
											: "menu-item-icon-inactive"
									}`}
								>
									{nav.icon}
								</span>
								{(isExpanded || isHovered || isMobileOpen) && (
									<span className="menu-item-text">{nav.name}</span>
								)}
							</Link>
						)
					)}
					{nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
						<div
							ref={(el) => {
								subMenuRefs.current[`main-${index}`] = el;
							}}
							className="overflow-hidden transition-all duration-300"
							style={{
								height:
									openSubmenu?.index === index
										? `${subMenuHeight[`main-${index}`]}px`
										: "0px",
							}}
						>
							<ul className="mt-2 space-y-1 ml-9">
								{nav.subItems.map((subItem) => (
									<li key={subItem.name}>
										<Link
											to={subItem.path}
											onClick={handleNavItemClick}
											className={`menu-dropdown-item ${
												isActive(subItem.path)
													? "menu-dropdown-item-active"
													: "menu-dropdown-item-inactive"
											}`}
										>
											{subItem.name}
											<span className="flex items-center gap-1 ml-auto">
												{subItem.new && (
													<span
														className={`ml-auto ${
															isActive(subItem.path)
																? "menu-dropdown-badge-active"
																: "menu-dropdown-badge-inactive"
														} menu-dropdown-badge`}
													>
														new
													</span>
												)}
												{subItem.pro && (
													<span
														className={`ml-auto ${
															isActive(subItem.path)
																? "menu-dropdown-badge-active"
																: "menu-dropdown-badge-inactive"
														} menu-dropdown-badge`}
													>
														pro
													</span>
												)}
											</span>
										</Link>
									</li>
								))}
							</ul>
						</div>
					)}
				</li>
			))}
		</ul>
	);

	const handleToggle = () => {
		if (isMobileScreen) {
			toggleMobileSidebar();
		} else {
			toggleSidebar();
		}
	};

	return (
		<>
			<aside
				className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen will-change-transform z-[70] border-r border-gray-200 
				${
					isExpanded || isMobileScreen
						? "w-[290px]"
						: isHovered && isHoverEnabled
						? "w-[290px]"
						: "w-[90px]"
				}
				${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
				lg:translate-x-0 transition-[width,transform] duration-300 ease-out`}
			>
				{/* Only show toggle button on desktop */}
				{!isMobileScreen && (
					<button
						onClick={handleToggle}
						className="absolute -right-5 top-15 flex items-center justify-center w-10 h-10 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 z-50 cursor-pointer transform transition-all duration-200 hover:scale-110 bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700"
						aria-label="Toggle Sidebar"
					>
						{isExpanded ? (
							<TbLayoutSidebarRightExpandFilled className="w-5 h-5" />
						) : (
							<TbLayoutSidebarLeftExpandFilled className="w-5 h-5" />
						)}
					</button>
				)}
				<div
					className={`py-8 mb-8 flex ${
						!isExpanded && !isHovered && !isMobileScreen
							? "lg:justify-center"
							: "justify-start"
					}`}
				>
					<Link to="/" className="hidden lg:block">
						{isExpanded || isHovered || isMobileScreen ? (
							<>
								<span className="text-3xl font-bold text-gray-900 dark:hidden">
									School Tracker
								</span>
								<span className="text-3xl font-bold text-white hidden dark:block">
									School Tracker
								</span>
							</>
						) : (
							<span className="text-xl font-bold text-gray-900 dark:text-white">
								ST
							</span>
						)}
					</Link>
				</div>
				<div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar pt-4">
					<nav className="mb-6 w-full">
						<div className="flex flex-col gap-4 w-full">
							{(isExpanded || isHovered || isMobileOpen || isMobileScreen) && (
								<h2 className="mb-4 text-xs uppercase flex leading-[20px] text-gray-400">
									Menu
								</h2>
							)}
							{renderMenuItems(navItems)}
						</div>
					</nav>
				</div>
			</aside>
			{tooltipItem && !isExpanded && !isHovered && (
				<div
					className="fixed z-[60] left-[90px] transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2.5 py-1.5 rounded shadow-md pointer-events-none"
					style={{ top: `${tooltipPosition.top}px` }}
				>
					<div className="flex items-center whitespace-nowrap">
						<div className="absolute left-[-6px] w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-gray-800 border-b-[6px] border-b-transparent"></div>
						{tooltipItem}
					</div>
				</div>
			)}
		</>
	);
};

export default AppSidebar;
