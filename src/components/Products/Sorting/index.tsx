import React, { useState, useEffect, useRef } from "react";
import s from "./index.module.scss";

const Sorting: React.FC<{
    handleSaleFilter: (id?: number) => void;
    handleNewArrivalFilter: (id?: number) => void;
    resetAllFilters: () => void;
    handleFilterChange: (newFilters: { sortBy: string }) => void;
}> = ({
    handleSaleFilter,
    resetAllFilters,
    handleFilterChange,
    handleNewArrivalFilter,
}) => {
    const [AllPlantsCategory, setAllPlantsCategory] = useState(false);
    const [isArrowActive, setIsArrowActive] = useState(false);
    const [sortBy, setSortBy] = useState("Default sorting");
    const [isSaleClicked, setIsSaleClicked] = useState(false);
    const [isNewArrivalsClicked, setIsNewArrivalsClicked] = useState(false);

    const menuRef = useRef(null as HTMLDivElement | null);

    const handleSortOptionClick = (option: string) => {
        setSortBy(option);
        toggleArrowStyle();
        handleFilterChange({ sortBy: option });
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

    const handleAllPlantsClick = () => {
        resetAllFilters();
        setIsNewArrivalsClicked(false);
        setIsSaleClicked(false);
        setAllPlantsCategory(true);
    };

    const handleSaleClick = () => {
        handleSaleFilter();
        setIsNewArrivalsClicked(false);
        setAllPlantsCategory(false);
        setIsSaleClicked(true);
    };

    const handleNewArrivalClick = () => {
        handleNewArrivalFilter();
        setIsSaleClicked(false);
        setAllPlantsCategory(false);
        setIsNewArrivalsClicked(true);
    };

    useEffect(() => {
        handleAllPlantsClick();
        document.addEventListener("mousedown", closeMenu);
        return () => {
            document.removeEventListener("mousedown", closeMenu);
        };
    }, []);

    return (
        <div className={s.sorting}>
            <div className={s.category}>
                <h5
                    onClick={handleAllPlantsClick}
                    className={AllPlantsCategory ? s.activeCategory : ""}
                >
                    All Plants
                </h5>
                <h5
                    onClick={handleNewArrivalClick}
                    className={isNewArrivalsClicked ? s.activeCategory : ""}
                >
                    New Arrivals
                </h5>
                <h5
                    onClick={handleSaleClick}
                    className={isSaleClicked ? s.activeCategory : ""}
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
