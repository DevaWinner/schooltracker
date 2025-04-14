import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DropdownProps {
	isOpen: boolean;
	onClose: () => void;
	className?: string;
	children: React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({
	isOpen,
	className,
	children,
}) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.2, ease: "easeInOut" }}
					className={className}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
};
