import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuthHeaders } from "../../../api/auth";
import Delete from "../../OrderQuantitySelector/svg/delete";
import axios from "axios";

import API_URL from "../../../api/apiConfig";

import s from "./index.module.scss";

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

interface ShippingAddress {
    id: number;
    state: string;
    phone: string;
    city: string;
    region: string;
    streetAddress: string;
    lastName: string;
    firstName: string;
    customer: {
        email: string;
        username: string;
        id: number;
    };
}

export interface OrderInfo {
    prices: OrderPrices;
    output: OrderItem[];
}

const Payment: React.FC = () => {
    const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress[]>(
        []
    );
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

    useEffect(() => {
        fetchItems();
        fetchShippingAddresses();
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

    const fetchShippingAddresses = () => {
        const token = getAuthHeaders();
        axios
            .get(`${API_URL}/shippingAddress/`, token)
            .then((response) => {
                setShippingAddress(response.data);
            })
            .catch((error) => {
                console.error("Error fetching shipping address data: ", error);
            });
    };

    const handleMethodClick = (methodNumber: number) => {
        if (selectedMethod === methodNumber) {
            setSelectedMethod(null);
        } else {
            setSelectedMethod(methodNumber);
        }
    };

    const handleAddressClick = (index: number) => {
        setSelectedAddress(index === selectedAddress ? null : index);
    };

    const handleDeleteAddress = (addressIdToDelete: number) => {
        const authHeaders = getAuthHeaders();
        const requestData = {
            shippingAddress: addressIdToDelete,
        };

        axios
            .delete(`${API_URL}/shippingAddress/`, {
                headers: {
                    Authorization: authHeaders?.headers?.Authorization,
                },
                data: requestData,
            })
            .then(() => {
                console.log(
                    `Shipping address with ID ${addressIdToDelete} deleted successfully`
                );
                axios
                    .get(`${API_URL}/shippingAddress/`, authHeaders)
                    .then((response) => {
                        setShippingAddress(response.data);
                    })
                    .catch((error) => {
                        console.error(
                            "Error fetching updated shipping addresses after deletion: ",
                            error
                        );
                    });
            })
            .catch((error) => {
                console.error(
                    `Error deleting shipping address with ID ${addressIdToDelete}:`,
                    error
                );
            });
    };

    const handlePlaceOrder = () => {
        if (!isAddressSelected || !isMethodSelected) {
            alert(
                "Address or Payment Method is not selected. Cannot place order."
            );
            return;
        }
        const authHeaders = getAuthHeaders();
        const selectedAddressId =
            selectedAddress !== null
                ? shippingAddress[selectedAddress].id
                : null;
        const requestData = {
            shippingAddress: selectedAddressId,
            paymentMethod: selectedMethod,
        };

        const placeOrderButtonStyle =
            isAddressSelected && isMethodSelected
                ? s.placeOrderSelected
                : s.placeOrder;

        if (placeOrderButtonStyle === s.placeOrderDisabled) {
            console.log("Button is disabled. Cannot place order.");
            return;
        }

        axios
            .post(`${API_URL}/transaction/`, requestData, {
                headers: {
                    Authorization: authHeaders?.headers?.Authorization,
                },
            })
            .then((response) => {
                setShippingAddress(response.data);
            })
            .catch((error) => {
                console.error("Error fetching shipping address data: ", error);
            });
    };

    const isAddressSelected = selectedAddress !== null;
    const isMethodSelected = selectedMethod !== null;

    const placeOrderButtonStyle =
        isAddressSelected && isMethodSelected
            ? s.placeOrderSelected
            : s.placeOrder;

    return (
        <div className={s.payment}>
            <div className={s.addressBlock}>
                <h5 className={s.billingAddress}>Billing Address</h5>
                <Link className={s.newAdressesLink} to={"/account"}>
                    <button className={s.newAdresses}>Add new addresses</button>
                </Link>
                <div className={s.addedAddresses}>
                    {Array.isArray(shippingAddress) &&
                        shippingAddress.length > 0 &&
                        shippingAddress.map((address, index) => (
                            <div
                                onClick={() => handleAddressClick(index)}
                                className={s.adderss}
                                key={index}
                            >
                                <img
                                    className={s.cyrcle0}
                                    src="/img/payment/cyrcle0.svg"
                                    alt="cyrcle"
                                />
                                {selectedAddress === index && (
                                    <img
                                        className={s.cyrcle1}
                                        src="/img/payment/cyrcle1.svg"
                                        alt="cyrcle"
                                    />
                                )}
                                <h3>Shipping Address {index + 1}</h3>

                                <div>
                                    <p className={s.addressField}>
                                        First Name: {address.firstName}
                                    </p>
                                    <p className={s.addressField}>
                                        Last Name: {address.lastName}
                                    </p>
                                </div>
                                <div>
                                    <p className={s.addressField}>
                                        Country / Region: {address.region}
                                    </p>
                                    <p className={s.addressField}>
                                        Town / City: span {address.city}
                                    </p>
                                    <p className={s.addressField}>
                                        Street Address: {address.streetAddress}
                                    </p>
                                </div>
                                <div>
                                    <p className={s.addressField}>
                                        State: {address.state}
                                    </p>
                                    <p className={s.addressField}>
                                        Phone: {address.phone}
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        handleDeleteAddress(address.id)
                                    }
                                >
                                    <Delete />
                                </button>
                            </div>
                        ))}
                </div>
                <p className={s.optional}>Order notes (optional)</p>
                <form className={s.optionalForm}>
                    <textarea
                        className={s.notes}
                        id="textInput"
                        name="textInput"
                    ></textarea>
                </form>
            </div>
            <div className={s.order}>
                <h1>Your Order</h1>
                <div className={s.info}>
                    <h3>Products</h3>
                    <h3>Subtotal</h3>
                </div>

                {orderInfo.output.map((item) => (
                    <div className={s.card} key={item.id}>
                        <Link to={`/shop/${item.idProduct}`}>
                            <img
                                src={`https://greenshopbackend.up.railway.app${item.mainImg}`}
                                alt={item.name}
                            />
                        </Link>
                        <div className={s.cardInfo}>
                            <p className={s.cardInfoName}>{item.name}</p>
                            <div className={s.cardInfoSku}>
                                <p className={s.sku}>SKU:</p>
                                <p className={s.number}>{item.sku}</p>
                            </div>
                        </div>
                        <p className={s.size}>{item.size.name}</p>
                        <p className={s.quantity}>(x {item.quantity})</p>
                        <p className={s.price}>{item.totalPrice}</p>
                    </div>
                ))}
                <div className={s.pricingCards}>
                    <div className={s.pricing}>
                        <p className={s.text}>Subtotal</p>
                        <p className={s.price}>
                            {orderInfo.prices.subtotalPrice}
                        </p>
                    </div>
                    <div className={s.pricing}>
                        <p className={s.text}>Coupon Discount</p>
                        <p>(-) {orderInfo.prices.couponDiscount}</p>
                    </div>
                    <div className={s.pricing}>
                        <p className={s.text}>Shipping</p>
                        <p className={s.price}>
                            {orderInfo.prices.shippingPrice}
                        </p>
                    </div>
                    <div className={s.total}>
                        <p>Total</p>
                        <p className={s.price}>{orderInfo.prices.totalPrice}</p>
                    </div>
                </div>

                <div className={s.methods}>
                    <h4>Payment Method</h4>
                    <div
                        className={s.method}
                        onClick={() => handleMethodClick(1)}
                    >
                        <img
                            className={s.cyrcle0}
                            src="/img/payment/cyrcle0.svg"
                            alt="cyrcle"
                        />
                        {selectedMethod === 1 && (
                            <img
                                className={s.cyrcle1}
                                src="/img/payment/cyrcle1.svg"
                                alt="cyrcle"
                            />
                        )}

                        <h3>Cash on delivery</h3>
                    </div>

                    <div
                        className={s.method}
                        onClick={() => handleMethodClick(2)}
                    >
                        <img
                            className={s.cyrcle0}
                            src="/img/payment/cyrcle0.svg"
                            alt="cyrcle"
                        />
                        {selectedMethod === 2 && (
                            <img
                                className={s.cyrcle1}
                                src="/img/payment/cyrcle1.svg"
                                alt="cyrcle"
                            />
                        )}

                        <h3>Dorect bank transfer</h3>
                    </div>
                    <div
                        className={s.method}
                        onClick={() => handleMethodClick(3)}
                    >
                        <img
                            className={s.cyrcle0}
                            src="/img/payment/cyrcle0.svg"
                            alt="cyrcle"
                        />
                        {selectedMethod === 3 && (
                            <img
                                className={s.cyrcle1}
                                src="/img/payment/cyrcle1.svg"
                                alt="cyrcle"
                            />
                        )}

                        <img
                            className={s.acceptedMethods}
                            src="/img/footer/bottom/accept.png"
                            alt="acceptMethods"
                        />
                    </div>
                </div>

                <button
                    onClick={handlePlaceOrder}
                    className={
                        placeOrderButtonStyle
                            ? s.placeOrderDisabled
                            : s.placeOrder
                    }
                >
                    {placeOrderButtonStyle
                        ? "Select address and Payment Method"
                        : "Place Order"}
                </button>
            </div>
            <div className={s.modalOverlay}>
                <div className={s.modal}>
                    <div className={s.thanksBlock}>
                        <img
                            className={s.crossImg}
                            src="/img/checkout/cross.svg"
                            alt="cross"
                        />
                        <img
                            className={s.thanksImg}
                            src="/img/checkout/thanks.svg"
                            alt="thanks"
                        />
                        <p className={s.thanksText}>
                            Your order has been received
                        </p>
                    </div>
                    <div className={s.allInfoBlock}>
                        <div className={s.info}>
                            <p className={s.mark}>Order Number</p>
                            <p className={s.value}>19586687</p>
                        </div>
                        <div className={s.info}>
                            <p className={s.mark}>Date</p>
                            <p className={s.value}>15 Sep, 2021</p>
                        </div>
                        <div className={s.info}>
                            <p className={s.mark}>Total</p>
                            <p className={s.value}>2,699.00</p>
                        </div>
                        <div className={s.info}>
                            <p className={s.mark}>Payment Method</p>
                            <p className={s.value}>Cash on delivery</p>
                        </div>
                    </div>
                    <div className={s.orderDetails}>
                        <p className={s.orderDetailsText}>Order Details</p>

                        <div className={s.order}>
                            <div className={s.orderMarkText}>
                                <p>Products</p>
                                <p className={s.qty}>Qty</p>
                                <p className={s.subtotal}>Subtotal</p>
                            </div>

                            <div className={s.orderCards}>
                                <div className={s.orderCard}>
                                    <img src="/img/goods/01.png" alt="plant" />

                                    <div className={s.orderCardInfo}>
                                        <p className={s.namePot}>
                                            Barberton Daisy
                                        </p>
                                        <p className={s.skuPot}>
                                            <span>SKU:</span> 1995751877966
                                        </p>
                                    </div>

                                    <p className={s.orderCardQuantity}>(x 2)</p>
                                    <p className={s.orderCardPrice}>$238.00</p>
                                </div>
                                <div className={s.orderCard}>
                                    <img src="/img/goods/01.png" alt="plant" />

                                    <div className={s.orderCardInfo}>
                                        <p className={s.namePot}>
                                            Barberton Daisy
                                        </p>
                                        <p className={s.skuPot}>
                                            <span>SKU:</span> 1995751877966
                                        </p>
                                    </div>

                                    <p className={s.orderCardQuantity}>(x 2)</p>
                                    <p className={s.orderCardPrice}>$238.00</p>
                                </div>
                                <div className={s.orderCard}>
                                    <img src="/img/goods/01.png" alt="plant" />

                                    <div className={s.orderCardInfo}>
                                        <p className={s.namePot}>
                                            Barberton Daisy
                                        </p>
                                        <p className={s.skuPot}>
                                            <span>SKU:</span> 1995751877966
                                        </p>
                                    </div>

                                    <p className={s.orderCardQuantity}>(x 2)</p>
                                    <p className={s.orderCardPrice}>$238.00</p>
                                </div>
                            </div>

                            <div className={s.finalInfoBlock}>
                                <div className={s.finalInfo}>
                                    <p className={s.shipping}>Shiping</p>
                                    <p className={s.shippingPrice}>$16.00</p>
                                </div>
                                <div className={s.finalInfo}>
                                    <p className={s.total}>Total</p>
                                    <p className={s.totalPrice}>$2,699.00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={s.trackBlock}>
                        <p>
                            Your order is currently being processed. You will
                            receive an order confirmation email shortly with the
                            expected delivery date for your items.
                        </p>
                        <button className={s.trackBtn}>Track your order</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
