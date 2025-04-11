import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";

type SidebarContextType = {
	isExpanded: boolean;
	isMobileOpen: boolean;
	isHovered: boolean;
	activeItem: string | null;
	openSubmenu: string | null;
	toggleSidebar: () => void;
	toggleMobileSidebar: () => void;
	setIsHovered: (isHovered: boolean) => void;
	setActiveItem: (item: string | null) => void;
	toggleSubmenu: (item: string) => void;
	isHoverEnabled: boolean;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider");
	}
	return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isExpanded, setIsExpanded] = useState(true);
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [activeItem, setActiveItem] = useState<string | null>(null);
	const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
	const [isHoverEnabled, setIsHoverEnabled] = useState(true);

	// Use a stable wrapper for setIsHovered to avoid unnecessary rerenders
	const handleSetIsHovered = useCallback(
		(hovered: boolean) => {
			// Only update hover state if hover expansion is enabled
			if (isHoverEnabled && hovered) {
				setIsHovered(hovered);
			} else {
				setIsHovered(false);
			}
		},
		[isHoverEnabled]
	);

	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth < 768;
			setIsMobile(mobile);

			// If we're switching to mobile, ensure sidebar is expanded
			if (mobile && !isMobile) {
				setIsExpanded(true);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [isMobile]);

	const toggleSidebar = useCallback(() => {
		setIsExpanded((prev) => {
			const newState = !prev;
			// When toggling, update hover enabled state
			// Only enable hover expanding when the sidebar is expanded
			setIsHoverEnabled(newState);
			return newState;
		});
	}, []);

	const toggleMobileSidebar = useCallback(() => {
		setIsMobileOpen((prev) => !prev);
	}, []);

	const toggleSubmenu = useCallback((item: string) => {
		setOpenSubmenu((prev) => (prev === item ? null : item));
	}, []);

	return (
		<SidebarContext.Provider
			value={{
				isExpanded: isMobile ? true : isExpanded,
				isMobileOpen,
				isHovered,
				activeItem,
				openSubmenu,
				toggleSidebar,
				toggleMobileSidebar,
				setIsHovered: handleSetIsHovered,
				setActiveItem,
				toggleSubmenu,
				isHoverEnabled,
			}}
		>
			{children}
		</SidebarContext.Provider>
	);
};
