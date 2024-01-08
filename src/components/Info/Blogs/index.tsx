import React from "react";

import s from "./index.module.scss";

type Card = {
	green: string;
	black: string;
	grey: string;
	img: string;
	id: number;
};

const items: Card[] = [
	{
		green: "September 12  I Read in 6 minutes",
		black: "Cactus & Succulent Care Tips",
		grey: "Cacti are succulents are easy care plants for any home or patio. ",
		img: "img/blogs/01.jpg",
		id: 1
	},
	{
		green: "September 13  I Read in 2 minutes",
		black: "Top 10 Succulents for Your Homes",
		grey: "Best in hanging baskets. Prefers medium to high light.",
		img: "img/blogs/02.jpg",
		id: 2
	},
	{
		green: "September 15  I Read in 3 minutes",
		black: "Cacti & Succulent Care Tips",
		grey: "Cacti and succulents thrive in containers and because most are..",
		img: "img/blogs/03.jpg",
		id: 3
	},
	{
		green: "September 15  I Read in 2 minutes",
		black: "Best Houseplants Room by Room",
		grey: "The benefits of houseplants are endless. In addition to..",
		img: "img/blogs/04.jpg",
		id: 4
	}
];

const Blogs: React.FC = () => {
	return (
		<div className={s.blogs}>
			<h4>Our Blog Posts</h4>
			<p className={s.topText}>
				We are an online plant shop offering a wide range of cheap and trendy plants.{" "}
			</p>
			<div className={s.cards}>
				{items.map((item) => (
					<div key={item.id} className={s.card}>
						<img src={item.img} alt="plant" />
						<div className={s.cardText}>
							<p className={s.green}>{item.green}</p>
							<h5 className={s.black}>{item.black}</h5>
							<p className={s.grey}>{item.grey}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Blogs;
