import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";

import s from "./index.module.scss";

type Items = {
	discount: boolean;
	discountPercentage: number;
	id: string;
	mainImg: string;
	mainPrice: number;
	name: string;
	salePrice: number;
};

const ProductCarousel: React.FC = () => {
	const [carouselItems, setCarouselItems] = useState<Items[][]>([[], [], []]);

	useEffect(() => {
		axios
			.get("http://127.0.0.1:8000/shop/product/carousel/")
			.then((response) => {
				const items: Items[] = response.data;

				const carouselData: Items[][] = [
					items.slice(0, 5),
					items.slice(5, 10),
					items.slice(10, 15)
				];

				setCarouselItems(carouselData);
			})
			.catch((error) => {
				console.error("Error response:", error);
			});
	}, []);

	return (
		<div className={s.productCarousel}>
			<h5 className={s.title}>Related Products</h5>
			<Carousel
				className={s.carousel}
				showArrows={false}
				showStatus={false}
				showThumbs={false}
				infiniteLoop={false}
				autoPlay={false}
				interval={5000}>
				{carouselItems.map((carousel, index) => (
					<div key={index} className={s.carouselItems}>
						{carousel.map((item) => (
							<Link to={`/shop/${item.id}`} key={item.id} className={s.item}>
								<img className={s.imgBlock} src={`/${item.mainImg}`} alt={item.name} />
								{item.discount ? (
									<p className={s.itemDiscount}>{item.discountPercentage} OFF</p>
								) : null}
								<h5 className={s.itemName}>{item.name}</h5>
								<p className={s.itemPrice}>{item.discount ? item.salePrice : item.mainPrice}</p>
							</Link>
						))}
					</div>
				))}
			</Carousel>
		</div>
	);
};

export default ProductCarousel;
