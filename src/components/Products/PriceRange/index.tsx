import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import s from "./index.module.scss";

interface PriceRangeProps {
	onFilterChange: (priceRange: number[]) => void;
}

const PriceRange: React.FC<PriceRangeProps> = ({ onFilterChange }) => {
	const [priceRange, setPriceRange] = React.useState([0, 1000]);

	const handleFilterClick = () => {
		onFilterChange(priceRange);
	};

	return (
		<div className={s.priceRange}>
			<h5>Price Range</h5>
			<div>
				<Slider
					className={s.slider}
					min={0}
					max={1500}
					range
					value={priceRange}
					onChange={(newPriceRange: number | number[]) => {
						if (Array.isArray(newPriceRange)) {
							setPriceRange(newPriceRange);
						}
					}}
				/>
				<span>
					<span className={s.spanPrice}>Price:</span>
					<span className={s.spanRange}>
						${priceRange[0]} - ${priceRange[1]}
					</span>
				</span>
				<button onClick={handleFilterClick}>Filter</button>
			</div>
		</div>
	);
};

export default PriceRange;
