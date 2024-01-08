import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

import s from "./index.module.scss";

const MyCarousel: React.FC = () => {
	return (
		<Carousel
			className={s.Carousel}
			showArrows={false}
			showStatus={false}
			showThumbs={false}
			infiniteLoop={true}
			autoPlay={true}
			interval={5000}>
			<div className={s.carouselFirst}>
				<div className={s.carouselFirstLeft}>
					<h5>Welcome to GreenShop</h5>
					<h1>
						Let’s Make a Better <span>planet</span>{" "}
					</h1>
					<p>
						We are an online plant shop offering a wide range of cheap and trendy plants. Use our
						plants to create an unique Urban Jungle. Order your favorite plants!
					</p>
					<button>
						<a href="">SHOP NOW</a>
					</button>
				</div>
				<div className={s.carouselFirstRight}>
					<img className={s.plantBig} src="img/carousel/plant.png" alt="plant" />
					<img className={s.plantSmall} src="img/carousel/plantSmall.png" alt="plant" />
				</div>
			</div>
			<div className={s.carouselFirst}>
				<div className={s.carouselFirstLeft}>
					<h5>Welcome to GreenShop</h5>
					<h1>
						Let’s Make a Better <span>planet</span>{" "}
					</h1>
					<p>
						We are an online plant shop offering a wide range of cheap and trendy plants. Use our
						plants to create an unique Urban Jungle. Order your favorite plants!
					</p>
					<button>
						<a href="">SHOP NOW</a>
					</button>
				</div>
				<div className={s.carouselFirstRight}>
					<img className={s.plantBig} src="img/carousel/plant.png" alt="plant" />
					<img className={s.plantSmall} src="img/carousel/plantSmall.png" alt="plant" />
				</div>
			</div>
			<div className={s.carouselFirst}>
				<div className={s.carouselFirstLeft}>
					<h5>Welcome to GreenShop</h5>
					<h1>
						Let’s Make a Better <span>planet</span>{" "}
					</h1>
					<p>
						We are an online plant shop offering a wide range of cheap and trendy plants. Use our
						plants to create an unique Urban Jungle. Order your favorite plants!
					</p>
					<button>
						<a href="">SHOP NOW</a>
					</button>
				</div>
				<div className={s.carouselFirstRight}>
					<img className={s.plantBig} src="img/carousel/plant.png" alt="plant" />
					<img className={s.plantSmall} src="img/carousel/plantSmall.png" alt="plant" />
				</div>
			</div>
		</Carousel>
	);
};

export default MyCarousel;
