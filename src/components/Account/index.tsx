import React, { useState } from "react";

import s from "./index.module.scss";
import SwitchBlock from "./SwitchBlock";
import Details from "./Details";
import Address from "./Address";
import Wishlist from "./Wishlist";

const AccountInfo: React.FC = () => {
    const [showDetails, setShowDetails] = useState(true);
    const [showAddress, setShowAddress] = useState(false);
    const [showWishlist, setShowWishlist] = useState(false);

    const handleShowDetails = () => {
        setShowDetails(true);
        setShowAddress(false);
        setShowWishlist(false);
    };

    const handleShowAddress = () => {
        setShowDetails(false);
        setShowAddress(true);
        setShowWishlist(false);
    };

    const handleShowWishlist = () => {
        setShowDetails(false);
        setShowAddress(false);
        setShowWishlist(true);
    };

    return (
        <div className={s.accountInfo}>
            <SwitchBlock
                showDetails={handleShowDetails}
                showAddress={handleShowAddress}
                showWishlist={handleShowWishlist}
            />
            {showDetails && <Details />}
            {showAddress && <Address />}
            {showWishlist && <Wishlist />}
        </div>
    );
};

export default AccountInfo;
