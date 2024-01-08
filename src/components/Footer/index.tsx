import React from "react";

import s from "./index.module.scss";

type Card = {
	title: string;
	info: string;
	imgPot: string;
	imgPlant: string;
	id: number;
};

const itemsTop: Card[] = [
	{
		title: "Garden Care",
		info: "We are an online plant shop offering a wide range of cheap and trendy plants.",
		imgPot: "/img/footer/top/1pot.svg",
		imgPlant: "/img/footer/top/1plant.svg",
		id: 1
	},
	{
		title: "Plant Renovation",
		info: "We are an online plant shop offering a wide range of cheap and trendy plants.",
		imgPot: "/img/footer/top/2pot.svg",
		imgPlant: "/img/footer/top/2plant.svg",
		id: 2
	},
	{
		title: "Watering Graden",
		info: "We are an online plant shop offering a wide range of cheap and trendy plants.",
		imgPot: "/img/footer/top/1pot.svg",
		imgPlant: "/img/footer/top/1plant.svg",
		id: 3
	}
];

type MiddleItems = {
	title: string;
	img: string;
	id: number;
};

const itemsMiddle: MiddleItems[] = [
	{
		title: "70 West Buckingham Ave. Farmingdale, NY 11735",
		img: "/img/footer/middle/location.svg",
		id: 1
	},
	{
		title: "contact@greenshop.com ",
		img: "/img/footer/middle/message.svg",
		id: 2
	},
	{
		title: "+88 01911 717 490",
		img: "/img/footer/middle/calling.svg",
		id: 3
	}
];

type BottomItems = {
	title: string;
	links: {
		info: string;
		url: string;
	}[];
	id: number;
};

const itemsBottom: BottomItems[] = [
	{
		title: "My Account",
		links: [
			{ info: "My Account", url: "/account" },
			{ info: "Our Stores", url: "/stores" },
			{ info: "Contact us", url: "/contact" },
			{ info: "Career", url: "/career" },
			{ info: "Specials", url: "/specials" }
		],
		id: 1
	},
	{
		title: "Help & Guide",
		links: [
			{ info: "Help Center", url: "/account" },
			{ info: "	How to Buy", url: "/stores" },
			{ info: "Shipping & Delivery", url: "/contact" },
			{ info: "Product Policy", url: "/career" },
			{ info: "How to Return", url: "/specials" }
		],
		id: 2
	},
	{
		title: "Categories",
		links: [
			{ info: "House Plants", url: "/account" },
			{ info: "Potter Plants", url: "/stores" },
			{ info: "Seeds", url: "/contact" },
			{ info: "Small Plants", url: "/career" },
			{ info: "Accessories", url: "/specials" }
		],
		id: 3
	}
];

type SocialMedia = {
	img: string;
	id: number;
	href: string;
};

const itemsSocialMedia: SocialMedia[] = [
	{
		img: "/img/footer/bottom/facebook.png",
		id: 1,
		href: "/buythisweb"
	},
	{
		img: "/img/footer/bottom/instagram.png",
		id: 2,
		href: "/buythisweb"
	},
	{
		img: "/img/footer/bottom/telegram.png",
		id: 3,
		href: "/buythisweb"
	},
	{
		img: "/img/footer/bottom/twitter.png",
		id: 4,
		href: "/buythisweb"
	},
	{
		img: "/img/footer/bottom/whatsapp.png",
		id: 5,
		href: "/buythisweb"
	}
];

const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();
	return (
		<div className={s.footer}>
			<div className={s.footerTop}>
				<div className={s.info}>
					{itemsTop.map((item) => (
						<div key={item.id} className={s.card}>
							<img className={s.cyrcle} src="/img/footer/top/01.png" alt="cyrcle" />
							<img className={s.topPlant} width={60} height={45} src={item.imgPlant} alt="plant" />
							<img className={s.pot} width={60} src={item.imgPot} alt="pot" />
							<h5>{item.title}</h5>
							<p>{item.info}</p>
						</div>
					))}
				</div>
				<div className={s.formBlock}>
					<h4>Would you like to join newsletters?</h4>
					<form>
						<label>
							<input
								className={s.input}
								type="text"
								name="name"
								placeholder="enter your email address..."
							/>
						</label>
						<input className={s.inputBtn} type="submit" value="Join" />
					</form>
					<p>
						We usually post offers and challenges in newsletter. We’re your online houseplant
						destination. We offer a wide range of houseplants and accessories shipped directly from
						our (green)house to yours!{" "}
					</p>
				</div>
				<div className={s.join}></div>
			</div>
			<div className={s.footerMiddle}>
				<img width={170} src="/img/footer/middle/logo.svg" alt="logo" />
				{itemsMiddle.map((item) => (
					<div key={item.id}>
						<img width={25} height={25} src={item.img} alt="location" /> <p>{item.title}</p>
					</div>
				))}
			</div>
			<div className={s.footerBottom}>
				<div className={s.leftBlock}>
					{itemsBottom.map((item) => (
						<div className={s.blockLinks} key={item.id}>
							<h5 className={s.titleText}>{item.title}</h5>
							{item.links.map((link) => (
								<div className={s.links} key={link.url}>
									<a href={link.url}>{link.info}</a>
								</div>
							))}
						</div>
					))}
				</div>
				<div className={s.rightBlock}>
					<div>
						<h5>Social Media</h5>
						<div className={s.mediaLinks}>
							{itemsSocialMedia.map((item) => (
								<a key={item.id} href={item.href}>
									{" "}
									<img
										className={s.social}
										width={30}
										height={30}
										src={item.img}
										alt="social media"
									/>
								</a>
							))}
						</div>
					</div>
					<div>
						<h5>We accept</h5>
						<img src="/img/footer/bottom/accept.png" alt="we accpet" />
					</div>
				</div>
			</div>
			<p>© {currentYear} GreenShop. All Rights Reserved.</p>
		</div>
	);
};

export default Footer;
