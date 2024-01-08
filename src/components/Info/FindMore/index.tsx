import React from "react";
import { Link } from "react-router-dom";

import s from "./index.module.scss";

type Card = {
	title: string;
	info: string;
	img: string;
	id: number;
};

const items: Card[] = [
	{
		title: "Summer cactus & succulents",
		info: "We are an online plant shop offering a wide range of cheap and trendy plants",
		img: "img/findmore/01.jpg",
		id: 1
	},
	{
		title: "Summer cactus & succulents",
		info: "We are an online plant shop offering a wide range of cheap and trendy plants",
		img: "img/findmore/02.jpg",
		id: 2
	}
];

const FindMore: React.FC = () => {
	return (
		<div className={s.findMore}>
			{items.map((item) => (
				<div key={item.id} className={s.card}>
					<img className={s.plant} src={item.img} alt="plant" />
					<img className={s.circle} src="img/findmore/03.svg" alt="plant" />
					<img className={s.circle} src="img/findmore/04.svg" alt="plant" />
					<div className={s.rightInfo}>
						<h5>{item.title}</h5>
						<p>{item.info}</p>
						<Link className={s.button} to="/nazvanieStanicy">
							Find More <img src="img/findmore/arrow.svg" alt="arrow" />
						</Link>
					</div>
				</div>
			))}
		</div>
	);
};

export default FindMore;
