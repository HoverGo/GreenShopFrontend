import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { isUserLoggedIn } from "./api/auth";

import { Home } from "./pages/Home";
import { Account } from "./pages/Account";
import { Shop } from "./pages/Shop";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";

const App: React.FC = () => {
    return (
        <>
            <Routes>
                <Route index path="/" element={<Home />} />
                <Route
                    path="/account"
                    element={
                        isUserLoggedIn() ? (
                            <Account />
                        ) : (
                            <Navigate to="/" replace={true} />
                        )
                    }
                />
                <Route index path="/shop/:id" element={<Shop />} />
                <Route
                    path="/shop/cart"
                    element={
                        isUserLoggedIn() ? (
                            <Cart />
                        ) : (
                            <Navigate to="/" replace={true} />
                        )
                    }
                />
                <Route
                    path="/Shop/Checkout"
                    element={
                        isUserLoggedIn() ? (
                            <Checkout />
                        ) : (
                            <Navigate to="/" replace={true} />
                        )
                    }
                />
            </Routes>
        </>
    );
};

export default App;
