import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { getAuthHeaders } from "../../api/auth";
import API_URL from "../../api/apiConfig";

import s from "./index.module.scss";
import Delete from "./svg/delete";

export interface OrderItem {
    id: number;
    name: string;
    price: string;
    quantity: number;
    mainImg: string;
    totalPrice: string;
    sku: string;
    size: {
        id: number;
        name: string;
    };
    idProduct: number;
}

export interface OrderPrices {
    subtotalPrice: string;
    shippingPrice: string;
    totalPrice: string;
    isUsedCoupon: boolean;
    couponDiscount: string;
    isDiscountCoupon: boolean;
    isFreeDelivery: boolean;
}

export interface OrderInfo {
    prices: OrderPrices;
    output: OrderItem[];
}

const OrderQuantitySelector: React.FC = () => {
    const [coupon, setCoupon] = useState<string>("");
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [orderInfo, setOrderInfo] = useState<OrderInfo>({
        prices: {
            subtotalPrice: "",
            shippingPrice: "",
            totalPrice: "",
            isUsedCoupon: false,
            couponDiscount: "",
            isDiscountCoupon: false,
            isFreeDelivery: false,
        },
        output: [],
    });
    const areProductsInCart = orderInfo.output.length > 0;

    useEffect(() => {
        const savedCoupon = localStorage.getItem("appliedCoupon");
        if (savedCoupon) {
            setAppliedCoupon(savedCoupon);
            setCoupon(savedCoupon);
        }
        fetchItems();
    }, []);

    const fetchItems = () => {
        const authHeaders = getAuthHeaders();
        axios
            .get<OrderInfo>(`${API_URL}/cart/`, authHeaders)
            .then((response) => {
                setOrderInfo(response.data);
            })
            .catch((error) => {
                console.error("Error response:", error);
            });
    };

    const handleDelete = (idProduct: number, sizeId: number) => {
        const authHeaders = getAuthHeaders();

        axios
            .delete(`${API_URL}/orderItem/${idProduct}/`, {
                headers: {
                    Authorization: authHeaders?.headers?.Authorization,
                },
                data: { size: sizeId },
            })
            .then(() => {
                fetchItems();
                console.log(
                    `Item with ID ${idProduct} and size ${sizeId} deleted successfully.`
                );
            })
            .catch((error) => {
                console.error(
                    `Error deleting item with ID ${idProduct} and size ${sizeId}:`,
                    error
                );
            });
    };

    const updateQuantity = (
        idProduct: number,
        sizeId: number,
        newQuantity: number
    ) => {
        const authHeaders = getAuthHeaders();

        axios
            .put(
                `${API_URL}/orderItem/${idProduct}/`,
                { quantity: newQuantity, size: sizeId },
                authHeaders
            )
            .then(() => {
                fetchItems();
            })
            .catch((error) => {
                console.error(
                    `Error updating quantity for item with ID ${idProduct}:`,
                    error
                );
            });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const couponCode = e.currentTarget.elements.namedItem(
            "couponCode"
        ) as HTMLInputElement;

        if (couponCode) {
            setCoupon(couponCode.value);
            applyCoupon(couponCode.value);
        }
    };

    const applyCoupon = (couponCode: string) => {
        const authHeaders = getAuthHeaders();

        axios
            .post(`${API_URL}/cart/coupon/`, { couponCode }, authHeaders)
            .then((response) => {
                console.log("Coupon applied successfully", response.data);
                setAppliedCoupon(couponCode);
                setCoupon(couponCode);
                localStorage.setItem("appliedCoupon", couponCode);
                fetchItems();
            })
            .catch((error) => {
                console.error("Error applying coupon:", error);
            });
    };

    const handleDeleteCoupon = () => {
        const authHeaders = getAuthHeaders();

        axios
            .delete(`${API_URL}/cart/coupon/`, authHeaders)
            .then(() => {
                console.log(`Coupon ${appliedCoupon} deleted successfully`);
                setAppliedCoupon(null);
                setCoupon("");
                localStorage.removeItem("appliedCoupon");
                fetchItems();
            })
            .catch((error) => {
                console.error(`Error deleting coupon ${appliedCoupon}:`, error);
            });
    };

    return (
        <div className={s.OrderQuantitySelector}>
            <div className={s.goods}>
                <div className={s.categories}>
                    <h5 className={s.products}>Products</h5>
                    <h5 className={s.size}>Size</h5>
                    <h5 className={s.price}>Price</h5>
                    <h5 className={s.quantity}>Quantity</h5>
                    <h5 className={s.total}>Total</h5>
                </div>
                {orderInfo.output.map((item) => (
                    <div key={item.id} className={s.goodsBlock}>
                        <div className={s.info}>
                            <img
                                width={70}
                                height={70}
                                src={`https://greenshopbackend.up.railway.app${item.mainImg}`}
                                alt="mainImg"
                            />
                            <div className={s.nameSku}>
                                <p>{item.name}</p>
                                <p className={s.sku}>
                                    SKU: <span>{item.sku}</span>
                                </p>
                            </div>
                        </div>
                        <p className={s.size}>{item.size.name}</p>
                        <p className={s.price}>{item.price}</p>
                        <div className={s.quantity}>
                            <button
                                onClick={() =>
                                    updateQuantity(
                                        item.idProduct,
                                        item.size.id,
                                        item.quantity - 1
                                    )
                                }
                                className={s.minus}
                            >
                                -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                                onClick={() =>
                                    updateQuantity(
                                        item.idProduct,
                                        item.size.id,
                                        item.quantity + 1
                                    )
                                }
                                className={s.plus}
                            >
                                +
                            </button>
                        </div>
                        <p className={s.total}>{item.totalPrice}</p>
                        <button
                            onClick={() =>
                                handleDelete(item.idProduct, item.size.id)
                            }
                        >
                            <Delete />
                        </button>
                    </div>
                ))}
            </div>
            <div className={s.totalPrice}>
                <h1>CartTotal</h1>
                <h3>Coupon Apply</h3>
                <form className={s.couponForm} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter coupon code"
                        name="couponCode"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        readOnly={!!appliedCoupon}
                    />
                    {orderInfo.prices.isUsedCoupon ? (
                        <button
                            className={s.deleteCoupon}
                            onClick={handleDeleteCoupon}
                        >
                            Delete Coupon
                        </button>
                    ) : (
                        <button className={s.applyCoupon} type="submit">
                            Apply
                        </button>
                    )}
                </form>
                <div className={s.pricing}>
                    <p className={s.text}>Subtotal</p>
                    <p className={s.price}>{orderInfo.prices.subtotalPrice}</p>
                </div>
                <div className={s.pricing}>
                    <p className={s.text}>Coupon Discount</p>
                    <p>(-) {orderInfo.prices.couponDiscount}</p>
                </div>
                <div className={s.pricing}>
                    <p className={s.text}>Shipping</p>
                    <p className={s.price}>{orderInfo.prices.shippingPrice}</p>
                </div>
                <div className={s.total}>
                    <p>Total</p>
                    <p className={s.price}>{orderInfo.prices.totalPrice}</p>
                </div>

                <NavLink
                    to={areProductsInCart ? "/shop/checkout" : "/"}
                    className={
                        areProductsInCart ? s.checkout : s.checkoutDisabled
                    }
                >
                    {areProductsInCart
                        ? "Proceed To Checkout"
                        : "Select product"}
                </NavLink>
                <NavLink to={"/"} className={s.continue}>
                    Continue Shopping
                </NavLink>
            </div>
        </div>
    );
};

export default OrderQuantitySelector;
