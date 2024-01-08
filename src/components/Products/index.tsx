import React, { useState } from "react";
import PriceRange from "./PriceRange";
import Categories from "./Categories";
import Size from "./Size";
import Sale from "./Sale";
import Sorting from "./Sorting";
import Goods from "./Goods";

import s from "./index.module.scss";

interface ProductsProps {}

interface Filters {
	sortBy: string;
	priceRange: [0, 1000];
	selectedSize: null;
	selectedCategory: null;
	isSaleClicked: boolean;
}

const Products: React.FC<ProductsProps> = () => {
	const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
	const [sizesData, setSizesData] = useState<{ [key: string]: number }>({});
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [categoriesData, setCategoriesData] = useState<{ [key: string]: number }>({});
	const [isSaleClicked, setIsSaleClicked] = useState(false);
	const [appliedFilters, setAppliedFilters] = useState({
		priceRange: [0, 1000],
		selectedSize: null,
		selectedCategory: null,
		isSaleClicked: false,
		sortBy: "Default sorting"
	});

	const handleFilterChange = (newPriceRange: number[]) => {
		setPriceRange(newPriceRange);
	};

	const handleSaleFilter = () => {
		setIsSaleClicked(true);
	};

	const resetAllFilters = () => {
		setSelectedCategory(null);
		setSelectedSize(null);
		setIsSaleClicked(false);
	};

	const handleByChange = (newFilters: Partial<Filters>) => {
		setAppliedFilters({ ...appliedFilters, ...newFilters });
	};

	return (
		<div className={s.products}>
			<div className={s.leftBlock}>
				<div className={s.filters}>
					<Categories categoriesData={categoriesData} setSelectedCategory={setSelectedCategory} />
					<PriceRange onFilterChange={handleFilterChange} />
					<Size sizesData={sizesData} setSelectedSize={setSelectedSize} />
				</div>
				<Sale />
			</div>
			<div className={s.rightBlock}>
				<Sorting
					handleFilterChange={handleByChange}
					appliedFilters={appliedFilters}
					handleSaleFilter={handleSaleFilter}
					resetAllFilters={resetAllFilters}
				/>
				<Goods
					priceRange={priceRange}
					setSizesData={setSizesData}
					selectedSize={selectedSize}
					selectedCategory={selectedCategory}
					setCategoriesData={setCategoriesData}
					isSaleClicked={isSaleClicked}
					sortBy={appliedFilters.sortBy}
				/>
			</div>
		</div>
	);
};

export default Products;
