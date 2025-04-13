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
	const [isExpanded, setIsExpanded] = useState(window.innerWidth >= 1200);
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
			const mobile = window.innerWidth < 1024;
			const isLargeScreen = window.innerWidth >= 1200;

			if (mobile) {
				setIsExpanded(true);
				setIsMobileOpen(false);
			} else {
				setIsExpanded(isLargeScreen);
				setIsMobileOpen(false);
			}
			setIsMobile(mobile);
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const toggleSidebar = useCallback(() => {
		setIsExpanded((prev) => {
			const newState = !prev;
			setIsHoverEnabled(newState);
			return newState;
		});
	}, []);

	const toggleMobileSidebar = useCallback(() => {
		setIsMobileOpen((prev) => {
			const newState = !prev;
			// When opening mobile sidebar, ensure hover is disabled
			if (newState) {
				setIsHovered(false);
				setIsHoverEnabled(false);
			}
			return newState;
		});
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
