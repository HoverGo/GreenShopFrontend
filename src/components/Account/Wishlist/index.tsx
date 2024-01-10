import React, { useState, useEffect } from "react";
import axios from "axios";
import s from "./index.module.scss";
import { getAuthHeaders } from "../../../api/auth";
import API_URL from "../../../api/apiConfig";

interface CardItem {
    product: {
        mainImg: string;
        name: string;
        discount: boolean;
        mainPrice: string;
        salePrice: string;
        id: string;
    };
}

const Wishlist: React.FC = () => {
    const [cardData, setCardData] = useState<CardItem[] | null>(null);

    useEffect(() => {
        const fetchCardData = async () => {
            try {
                const authHeaders = getAuthHeaders();
                const response = await axios.get(
                    `${API_URL}/product/favourite/`,
                    {
                        headers: {
                            Authorization: authHeaders?.headers?.Authorization,
                        },
                    }
                );

                const fetchedData: CardItem[] = response.data;
                setCardData(fetchedData);
            } catch (error) {
                console.error("Error while receiving card data:", error);
            }
        };
        console.log(cardData);
        fetchCardData();
    }, []);

    const handleRemoveFromFavorites = async (productId: string) => {
        try {
            const authHeaders = getAuthHeaders();
            await axios.delete(`${API_URL}/product/favourite/${productId}/`, {
                headers: {
                    Authorization: authHeaders?.headers?.Authorization,
                },
            });
            console.log(productId);

            setCardData(
                (prevCardData) =>
                    prevCardData?.filter(
                        (item) => item.product.id !== productId
                    ) || null
            );
        } catch (error) {
            console.error("Error while removing card from favorites:", error);
        }
    };

    return (
        <div className={s.wishlist}>
            {cardData &&
                cardData.map((item) => (
                    <div className={s.card} key={item.product.id}>
                        <div className={s.cardImg}>
                            <img
                                src={item.product.mainImg}
                                alt={item.product.name}
                            />
                            <div className={s.hoverLinks}>
                                <button
                                    onClick={() =>
                                        handleRemoveFromFavorites(
                                            item.product.id
                                        )
                                    }
                                >
                                    <img
                                        width={15}
                                        height={15}
                                        src="img/wishlist/cross.svg"
                                        alt="cross"
                                    />
                                </button>
                            </div>
                        </div>
                        <div className={s.goodsInfo}>
                            <p className={s.goodsName}>{item.product.name}</p>
                            <div className={s.goodsPrices}>
                                <p className={s.main}>
                                    {item.product.salePrice}
                                </p>
                                {item.product.discount ? (
                                    <p className={s.sale}>
                                        {item.product.mainPrice}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default Wishlist;
