import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import s from "./index.module.scss";
import Star from "./svg/Star";
import Cyrcle from "./svg/Cyrcle";
import Heart from "./svg/Heart";
import { getAuthHeaders } from "../../../api/auth";

type Rating = {
    icon: React.ReactNode;
    id: number;
};

const rating: Rating[] = [
    {
        icon: <Star />,
        id: 1,
    },
    {
        icon: <Star />,
        id: 2,
    },
    {
        icon: <Star />,
        id: 3,
    },
    {
        icon: <Star />,
        id: 4,
    },
    {
        icon: <Star />,
        id: 5,
    },
];

type Cyrcle = {
    title: string;
    icon: React.ReactNode;
    id: number;
};

const hollowCyrcle: Cyrcle[] = [
    {
        title: "s",
        icon: <Cyrcle />,
        id: 1,
    },
    {
        title: "m",
        icon: <Cyrcle />,
        id: 2,
    },
    {
        title: "l",
        icon: <Cyrcle />,
        id: 3,
    },
    {
        title: "xl",
        icon: <Cyrcle />,
        id: 4,
    },
];

interface Review {
    id: number;
    customer: string;
    rating: number;
    text: string;
}

interface Product {
    id: number;
    name: string;
    salePrice: string;
    reviewCount: number;
    rating: number;
    size: {
        id: number;
        name: string;
        quantity: number;
    };
    categories: {
        id: number;
        name: string;
    };
    sku: string;
    mainImg: string;
    reviews: Review[];
    shortDescriptionInfo: string;
    descriptionInfo: string;
    inCart: {
        id: number;
        name: string;
    }[];
}

const calculateAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) {
        return 0;
    }

    const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return totalRating / reviews.length;
};

