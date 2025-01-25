import React, { useContext, useEffect } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { Loader } from ".";
import { TransactionContext } from "../context/TransactionContext";
const companyCommonStyles =
  "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";
const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="input"
  ></input>
);
const Welcome = () => {
  //passig all the data that we need from our transaction context
  const {
    connectWallet,
    connectedAccount,
    formData,
    handleChange,
    sendTransaction,
  } = useContext(TransactionContext);

  const handleSubmit = (e) => {
    const { addressTo, amount, keyword, message } = formData;

    e.preventDefault();

    if (!addressTo || !amount || !keyword || !message) return;
    sendTransaction();
  };
  return (
    <div className="welcome-container">
      <div>
        <div className="text-white text-3xl text-gradient message">
          <h1>
            Send Crypto <br />
            across the world
          </h1>
          <p>
            Explore the crypto world, use cryptocurrencies to complete your
            payments
          </p>
        </div>
        <button
          type="button"
          onClick={connectWallet}
          className="btn-connectWallet"
        >
          {connectedAccount > 0
            ? `${connectedAccount.substring(
                0,
                6
              )}...${connectedAccount.substring(36)}`
            : "Connect Wallet"}
        </button>
      </div>

      <div className="right-side">
        <div className="eth-card card-details white-glassmorphism">
          <p className="address">0xd...678876</p>
          <p className="eth">Ethereum</p>
        </div>
        <div className="form">
          <Input
            placeholder="Address To"
            name="addressTo"
            type="text"
            handleChange={handleChange}
          />
          <Input
            placeholder="Amount (ETH)"
            name="amount"
            type="number"
            handleChange={handleChange}
          />
          <Input
            placeholder="keyword (Gif)"
            name="keyword"
            type="text"
            handleChange={handleChange}
          />
          <Input
            placeholder="Enter Message"
            name="message"
            type="text"
            handleChange={handleChange}
          />

          <div className="underline" />
          {false ? (
            <Loader />
          ) : (
            <button type="button" onClick={handleSubmit} className="btn-send">
              Send Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Welcome;
