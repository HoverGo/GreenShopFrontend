import React from "react";

import Header from "../components/Header";
import Path from "../components/Shop/Path";
import ProductCarousel from "../components/Shop/ProductCarousel";
import Footer from "../components/Footer";
import OrderQuantitySelector from "../components/OrderQuantitySelector";

export const Cart: React.FC = () => {
	return (
		<div className="container">
			<Header />
			<Path />
			<OrderQuantitySelector />
			<ProductCarousel />
			<Footer />
		</div>
	);
};
