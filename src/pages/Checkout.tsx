import React from "react";

import Header from "../components/Header";
import Path from "../components/Shop/Path";

import Footer from "../components/Footer";
import Payment from "../components/Checkot/Payment";

export const Checkout: React.FC = () => {
	return (
		<div className="container">
			<Header />
			<Path />
			<Payment />
			<Footer />
		</div>
	);
};
