import React, { useState, useEffect } from "react";
import { getAuthHeaders } from "../../../api/auth";
import axios from "axios";

import Delete from "../../OrderQuantitySelector/svg/delete";

import s from "./index.module.scss";

interface UserData {
	id: number;
	username: string;
	email: string;
	cartCount: number;
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

const Address: React.FC = () => {
	const [showRegionDropdown, setShowRegionDropdown] = useState(false);
	const [showStateDropdown, setShowStateDropdown] = useState(false);
	const [filteredRegions, setFilteredRegions] = useState<string[]>([]);
	const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);
	const [filteredStates, setFilteredStates] = useState<string[]>([]);
	const [showRegionDropdownImg, setShowRegionDropdownImg] = useState(false);
	const [showStateDropdownImg, setShowStateDropdownImg] = useState(false);
	const [userData, setUserData] = React.useState<UserData | null>(null);
	const [shippingAddress, setShippingAddress] = useState<ShippingAddress[]>([]);

	const toggleRegionDropdown = () => {
		setShowRegionDropdown(!showRegionDropdown);
		setShowStateDropdown(false);
		setShowRegionDropdownImg(!showRegionDropdownImg);
		setShowStateDropdownImg(false);
		if (!showRegionDropdown) {
			handleRegionInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
		}
	};

	const toggleStateDropdown = () => {
		setShowStateDropdown(!showStateDropdown && !!selectedCountry);
		setShowRegionDropdown(false);
		setShowStateDropdownImg(!showStateDropdownImg);
		setShowRegionDropdownImg(false);
		if (!showStateDropdown) {
			handleStateInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
		}
	};

	const handleRegionSelect = (selectedRegion: string) => {
		const regionInput = document.getElementById("Region") as HTMLInputElement;
		regionInput.value = selectedRegion;
		setSelectedCountry(selectedRegion);
		setShowRegionDropdown(false);
		setShowStateDropdown(false);
	};

	const handleStateSelect = (selectedState: string) => {
		const stateInput = document.getElementById("State") as HTMLInputElement;
		stateInput.value = selectedState;
		setShowStateDropdown(false);
	};

	const handleRegionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value.toLowerCase();

		type Country = {
			id: number;
			country: string;
		};

		const availableRegions: Country[] = [
			{ id: 1, country: "USA" },
			{ id: 2, country: "Russia" },
			{ id: 3, country: "Germany" },
			{ id: 4, country: "Japan" },
			{ id: 5, country: "China" }
		];

		const filteredRegions = availableRegions
			.filter((region) => region.country.toLowerCase().startsWith(inputValue))
			.map((region) => region.country);

		setFilteredRegions(filteredRegions);
		setShowRegionDropdown(true);
		setSelectedCountry(undefined);
		setFilteredStates([]);
		setShowStateDropdown(false);

