import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import s from "./index.module.scss";
import Pagination from "../Pagination";
import axios from "axios";
import { getAuthHeaders } from "../../../api/auth";
import API_URL from "../../../api/apiConfig";

import Heart from "./svg/Heart";

interface Goods {
    name: string;
    mainPrice: string;
    salePrice: string;
    mainImg: string;
    discountPercentage: string;
    discount: boolean;
    id: number;
    rating: number;
    review: number;
    size: Size[];
    newArriwals: boolean;
    categories: {
        id: number;
        name: string;
    };
}

interface Size {
    id: number;
    name: string;
}

interface GoodsProps {
    priceRange: number[];
    setSizesData: React.Dispatch<
        React.SetStateAction<{ [key: string]: number }>
    >;
    selectedSize: string | null;
    selectedCategory: string | null;
    setCategoriesData: React.Dispatch<
        React.SetStateAction<{ [key: string]: number }>
    >;
    isSaleClicked: boolean;
    isNewArrivalsClicked: boolean;
    sortBy: string;
}

interface FavoriteProduct {
    id: number;
    product: {
        id: number;
        name: string;
        mainPrice: string;
        salePrice: string;
        discount: boolean;
    };
}

const sizeMap: { [key: string]: string } = {
    Small: "s",
    Medium: "m",
    Large: "l",
    "Extra Large": "xl",
};

const Goods: React.FC<GoodsProps> = ({
    priceRange,
    setSizesData,
    selectedSize,
    selectedCategory,
    setCategoriesData,
    isSaleClicked,
    isNewArrivalsClicked,
    sortBy,
}) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [favoriteStates, setFavoriteStates] = React.useState<
        Map<number, boolean>
    >(new Map());
    const [items, setItems] = React.useState<Goods[]>([]);
    const itemsPerPage = 9;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    console.log(items);

    useEffect(() => {
        axios
            .get(`${API_URL}/product/`)
            .then((response) => {
                const fetchedItems: Goods[] = response.data;

                const sizes: { [key: string]: number } = {};
                const categories: { [key: string]: number } = {};

                fetchedItems.forEach((item: Goods) => {
                    item.size.forEach((sizeItem: Size) => {
                        const sizeName = sizeItem.name;
                        sizes[sizeName] = (sizes[sizeName] || 0) + 1;
                    });

                    const categoryName = item.categories.name;
                    categories[categoryName] =
                        (categories[categoryName] || 0) + 1;
                });

                setItems(fetchedItems);
                setSizesData(sizes);
                setCategoriesData(categories);
            })
            .catch((error) => {
                console.error("Error while receiving data:", error);
            });
    }, [setSizesData, setCategoriesData]);

    const filteredItems = useMemo(() => {
        let filtered = items;

        if (sortBy === "Price: Low to High") {
            filtered = [...filtered].sort(
                (a, b) =>
                    parseFloat(a.salePrice.slice(1)) -
                    parseFloat(b.salePrice.slice(1))
            );
        } else if (sortBy === "Price: High to Low") {
            filtered = [...filtered].sort(
                (a, b) =>
                    parseFloat(b.salePrice.slice(1)) -
                    parseFloat(a.salePrice.slice(1))
            );
        } else if (sortBy === "Most popular") {
            filtered = [...filtered].sort((a, b) => b.review - a.review);
        } else if (sortBy === "Rating") {
            filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        }

        if (selectedCategory) {
            filtered = filtered.filter((item) => {
                return item.categories.name === selectedCategory;
            });
        }

        if (selectedSize) {
            filtered = filtered.filter((item) => {
                const matches = item.size.some(
                    (sizeItem) =>
                        sizeItem.name === selectedSize ||
                        sizeMap[sizeItem.name] === selectedSize
                );
                return matches;
            });
        }

        if (isSaleClicked) {
            filtered = filtered.filter((item) => item.discount === true);
        }

        if (isNewArrivalsClicked) {
            filtered = filtered.filter((item) => item.newArriwals === true);
        }

        filtered = filtered.filter((item) => {
            const itemPrice = parseFloat(item.salePrice.slice(1));
            return itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
        });

        return filtered;
    }, [
        items,
        priceRange,
        selectedSize,
        selectedCategory,
        isSaleClicked,
        isNewArrivalsClicked,
        sortBy,
    ]);

    const displayedItems = filteredItems.slice(startIndex, endIndex);

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            try {
                const authHeaders = getAuthHeaders();
                const response = await axios.get<FavoriteProduct[]>(
                    `${API_URL}/product/favourite/`,
                    authHeaders
                );
                const updatedFavoriteStates = new Map<number, boolean>();

                response.data.forEach((item: FavoriteProduct) => {
                    updatedFavoriteStates.set(item.product.id, true);
                });

                setFavoriteStates(updatedFavoriteStates);
            } catch (error) {
                console.error("Error fetching favorite status:", error);
            }
        };

        fetchFavoriteStatus();
    }, []);

    const toggleFavorite = async (id: number) => {
        try {
            const authHeaders = getAuthHeaders();
            const updatedFavoriteStates = new Map<number, boolean>(
                favoriteStates
            );

            if (updatedFavoriteStates.get(id)) {
                await deleteFavorite(id);
                updatedFavoriteStates.set(id, false);
            } else {
                const response = await axios.post(
                    `${API_URL}/product/favourite/${id}/`,
                    {},
                    authHeaders
                );

                if (response.status === 200) {
                    updatedFavoriteStates.set(id, true);
                }
            }

            setFavoriteStates(updatedFavoriteStates);
        } catch (error) {
            console.error("Error when switching favorite factor:", error);
        }
    };

    const deleteFavorite = async (id: number) => {
        try {
            const authHeaders = getAuthHeaders();
            await axios.delete(
                `${API_URL}/product/favourite/${id}/`,
                authHeaders
            );
            console.log("Product removed from favorites");
        } catch (error) {
            console.error("Error deleting favorite:", error);
        }
    };

    const handleFavoriteClick = async (id: number) => {
        await toggleFavorite(id);
    };

    return (
        <div className={s.goods}>
            <div className={s.cards}>
                {displayedItems.map((item) => (
                    <div key={item.id} className={s.card}>
                        <div className={s.cardImg}>
                            <Link to={`/shop/${item.id}`}>
                                <img
                                    src={`https://greenshopbackend.up.railway.app${item.mainImg}`}
                                    alt={item.name}
                                />
                            </Link>

                            {item.discount ? (
                                <p className={s.discount}>
                                    {item.discountPercentage}% OFF
                                </p>
                            ) : null}
                            <div className={s.hoverLinks}>
                                <button
                                    onClick={() => handleFavoriteClick(item.id)}
                                    className={`${s.favorite} ${
                                        favoriteStates.get(item.id)
                                            ? s.favoriteActive
                                            : ""
                                    }`}
                                >
                                    <Heart />
                                </button>
                            </div>
                        </div>
                        <div className={s.goodsInfo}>
                            <p className={s.goodsName}>{item.name}</p>
                            <div className={s.goodsPrices}>
                                <p className={s.main}>{item.salePrice}</p>
                                {item.discount ? (
                                    <p className={s.sale}>{item.mainPrice}</p>
                                ) : null}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredItems.length / itemsPerPage)}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default Goods;
