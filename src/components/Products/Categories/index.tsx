import React from "react";
import s from "./index.module.scss";

interface CategoryProps {
	categoriesData: { [key: string]: number };
	setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
}

type CategoriesItems = {
	title: string;
	id: number;
	count: number;
};

const Category: React.FC<CategoryProps> = ({ categoriesData, setSelectedCategory }) => {
	const [activeCategory, setActiveCategory] = React.useState<number | null>(null);

	const handleCategoryClick = (id: number, category: string) => {
		setActiveCategory(id);
		setSelectedCategory(category);
	};

	const item: CategoriesItems[] = [
		{ title: "House Plants", id: 1, count: categoriesData["House Plants"] || 0 },
		{ title: "Potter Plants", id: 2, count: categoriesData["Potter Plants"] || 0 },
		{ title: "Seeds", id: 3, count: categoriesData["Seeds"] || 0 },
		{ title: "Small Plants", id: 4, count: categoriesData["Small Plants"] || 0 },
		{ title: "Big Plants", id: 5, count: categoriesData["Big Plants"] || 0 },
		{ title: "Succulents", id: 6, count: categoriesData["Succulents"] || 0 },
		{ title: "Terrariums", id: 7, count: categoriesData["Terrariums"] || 0 },
		{ title: "Gardening", id: 8, count: categoriesData["Gardening"] || 0 },
		{ title: "Accessories", id: 9, count: categoriesData["Accessories"] || 0 }
	];

	return (
		<div className={s.category}>
			<h5>Category</h5>
			{item.map((category) => (
				<div
					key={category.id}
					onClick={() => handleCategoryClick(category.id, category.title)}
					className={category.id === activeCategory ? s.active : ""}>
					<p>{category.title}</p>
					<p>({category.count})</p>
				</div>
			))}
		</div>
	);
};

export default Category;
