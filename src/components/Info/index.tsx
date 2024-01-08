import React from "react";

import s from "./index.module.scss";
import FindMore from "./FindMore";
import Blogs from "./Blogs";

const Info: React.FC = () => {
	return (
		<div className={s.info}>
			<FindMore />
			<Blogs />
		</div>
	);
};

export default Info;
