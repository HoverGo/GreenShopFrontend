import React from "react";
import axios from "axios";
import s from "./index.module.scss";

import API_URL from "../../../api/apiConfig";

import { getAuthHeaders } from "../../../api/auth";

const Details: React.FC = () => {
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [imageSrc, setImageSrc] = React.useState<string | null>(null);
    const [passwordChanged, setPasswordChanged] = React.useState(false);

    const currentPasswordRef = React.useRef<HTMLInputElement>(null);
    const newPasswordRef = React.useRef<HTMLInputElement>(null);
    const confirmNewPasswordRef = React.useRef<HTMLInputElement>(null);

    const handleTogglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const profileImg = new FormData();
                profileImg.append("profileImg", file);

                const token = getAuthHeaders();
                const config = {
                    headers: {
                        Authorization: token?.headers?.Authorization,
                        "Content-Type": "multipart/form-data",
                    },
                };

                const response = await axios.post(
                    `https://greenshopbackend.up.railway.app/customer/avatar/`,
                    profileImg,
                    config
                );

                if (response.status === 200) {
                    const profileImgLink = response.data.profileImg;
                    setImageSrc(profileImgLink);
                    alert("Image uploaded successfully");
                    window.location.reload();
                }
            } catch (error) {
                console.error("Error uploading image: ", error);
                alert("Error uploading image. Please try again later.");
            }
        } else {
            alert("Please select an image file.");
        }
    };

    const handleDeleteAvatar = async () => {
        try {
            const token = getAuthHeaders();
            await axios.delete(`${API_URL}/customer/avatar/`, {
                headers: {
                    Authorization: token?.headers?.Authorization,
                },
            });
            setImageSrc(null);
            alert("Avatar deleted successfully");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting avatar: ", error);
            alert("Error deleting avatar. Please try again later.");
        }
    };

    const handleChangePassword = async () => {
        try {
            const token = getAuthHeaders();
            const response = await axios.post(
                `${API_URL}/customer/changePassword/`,
                {
                    currentPassword: currentPasswordRef.current?.value,
                    password: newPasswordRef.current?.value,
                    confirmPassword: confirmNewPasswordRef.current?.value,
                },
                {
                    headers: {
                        Authorization: token?.headers?.Authorization,
                    },
                }
            );

            if (response.status === 200) {
                setPasswordChanged(true);
                alert("Password changed successfully");

                if (
                    currentPasswordRef.current &&
                    newPasswordRef.current &&
                    confirmNewPasswordRef.current
                ) {
                    currentPasswordRef.current.value = "";
                    newPasswordRef.current.value = "";
                    confirmNewPasswordRef.current.value = "";
                }
            }
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response &&
                error.response.data
            ) {
                const errorMessage = error.response.data.error;
                alert(`Error: ${errorMessage}`);

                if (
                    currentPasswordRef.current &&
                    newPasswordRef.current &&
                    confirmNewPasswordRef.current
                ) {
                    currentPasswordRef.current.value = "";
                    newPasswordRef.current.value = "";
                    confirmNewPasswordRef.current.value = "";
                }
            } else {
                alert("Error occurred. Please try again later.");
            }
        }
    };

    return (
        <div className={s.details}>
            <h5>Personal Information</h5>
            <div className={s.emailImg}>
                <div className={s.emailNumberBlock}>
                    <form className={s.email}>
                        <label htmlFor="email">
                            <p>Email address</p>
                            <input type="text" id="email" name="email" />
                        </label>
                    </form>
                    <button className={s.changeEmail}>Change Email</button>
                </div>

                <div className={s.userImgBlock}>
                    <div className={s.imgBlock}>
                        <p>Photo</p>
                        <div className={s.imgBtnBlock}>
                            <div className={s.img}>
                                {imageSrc ? (
                                    <div className={s.img}>
                                        <img
                                            src="img/account/cyrcle.svg"
                                            alt="cyrcle"
                                        />
                                        <img
                                            src="img/account/border.svg"
                                            alt="border"
                                        />
                                        <img
                                            className={s.userImg}
                                            src={imageSrc}
                                            alt="User"
                                        />
                                    </div>
                                ) : (
                                    <div className={s.img}>
                                        <img
                                            src="img/account/cyrcle.svg"
                                            alt="cyrcle"
                                        />
                                        <img
                                            src="img/account/border.svg"
                                            alt="border"
                                        />
                                        <img
                                            className={s.choiceImg}
                                            src="img/account/img.svg"
                                            alt="img"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className={s.choiceBtn}>
                                <label
                                    htmlFor="upload-photo"
                                    className={s.changeBtn}
                                >
                                    Change
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="upload-photo"
                                    style={{ display: "none" }}
                                    onChange={handleImageChange}
                                />
                                <button
                                    className={s.removeBtn}
                                    onClick={handleDeleteAvatar}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={s.passwordBlock}>
                <h5 className={s.password}>Password change</h5>
                <form className={s.form}>
                    <p>Current password</p>
                    <div className={s.passwordContainer}>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="currentPassword"
                            ref={currentPasswordRef}
                        />
                        <img
                            src={
                                passwordVisible
                                    ? "img/header/eyeClose.svg"
                                    : "img/header/eye.svg"
                            }
                            width={24}
                            alt="eye"
                            onClick={handleTogglePasswordVisibility}
                        />
                    </div>
                </form>
                <form className={s.form}>
                    <p>New password</p>
                    <div className={s.passwordContainer}>
                        <input
                            ref={newPasswordRef}
                            type={passwordVisible ? "text" : "password"}
                            name="newPassword"
                        />
                        <img
                            src={
                                passwordVisible
                                    ? "img/header/eyeClose.svg"
                                    : "img/header/eye.svg"
                            }
                            width={24}
                            alt="eye"
                            onClick={handleTogglePasswordVisibility}
                        />
                    </div>
                </form>
                <form className={s.form}>
                    <p>Confirm new password</p>
                    <div className={s.passwordContainer}>
                        <input
                            ref={confirmNewPasswordRef}
                            type={passwordVisible ? "text" : "password"}
                            name="confirmNewPassword"
                        />
                        <img
                            src={
                                passwordVisible
                                    ? "img/header/eyeClose.svg"
                                    : "img/header/eye.svg"
                            }
                            width={24}
                            alt="eye"
                            onClick={handleTogglePasswordVisibility}
                        />
                    </div>
                </form>
            </div>
            {passwordChanged ? (
                <button className={s.passwordChanged}>Password changed</button>
            ) : (
                <button
                    className={s.changePassword}
                    onClick={handleChangePassword}
                >
                    Change password
                </button>
            )}
        </div>
    );
};

export default Details;