		if (!inputValue) {
			handleRegionInputClear();
		}
	};

	const handleRegionInputClear = () => {
		const regionInput = document.getElementById("Region") as HTMLInputElement;
		const stateInput = document.getElementById("State") as HTMLInputElement;

		regionInput.value = "";
		stateInput.value = "";
		setSelectedCountry(undefined);
		setShowStateDropdown(false);
	};

	const handleStateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value.toLowerCase();

		const statesByCountry: Record<string, string[]> = {
			USA: ["New York", "California", "Texas", "Florida"],
			Russia: ["Moscow", "Saint Petersburg", "Novosibirsk"],
			Germany: ["Berlin", "Munich", "Hamburg"],
			Japan: ["Tokyo", "Osaka", "Kyoto"],
			China: ["Beijing", "Shanghai", "Guangzhou"]
		};

		const selectedStates = statesByCountry[selectedCountry || ""];

		if (selectedStates && selectedCountry) {
			const filteredStates = selectedStates.filter((state) =>
				state.toLowerCase().startsWith(inputValue)
			);
			setFilteredStates(filteredStates);
			setShowStateDropdown(true);
		} else {
			setShowStateDropdown(false);
		}
	};

	useEffect(() => {
		const token = getAuthHeaders();
		axios
			.get(`http://127.0.0.1:8000/shop/customer/`, token)
			.then((response) => {
				setUserData(response.data);
			})
			.catch((error) => {
				console.error("Error fetching data: ", error);
			});
	}, []);

	useEffect(() => {
		const token = getAuthHeaders();
		axios
			.get("http://127.0.0.1:8000/shop/shippingAddress/", token)
			.then((response) => {
				setShippingAddress(response.data);
			})
			.catch((error) => {
				console.error("Error fetching shipping address data: ", error);
			});
	}, []);

	const handleAddButtonClick = () => {
		const firstName = (document.getElementById("firstName") as HTMLInputElement)?.value;
		const lastName = (document.getElementById("lastName") as HTMLInputElement)?.value;
		const streetAddress = (document.getElementById("streetAddress") as HTMLInputElement)?.value;
		const region = (document.getElementById("Region") as HTMLInputElement)?.value;
		const city = (document.getElementById("City") as HTMLInputElement)?.value;
		const phone = (document.getElementById("Phone") as HTMLInputElement)?.value;
		const state = (document.getElementById("State") as HTMLInputElement)?.value;

		if (!firstName || !lastName || !streetAddress || !region || !city || !phone || !state) {
			alert("Please fill in all required fields");
			return;
		}

		const data = {
			firstName,
			lastName,
			streetAddress,
			region,
			city,
			phone,
			state
		};
		const authHeaders = getAuthHeaders();

		axios
			.post("http://127.0.0.1:8000/shop/shippingAddress/", data, authHeaders)
			.then((response) => {
				console.log("Shipping address added:", response.data);
				axios
					.get("http://127.0.0.1:8000/shop/shippingAddress/", getAuthHeaders())
					.then((response) => {
						setShippingAddress(response.data);
					})
					.catch((error) => {
						console.error("Error fetching updated shipping address data: ", error);
					});
			})
			.catch((error) => {
				console.error("Error adding shipping address:", error);
				if (error.response && error.response.data) {
					const serverError =
						error.response.data.error || error.response.data.detail || "Unknown error occurred";
					alert(serverError);
				} else {
					alert("An error occurred while adding the shipping address");
				}
			});
	};

	const handleDeleteAddress = (addressIdToDelete: number) => {
		const authHeaders = getAuthHeaders();
		const requestData = {
			shippingAddress: addressIdToDelete
		};

		axios
			.delete("http://127.0.0.1:8000/shop/shippingAddress/", {
				headers: {
					Authorization: authHeaders?.headers?.Authorization
				},
				data: requestData
			})
			.then(() => {
				console.log(`Shipping address with ID ${addressIdToDelete} deleted successfully`);
				axios
					.get("http://127.0.0.1:8000/shop/shippingAddress/", authHeaders)
					.then((response) => {
						setShippingAddress(response.data);
					})
					.catch((error) => {
						console.error("Error fetching updated shipping addresses after deletion: ", error);
					});
			})
			.catch((error) => {
				console.error(`Error deleting shipping address with ID ${addressIdToDelete}:`, error);
			});
	};

	const handlePhoneKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		const regex = /[0-9]/;
		const isValidInput = regex.test(event.key);

		if (!isValidInput && event.key !== "Backspace") {
			event.preventDefault();
		}
	};

	const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let phoneNumber = event.target.value;
		if (!phoneNumber.startsWith("+") && phoneNumber !== "") {
			phoneNumber = "+" + phoneNumber;
			(event.target as HTMLInputElement).value = phoneNumber;
		}
	};

	return (
		<div className={s.addressBlock}>
			<div className={s.addAddress}>
				<div className={s.billingAddres}>
					<h5>Billing Address</h5>
					<p>The following addresses will be used on the checkout page by default.</p>
					<h4>(max 3 addresses)</h4>
				</div>
				<p className={s.addBtn} onClick={handleAddButtonClick}>
					Add
				</p>
			</div>
			<div className={s.addedAddresses}>
				{shippingAddress.map((address, index) => (
					<div className={s.adderss} key={index}>
						<h3>Shipping Address {index + 1}</h3>
						<div>
							<p className={s.addressField}>First Name: {address.firstName}</p>
							<p className={s.addressField}>Last Name: {address.lastName}</p>
						</div>
						<div>
							<p className={s.addressField}>Country / Region: {address.region}</p>
							<p className={s.addressField}>Town / City: {address.city}</p>
						</div>
						<div>
							<p className={s.addressField}>State : {address.state}</p>
							<p className={s.addressField}>Phone: {address.phone}</p>
						</div>
						<button onClick={() => handleDeleteAddress(address.id)}>
							<Delete />
						</button>
					</div>
				))}
			</div>

			<div className={s.inputBlock}>
				<form className={s.firstForm}>
					<label htmlFor="firstName">
						<div className={s.formText}>
							<p>First Name</p>
							<span>*</span>
						</div>
						<input type="text" id="firstName" name="firstName" />
					</label>
				</form>
				<form className={s.secondForm}>
					<label htmlFor="lastName">
						<div className={s.formText}>
							<p>Last Name</p>
						</div>
						<input type="text" id="lastName" name="lastName" />
					</label>
				</form>
			</div>

			<div className={s.inputBlock}>
				<form className={s.firstForm}>
					<label htmlFor="Region">
						<div className={s.formText}>
							<p>Country / Region</p>
						</div>
						<input
							onChange={handleRegionInputChange}
							onClick={toggleRegionDropdown}
							placeholder="Select a country / region"
							type="text"
							id="Region"
							name="Region"
						/>
						<img
							className={showRegionDropdown ? s.arrdownActive : s.arrdown}
							src="img/address/arrdown.svg"
							alt="arrdown"
						/>
					</label>
					{showRegionDropdown && (
						<div className={s.dropdownContent}>
							<ul className={s.regionList}>
								{filteredRegions.map((region, index) => (
									<li key={index} onClick={() => handleRegionSelect(region)}>
										{region}
									</li>
								))}
							</ul>
						</div>
					)}
				</form>

				<form className={s.secondForm}>
					<label htmlFor="City">
						<div className={s.formText}>
							<p>Town / City</p>
						</div>
						<input type="text" id="City" name="City" />
					</label>
				</form>
			</div>

			<div className={s.inputBlock}>
				<form className={s.firstForm}>
					<label htmlFor="State">
						<div className={s.formText}>
							<p>State</p>
						</div>
						<input
							onChange={handleStateInputChange}
							onClick={toggleStateDropdown}
							placeholder="Select a state"
							type="text"
							id="State"
							name="State"
							disabled={!selectedCountry}
						/>
						<img
							className={showStateDropdown ? s.arrdownActive : s.arrdown}
							src="img/address/arrdown.svg"
							alt="arrdown"
						/>
					</label>
					{showStateDropdown && (
						<div className={s.dropdownContent}>
							<ul className={s.stateList}>
								{filteredStates.map((state, index) => (
									<li key={index} onClick={() => handleStateSelect(state)}>
										{state}
									</li>
								))}
							</ul>
						</div>
					)}
				</form>
				<form className={s.firstForm}>
					<label htmlFor="streetAddress">
						<div className={s.formText}>
							<p>Street Address</p>
						</div>
						<input
							placeholder="House number and street name"
							id="streetAddress"
							type="text"
							name="streetAddress"
						/>
					</label>
				</form>
			</div>

			<div className={s.inputBlock}>
				<form className={s.firstForm}>
					<label htmlFor="EmailAddress">
						<div className={s.formText}>Email address</div>
						<input
							value={userData?.email || ""}
							readOnly
							type="text"
							id="EmailAddress"
							name="EmailAddress"
						/>
					</label>
				</form>
				<form className={s.secondForm}>
					<label htmlFor="Phone">
						<div className={s.formText}>
							<p>Phone Number</p>
						</div>
						<input
							onKeyDown={handlePhoneKeyDown}
							onChange={handlePhoneChange}
							id="Phone"
							name="Phone"
							placeholder="Enter phone number"
						/>
					</label>
				</form>
			</div>
		</div>
	);
};

export default Address;
