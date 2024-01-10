import React, { useState, useEffect, useRef } from "react";
import s from "./index.module.scss";

const Sorting: React.FC<{
    handleSaleFilter: (id?: number) => void;
    handleNewArrivalFilter: (id?: number) => void;
    resetAllFilters: () => void;
    appliedFilters: {
        sortBy: string;
    };
    handleFilterChange: (newFilters: { sortBy: string }) => void;
}> = ({
    handleSaleFilter,
    resetAllFilters,
    handleFilterChange,
    handleNewArrivalFilter,
}) => {
    const [activeCategory, setActiveCategory] = useState<number | null>(1);
    const [isArrowActive, setIsArrowActive] = useState(false);
    const [sortBy, setSortBy] = useState("Default sorting");

    const menuRef = useRef(null as HTMLDivElement | null);

    const handleSortOptionClick = (option: string) => {
        setSortBy(option);
        toggleArrowStyle();
        handleFilterChange({ sortBy: option });
    };

    const handleCategoryClick = (id: number) => {
        setActiveCategory(id);
        if (id === 1) {
            resetAllFilters();
        }
    };

    const toggleArrowStyle = () => {
        setIsArrowActive(!isArrowActive);
    };

    const closeMenu = (event: MouseEvent) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node)
        ) {
            setIsArrowActive(false);
        }
    };

    const handleSaleClick = (id: number) => {
        handleSaleFilter(id);
        if (id === 3) {
            handleSaleFilter();
        }
    };

    const handleNewArrivalClick = (id: number) => {
        handleNewArrivalFilter(id);
        if (id === 3) {
            handleNewArrivalFilter();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", closeMenu);
        return () => {
            document.removeEventListener("mousedown", closeMenu);
        };
    }, []);

    return (
        <div className={s.sorting}>
            <div className={s.category}>
                <h5
                    onClick={() => handleCategoryClick(1)}
                    className={activeCategory === 1 ? s.activeCategory : ""}
                >
                    All Plants
                </h5>
                <h5
                    onClick={() => {
                        handleCategoryClick(2);
                        handleNewArrivalClick(2);
                    }}
                    className={activeCategory === 2 ? s.activeCategory : ""}
                >
                    New Arrivals
                </h5>
                <h5
                    onClick={() => {
                        handleCategoryClick(3);
                        handleSaleClick(3);
                    }}
                    className={activeCategory === 3 ? s.activeCategory : ""}
                >
                    Sale
                </h5>
            </div>
            <div className={s.sortBlock}>
                <h5>Short by:</h5>
                <h5>{sortBy}</h5>
                <img
                    className={
                        isArrowActive ? `${s.arrow} ${s.arrowActive}` : s.arrow
                    }
                    src="img/sort/arrow.svg"
                    alt="arrow"
                    onClick={toggleArrowStyle}
                />
                <div
                    ref={(node) => (menuRef.current = node)}
                    className={
                        isArrowActive
                            ? `${s.sortOptions}`
                            : `${s.sortOptionsHidden}`
                    }
                >
                    <h5
                        onClick={() => handleSortOptionClick("Default sorting")}
                    >
                        Default sorting
                    </h5>
                    <h5
                        onClick={() =>
                            handleSortOptionClick("Price: Low to High")
                        }
                    >
                        Price: Low to High
                    </h5>
                    <h5
                        onClick={() =>
                            handleSortOptionClick("Price: High to Low")
                        }
                    >
                        Price: High to Low
                    </h5>
                    <h5 onClick={() => handleSortOptionClick("Most popular")}>
                        Most popular
                    </h5>
                    <h5 onClick={() => handleSortOptionClick("Rating")}>
                        Rating
                    </h5>
                </div>
            </div>
        </div>
    );
};

export default Sorting;
