import React from "react";

import Header from "../components/Header";
import Carousel from "../components/Carousel";
import Products from "../components/Products";
import Info from "../components/Info";
import Footer from "../components/Footer";

export const Home: React.FC = () => {
	return (
		<div className="container">
			<Header />
			<Carousel />
			<Products />
			<Info />
			<Footer />
		</div>
	);
};
