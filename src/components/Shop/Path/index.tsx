import React from "react";
import { Link, useLocation } from "react-router-dom";
import s from "./index.module.scss";

const Path: React.FC = () => {
	const location = useLocation();
	const pathItems = [
		{ name: "Home", path: "/", isHome: true },
		{ name: "Shop", path: "/Shop" },
		{ name: "Cart", path: "/Shop/Cart" },
		{ name: "Checkout", path: "/Shop/Checkout" }
	];

	const getPathItems = () => {
		const currentPath = location.pathname.toLowerCase();
		const items = [];
		for (let i = 0; i < pathItems.length; i++) {
			const { name, path, isHome } = pathItems[i];
			const isActive = currentPath.startsWith(path.toLowerCase());

			if (isActive || name === "Home") {
				items.push(
					<React.Fragment key={name}>
						{items.length > 0 && <p>/</p>}
						{isActive || name === "Home" ? (
							<Link
								to={name === "Home" ? "/" : path}
								className={name === "Home" ? s.home : undefined}>
								{name}
							</Link>
						) : (
							<Link to={path} className={isHome ? s.home : undefined}>
								{name}
							</Link>
						)}
					</React.Fragment>
				);
			}
		}
		return items;
	};

	return <div className={s.path}>{getPathItems()}</div>;
};

export default Path;