const ProductCart: React.FC = () => {
    const [activeTab, setActiveTab] = useState("description");
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [reviewText, setReviewText] = useState("");
    const [starsSelected, setStarsSelected] = useState(0);
    const [showReviewLimitMessage, setShowReviewLimitMessage] =
        useState<boolean>(false);
    const [isFavoriteActive, setIsFavoriteActive] = useState<boolean>(false);
    const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
    const [availableSizes, setAvailableSizes] = useState<
        Array<{ id: number; name: string }>
    >([]);
    const [isAlreadyAdded, setIsAlreadyAdded] = useState(false);
    const [isSizeSelected, setIsSizeSelected] = useState(false);

    const averageRating = product?.reviews
        ? calculateAverageRating(product.reviews)
        : 0;
    const { id } = useParams();

    const navigate = useNavigate();

    const handleStarClick = (id: number) => {
        setStarsSelected(id);
    };

    const handleCloseMessage = () => {
        setShowReviewLimitMessage(false);
    };

    const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const authHeaders = getAuthHeaders();
            await axios.post(
                `http://127.0.0.1:8000/shop/product/reviews/${id}/`,
                {
                    rating: starsSelected,
                    text: reviewText,
                },
                authHeaders
            );

            const updatedProductResponse = await axios.get(
                `http://127.0.0.1:8000/shop/product/${id}/`
            );
            setProduct(updatedProductResponse.data[0]);

            setReviewText("");
            setStarsSelected(0);
        } catch (error) {
            setShowReviewLimitMessage(true);
        }
    };

    const toggleFavorite = async () => {
        try {
            const authHeaders = getAuthHeaders();

            if (isFavoriteActive) {
                await deleteFavorite();
                setIsFavoriteActive(false);
            } else {
                const response = await axios.post(
                    `http://127.0.0.1:8000/shop/product/favourite/${id}/`,
                    {},
                    authHeaders
                );

                if (response.status === 200) {
                    setIsFavoriteActive(true);
                }
            }
        } catch (error) {
            console.error("Error when switching favorite factor:", error);
        }
    };

    const deleteFavorite = async () => {
        try {
            const authHeaders = getAuthHeaders();
            await axios.delete(
                `http://127.0.0.1:8000/shop/product/favourite/${id}/`,
                authHeaders
            );
            console.log("Product removed from favorites");
        } catch (error) {
            console.error("Error deleting favorite:", error);
        }
    };

    const handleFavoriteClick = async () => {
        setIsFavoriteActive((prevState) => !prevState);
        await toggleFavorite();
    };

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            try {
                const authHeaders = getAuthHeaders();
                const response = await axios.get(
                    `http://127.0.0.1:8000/shop/product/favourite/${id}/`,
                    authHeaders
                );

                if (response.data.message === "Product in favourite") {
                    setIsFavoriteActive(true);
                } else {
                    setIsFavoriteActive(false);
                }
            } catch (error) {
                console.error("Error fetching favorite status:", error);
            }
        };

        fetchFavoriteStatus();
    }, [id]);

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        if (quantity < 99) {
            setQuantity(quantity + 1);
        }
    };

    const handleModalOpen = () => {
        setModalImage(selectedImage);
        setModalOpen(true);
    };

    const handleImageClick = (imageSrc: string) => {
        setSelectedImage(imageSrc);
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const handleSizeClick = (id: number) => {
        setSelectedSizeId(id);
        setIsAlreadyAdded(false);
        const isSizeInCart =
            product?.inCart && product?.inCart.some((item) => item.id === id);
        setIsAlreadyAdded(!!isSizeInCart);
        setIsSizeSelected(true);
    };
    useEffect(() => {
        if (id) {
            const authHeaders = getAuthHeaders();
            axios
                .get(`http://127.0.0.1:8000/shop/product/${id}/`, authHeaders)
                .then((response) => {
                    setProduct(response.data[0]);
                    setSelectedImage(`/${response.data[0].mainImg}`);

                    const sizesFromResponse = response.data[0].size || [];
                    setAvailableSizes(sizesFromResponse);
                })
                .catch((error) => {
                    console.error("Error while receiving card data: ", error);
                });
        }
    }, [id]);

    const isSizeAvailable = (sizeId: number): boolean => {
        return availableSizes.some((size) => size.id === sizeId);
    };

    const handleAddToCart = async () => {
        try {
            if (selectedSizeId && quantity > 0) {
                const authHeaders = getAuthHeaders();
                const payload = {
                    product: product?.id,
                    size: selectedSizeId,
                    quantity: quantity,
                };

                const isSizeInCart =
                    product &&
                    product.inCart &&
                    product.inCart.some((item) => item.id === selectedSizeId);

                if (isSizeInCart) {
                    setIsAlreadyAdded(true);
                    return;
                }

                await axios.post(
                    `http://127.0.0.1:8000/shop/orderItem/${id}/`,
                    payload,
                    authHeaders
                );
                setIsAlreadyAdded(true);
            } else {
                console.error(
                    "The size has not been selected or the quantity of the product has not been specified."
                );
            }
        } catch (error) {
            console.error("Error when adding item to cart:", error);
        }
    };

    const handleBuyNow = async () => {
        try {
            await handleAddToCart();
            navigate("/Shop/Cart");
        } catch (error) {
            console.error("Error when buying now:", error);
        }
    };
    if (!product) {
        return <div className={s.Loading}>Loading...</div>;
    }

    return (
        <div className={s.product}>
            <div className={s.item}>
                <div className={s.carouselBlock}>
                    <div className={s.smallImgBlock}>
                        <div
                            className={
                                selectedImage === `/${product.mainImg}`
                                    ? s.bgImgSmallActive
                                    : s.bgImgSmall
                            }
                            onClick={() =>
                                handleImageClick(`/${product.mainImg}`)
                            }
                        >
                            <img
                                className={s.smallImg}
                                src={`/${product.mainImg}`}
                            />
                        </div>

                        <div
                            className={
                                selectedImage === "/img/product/01.png"
                                    ? s.bgImgSmallActive
                                    : s.bgImgSmall
                            }
                            onClick={() =>
                                handleImageClick("/img/product/01.png")
                            }
                        >
                            <img
                                className={s.smallImg}
                                src="/img/product/01.png"
                            />
                        </div>
                        <div
                            className={
                                selectedImage === "/img/product/02.png"
                                    ? s.bgImgSmallActive
                                    : s.bgImgSmall
                            }
                            onClick={() =>
                                handleImageClick("/img/product/02.png")
                            }
                        >
                            <img
                                className={s.smallImg}
                                src="/img/product/02.png"
                            />
                        </div>
                        <div
                            className={
                                selectedImage === "/img/product/03.png"
                                    ? s.bgImgSmallActive
                                    : s.bgImgSmall
                            }
                            onClick={() =>
                                handleImageClick("/img/product/03.png")
                            }
                        >
                            <img
                                className={s.smallImg}
                                src="/img/product/03.png"
                            />
                        </div>
                    </div>
                    <div className={s.bgImgBig}>
                        <img
                            className={s.search}
                            src="/img/product/search.svg"
                            alt="search"
                        />
                        <img
                            className={s.cyrcle}
                            src="/img/product/cyrcle.svg"
                            alt="cyrcle"
                        />
                        <img
                            onClick={() => {
                                handleModalOpen();
                            }}
                            className={s.bigImg}
                            src={selectedImage}
                        />
                        {modalOpen && (
                            <div className={s.modal}>
                                <div className={s.modalContent}>
                                    <span
                                        className={s.close}
                                        onClick={() => setModalOpen(false)}
                                    >
                                        &times;
                                    </span>
                                    <img
                                        className={s.modalImage}
                                        src={modalImage}
                                        alt="Modal"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className={s.info}>
                    <h3 className={s.title}>{product.name}</h3>
                    <div className={s.rating}>
                        <p className={s.price}>{product.salePrice}</p>
                        <div className={s.stars}>
                            {rating.map((star) => (
                                <div
                                    className={
                                        star.id <= Math.round(averageRating)
                                            ? s.starSvgActive
                                            : s.starSvg
                                    }
                                    key={star.id}
                                >
                                    {star.icon}
                                </div>
                            ))}
                            <p className={s.review}>
                                {product.reviews.length} Customer Review
                            </p>
                        </div>
                    </div>
                    <p className={s.descriptionTitle}>Short Description:</p>
                    <p className={s.descriptionInfo}>
                        {product.shortDescriptionInfo ? (
                            product.shortDescriptionInfo
                        ) : (
                            <span>There is no product description.</span>
                        )}
                    </p>

                    <p className={s.sizeTitle}>Size:</p>
                    <div className={s.sizeBlock}>
                        {hollowCyrcle.map((item) => (
                            <div key={item.id}>
                                <div
                                    className={`${s.size} ${
                                        selectedSizeId === item.id
                                            ? s.sizeActive
                                            : ""
                                    } ${
                                        !isSizeAvailable(item.id)
                                            ? s.sizeInactive
                                            : ""
                                    }`}
                                    onClick={() => handleSizeClick(item.id)}
                                >
                                    <p>{item.title}</p>
                                    {item.icon}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={s.buying}>
                        <button className={s.minus} onClick={decreaseQuantity}>
                            -
                        </button>
                        <span className={s.quantity}>{quantity}</span>
                        <button className={s.plus} onClick={increaseQuantity}>
                            +
                        </button>

                        <button
                            className={`${
                                isSizeSelected ? s.addToCart : s.selectSize
                            } `}
                            onClick={handleBuyNow}
                        >
                            {isSizeSelected ? "Buy NOW" : "Select size"}
                        </button>
                        <button
                            onClick={handleAddToCart}
                            className={`${
                                isSizeSelected ? s.addToCart : s.selectSize
                            } ${isAlreadyAdded ? s.alreadyAdded : ""}`}
                        >
                            {isSizeSelected
                                ? isAlreadyAdded
                                    ? "Product added"
                                    : "Add to cart"
                                : "Select size"}
                        </button>
                        <button
                            className={`${s.favorite} ${
                                isFavoriteActive ? s.favoriteActive : ""
                            }`}
                            onClick={handleFavoriteClick}
                        >
                            <Heart />
                        </button>
                    </div>
                    <p className={s.productInfoSku}>
                        SKU: <span> {product.sku}</span>
                    </p>
                    <p className={s.productInfoCategory}>
                        Categories:<span> {product.categories.name}</span>
                    </p>
                    <div className={s.links}>
                        <p className={s.share}>Share this products:</p>
                        <a href="www.twitter.com">
                            <img
                                src="/img/product/facebook.svg"
                                alt="facebook"
                            />
                        </a>
                        <a href="www.twitter.com">
                            <img src="/img/product/twitter.svg" alt="twitter" />
                        </a>
                        <a href="www.twitter.com">
                            <img
                                src="/img/product/linkedin.svg"
                                alt="linkedin"
                            />
                        </a>
                    </div>
                </div>
            </div>
            <div className={s.descriptionReviews}>
                <div className={s.switchCategory}>
                    <h5
                        onClick={() => handleTabClick("description")}
                        className={`${s.title} ${
                            activeTab === "description" ? s.titleActive : ""
                        }`}
                    >
                        Product Description
                    </h5>
                    <h5
                        className={`${s.title} ${
                            activeTab === "reviews" ? s.titleActive : ""
                        }`}
                        onClick={() => handleTabClick("reviews")}
                    >
                        Reviews <span>({product.reviews.length})</span>
                    </h5>
                </div>
                {activeTab === "description" ? (
                    <div className={s.description}>
                        <p className={s.descriptionInfo}>
                            {product.shortDescriptionInfo ? (
                                product.shortDescriptionInfo
                            ) : (
                                <span>There is no product description.</span>
                            )}
                        </p>
                    </div>
                ) : (
                    <div className={s.reviews}>
                        {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map((review) => (
                                <div key={review.id} className={s.review}>
                                    <h5 className={s.reviewUserName}>
                                        {review.customer
                                            ? review.customer
                                            : "customer"}
                                    </h5>
                                    <div className={s.stars}>
                                        {rating.map((star) => (
                                            <div
                                                className={
                                                    star.id <= review.rating
                                                        ? s.starSvgActive
                                                        : s.starSvg
                                                }
                                                key={star.id}
                                            >
                                                {star.icon}
                                            </div>
                                        ))}
                                    </div>
                                    <p className={s.reviewInfo}>
                                        {" "}
                                        {review.text}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>No reviews available</p>
                        )}
                        <div className={s.reviewForm}>
                            <h3>Add review</h3>
                            <form onSubmit={handleSubmitReview}>
                                <div className={s.stars}>
                                    {[1, 2, 3, 4, 5].map((id) => (
                                        <div
                                            key={id}
                                            className={`${s.star} ${
                                                id <= starsSelected
                                                    ? s.starSelected
                                                    : ""
                                            }`}
                                            onClick={() => handleStarClick(id)}
                                        >
                                            <Star />
                                        </div>
                                    ))}
                                </div>
                                <textarea
                                    className={s.reviewText}
                                    placeholder="Write your review here..."
                                    value={reviewText}
                                    onChange={(e) =>
                                        setReviewText(e.target.value)
                                    }
                                ></textarea>
                                <button
                                    className={s.submitButton}
                                    type="submit"
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                {showReviewLimitMessage && (
                    <div className={s.reviewLimitOverlay}>
                        <div className={s.messageBox}>
                            <span className={s.text}>
                                You can only leave a review once.
                            </span>
                            <span
                                className={s.closeButton}
                                onClick={handleCloseMessage}
                            >
                                &times;
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCart;
