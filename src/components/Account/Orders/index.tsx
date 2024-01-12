import React, { useState, useEffect } from "react";
import axios from "axios";
import s from "./index.module.scss";
import { getAuthHeaders } from "../../../api/auth";
import { Link } from "react-router-dom";
import API_URL from "../../../api/apiConfig";

interface Product {
    id: number;
    name: string;
    sku: string;
    salePrice: number;
    quantity: number;
    totalPrice: string;
    mainImg: string;
    size: {
        id: number;
        name: string;
    };
}

interface Order {
    id: number;
    subtotalPrice: string;
    shippingPrice: string;
    totalPrice: string;
    product: Product[];
}

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const authHeaders = getAuthHeaders();
                const response = await axios.get(`${API_URL}/order/`, {
                    headers: {
                        Authorization: authHeaders?.headers?.Authorization,
                    },
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className={s.orders}>
            {orders.map((order) => (
                <div key={order.id} className={s.orderContainer}>
                    <div className={s.orderMainInfo}>
                        <h2 className={s.orderTitle}>Order #{order.id}</h2>
                        <div className={s.orderPrices}>
                            <p className={s.orderInfo}>
                                Subtotal Price: {order.subtotalPrice}
                            </p>
                            <p className={s.orderInfo}>
                                Shipping Price: {order.shippingPrice}
                            </p>
                            <p className={s.orderInfo}>
                                Total Price: {order.totalPrice}
                            </p>
                        </div>
                    </div>
                    <div className={s.productsContainer}>
                        {order.product.map((product) => (
                            <Link
                                to={`/shop/${product.id}`}
                                key={product.id}
                                className={s.productItem}
                            >
                                <img
                                    src={`https://greenshopbackend.up.railway.app${product.mainImg}`}
                                    alt={product.name}
                                    className={s.productImage}
                                />
                                <div className={s.hoverInfo}>
                                    <p>Name: {product.name}</p>
                                    <p>SKU: {product.sku}</p>
                                    <p>Sale Price: {product.salePrice}</p>
                                    <p>Quantity: {product.quantity}</p>
                                    <p>Total Price: {product.totalPrice}</p>
                                    <p>Size: {product.size.name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Orders;
