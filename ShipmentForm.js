import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { database } from "../../Firebase/FirebaseConfig";

const ShipmentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state;

  const [formData, setFormData] = useState({
    senderName: "",
    receiverName: "",
    packageWeight: "",
    deliveryAddress: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 5 + 3));
    return date.toISOString().split("T")[0];
  };

  const createShipment = async () => {
    try {
      await addDoc(collection(database, userId), {
        ...formData,
        shipmentDate: getTodayDate(),
        deliveryDate: getDeliveryDate(),
        status: "Pending",
        createdAt: Timestamp.now(),
      });
      alert("Shipment Confirmed!");
      navigate("/dashboard", { state: userId });
    } catch (error) {
      console.error("Error saving shipment:", error);
      alert("Error saving shipment!");
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();

    const options = {
      key: "rzp_test_ZoVn7fm1R6zBDM", // ✅ Your Razorpay test key
      amount: 50000, // ₹500 in paise
      currency: "INR",
      name: "ShipTrack",
      description: "Shipment Booking",
      handler: function (response) {
        console.log("Payment ID:", response.razorpay_payment_id);
        createShipment();
      },
      prefill: {
        name: formData.senderName,
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <form className="w-full flex justify-center flex-col items-center">
      <h2 className="text-3xl mt-9 text-white underline">Add new Shipment</h2>

      <div className="flex flex-col h-full w-[40%] items-center gap-3 p-4">
        <label className="w-[80%]">
          <p className="text-[18px] text-left text-white">
            Sender Name: <sup className="text-red-700">*</sup>
          </p>
          <input
            required
            type="text"
            name="senderName"
            value={formData.senderName}
            onChange={changeHandler}
            placeholder="Enter Sender Name"
            className="px-3 py-2 rounded text-white bg-richblack-700 w-full"
          />
        </label>

        <label className="w-[80%]">
          <p className="text-[18px] text-white">
            Receiver Name: <sup className="text-red-700">*</sup>
          </p>
          <input
            required
            type="text"
            name="receiverName"
            value={formData.receiverName}
            onChange={changeHandler}
            placeholder="Enter Receiver Name"
            className="px-3 py-2 rounded text-white bg-richblack-700 w-full"
          />
        </label>

        <label className="w-[80%]">
          <p className="text-[18px] text-white">
            Package Weight (kg): <sup className="text-red-700">*</sup>
          </p>
          <input
            required
            type="text"
            name="packageWeight"
            value={formData.packageWeight}
            onChange={changeHandler}
            placeholder="Enter Weight"
            className="px-3 py-2 rounded text-white bg-richblack-700 w-full"
          />
        </label>

        <label className="w-[80%]">
          <p className="text-[18px] text-white">
            Delivery Address: <sup className="text-red-700">*</sup>{" "}
            <small>(building, city, state, pin-code)</small>
          </p>
          <input
            required
            type="text"
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={changeHandler}
            placeholder="Enter Address"
            className="px-3 py-2 rounded text-white bg-richblack-700 w-full"
          />
        </label>
      </div>

      <button
        onClick={handlePayment}
        className="p-2 bg-orange-400 w-[140px] rounded-[12px] mt-4 hover:bg-orange-600 transition-all duration-200 font-semibold"
      >
        Pay & Add
      </button>
    </form>
  );
};

export default ShipmentForm;
