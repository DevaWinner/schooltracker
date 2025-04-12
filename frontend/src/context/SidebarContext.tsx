import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	useRef,
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
	setMobileOpen: (isOpen: boolean) => void;
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

	// Store previous desktop sidebar state
	const prevDesktopExpandedState = useRef(true);

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
			const mobile = window.innerWidth < 1024; // Using lg breakpoint (1024px)

			// Save desktop state before switching to mobile
			if (!isMobile && mobile) {
				prevDesktopExpandedState.current = isExpanded;
				setIsExpanded(true);
			}
			// Restore desktop state when returning from mobile to desktop
			else if (isMobile && !mobile) {
				setIsExpanded(prevDesktopExpandedState.current);
				// Close mobile sidebar when switching to desktop
				setIsMobileOpen(false);
			}

			setIsMobile(mobile);
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [isMobile, isExpanded]);

	const toggleSidebar = useCallback(() => {
		setIsExpanded((prev) => {
			const newState = !prev;
			// When toggling, update hover enabled state
			// Only enable hover expanding when the sidebar is expanded
			setIsHoverEnabled(newState);

			// If in desktop mode, save this preference
			if (!isMobile) {
				prevDesktopExpandedState.current = newState;
			}

			return newState;
		});
	}, [isMobile]);

	const toggleMobileSidebar = useCallback(() => {
		setIsMobileOpen((prev) => !prev);
	}, []);

	// Add explicit setter for mobile open state
	const setMobileOpen = useCallback((isOpen: boolean) => {
		setIsMobileOpen(isOpen);
	}, []);

	const toggleSubmenu = useCallback((item: string) => {
		setOpenSubmenu((prev) => (prev === item ? null : item));
	}, []);

	return (
		<SidebarContext.Provider
			value={{
				// Always return true for isExpanded if in mobile mode
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
				setMobileOpen, // Add the new method to the context
			}}
		>
			{children}
		</SidebarContext.Provider>
	);
};
