import React, { useState } from "react";

import s from "./index.module.scss";
import SwitchBlock from "./SwitchBlock";
import Details from "./Details";
import Address from "./Address";
import Wishlist from "./Wishlist";
import Orders from "./Orders";

const AccountInfo: React.FC = () => {
    const [showDetails, setShowDetails] = useState(true);
    const [showAddress, setShowAddress] = useState(false);
    const [showWishlist, setShowWishlist] = useState(false);
    const [showOrders, setShowOrders] = useState(false);

    const handleShowDetails = () => {
        setShowDetails(true);
        setShowAddress(false);
        setShowWishlist(false);
        setShowOrders(false);
    };

    const handleShowAddress = () => {
        setShowDetails(false);
        setShowAddress(true);
        setShowWishlist(false);
        setShowOrders(false);
    };

    const handleShowWishlist = () => {
        setShowDetails(false);
        setShowAddress(false);
        setShowWishlist(true);
        setShowOrders(false);
    };

    const handleShowOrders = () => {
        setShowDetails(false);
        setShowAddress(false);
        setShowWishlist(false);
        setShowOrders(true);
    };

    return (
        <div className={s.accountInfo}>
            <SwitchBlock
                showDetails={handleShowDetails}
                showAddress={handleShowAddress}
                showWishlist={handleShowWishlist}
                showOrders={handleShowOrders}
            />
            {showDetails && <Details />}
            {showAddress && <Address />}
            {showWishlist && <Wishlist />}
            {showOrders && <Orders />}
        </div>
    );
};
export default AccountInfo;
