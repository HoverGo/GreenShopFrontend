import React from "react";

import Header from "../components/Header";
import Path from "../components/Shop/Path";
import ProductCarousel from "../components/Shop/ProductCarousel";
import Footer from "../components/Footer";
import ProductCart from "../components/Shop/ProductCart";

export const Shop: React.FC = () => {
	return (
		<div className="container">
			<Header />
			<Path />
			<ProductCart />
			<ProductCarousel />
			<Footer />
		</div>
	);
};
