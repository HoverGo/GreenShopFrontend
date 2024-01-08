import React from "react";

import Header from "../components/Header";
import AccountInfo from "../components/Account";

export const Account: React.FC = () => {
	return (
		<div className="container">
			<Header />
			<AccountInfo />
		</div>
	);
};
