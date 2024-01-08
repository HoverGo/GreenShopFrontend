import React from "react";
import s from "./index.module.scss";

interface SizeProps {
	sizesData: { [key: string]: number };
	setSelectedSize: React.Dispatch<React.SetStateAction<string | null>>;
}

type SizesItems = {
	title: string;
	id: number;
	count: number;
};

const Size: React.FC<SizeProps> = ({ sizesData, setSelectedSize }) => {
	const [activeSizes, setActiveSizes] = React.useState<number | null>(null);

	const handleCategoryClick = (id: number, size: string) => {
		setActiveSizes(id);
		setSelectedSize(size);
	};

	const item: SizesItems[] = [
		{ title: "Small", id: 1, count: sizesData["S"] || 0 },
		{ title: "Medium", id: 2, count: sizesData["M"] || 0 },
		{ title: "Large", id: 3, count: sizesData["L"] || 0 },
		{ title: "Extra Large", id: 4, count: sizesData["XL"] || 0 }
	];

	const sizeMap: { [key: string]: string } = {
		Small: "S",
		Medium: "M",
		Large: "L",
		"Extra Large": "XL"
	};

	return (
		<div className={s.size}>
			<h5>Size</h5>
			{item.map((size) => (
				<div
					key={size.id}
					onClick={() => handleCategoryClick(size.id, sizeMap[size.title])}
					className={size.id === activeSizes ? s.active : ""}>
					<p>{size.title}</p>
					<p>({size.count})</p>
				</div>
			))}
		</div>
	);
};

export default Size;
