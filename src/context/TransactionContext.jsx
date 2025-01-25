import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractAddress, contractABI } from "../utils/constants.js";

export const TransactionContext = React.createContext();

const { ethereum } = window;
// get the smart contract
const getEthereumContract = async () => {
  if (window != "undefined" && window.ethereum != "undefined") {
    //Metamask
    const provider = new ethers.BrowserProvider(ethereum);
    //Get ethereum signer:  allows your application to interact
    const signer = await provider.getSigner();
    //Get ethereum contract
    const transactionContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    return transactionContract;
    // console.log(provider, signer, transactionContract);
  } else {
    console.error("no ethereum provider");
  }
};

//Connect to wallet and send transaction
export const TransactionProvider = ({ children }) => {
  //store the data from the form
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  //handle the change of the form
  const handleChange = (e, name) => {
    //storing the prev Data and updating the new data
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  const [isLoading, setIsLoading] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState("");
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const switchAccounts = async () => {
    if (typeof window != "undefined" && window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setConnectedAccount(accounts[0]);
      });
    } else {
      //Metamask is not installed
      setConnectedAccount("");
      console.error("Please install Metamask");
    }
  };
  //Maintaing the connection wallet when reload the page
  const getCurrentAddressConnected = async () => {
    try {
      if (!ethereum) return alert("You need to install Metamask");
      else {
        const account = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (account.length > 0) {
          setConnectedAccount(account[0]);
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("You need to install Metamask");
      //Get all the account and the user will choose one
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts[0]);
      setConnectedAccount(accounts[0]);
      window.location.reload();
    } catch (err) {
      console.error(err);

      throw new Error("Error connecting wallet");
    }
  };

  const sendTransaction = async () => {
    try {
      if (ethereum) {
        console.log(connectedAccount);
        //receive data from interface
        const { addressTo, amount, keyword, message } = formData;
        //connect to the smart contract created
        const transactionContract = getEthereumContract();
        //convert value in hex
        const convertToHexadecimal = (decimalNumber) => {
          const num = parseFloat(decimalNumber);

          if (isNaN(num)) {
            return "Invalid input";
          }

          // Separate integer and fractional parts
          const integerPart = Math.floor(num);
          const fractionalPart = num - integerPart;

          // Convert integer part to hexadecimal
          const integerHex = integerPart.toString(16).toUpperCase();

          // Convert fractional part to hexadecimal
          let fractionalHex = "";
          let fraction = fractionalPart;
          let maxIterations = 10; // Limit to avoid infinite loops

          while (fraction > 0 && maxIterations > 0) {
            fraction *= 16;
            const digit = Math.floor(fraction);
            fractionalHex += digit.toString(16).toUpperCase();
            fraction -= digit;
            maxIterations--;
          }

          return fractionalHex ? `${integerHex}.${fractionalHex}` : integerHex; // Include fractional part if present
        };
        // const parsedValue = convertToHexadecimal(amount);
        const ethToWei = (eth) => BigInt(eth * 10 ** 18).toString(16);
        const parsedValue = ethToWei(amount); // Outputs: 'DE0B6B3A7640000'
        console.log(parsedValue, addressTo, message, keyword);
        //send transaction
        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: connectedAccount,
              to: addressTo,
              gas: "0x76c0", //30400 Gwei (0,0000304 eth)
              value: parsedValue,
              gasPrice: "0x9184e72a000", //10000000000000 wei (0,00001 eth)
            },
          ],
        });
        const transactionHash = await transactionContract.addToBlockChain(
          addressTo,
          parsedValue,
          message,
          keyword
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash}`);
        setIsLoading(false);

        const transactionCount =
          await transactionContract.getTransactionCount();
        setTransactionCount(transactionCount.toNumber());
      } else {
        console.log("No Ethereum object");
      }
    } catch (err) {
      console.error(err.message);

      throw new Error("No Ethereum object");
    }
  };
  useEffect(() => {
    getCurrentAddressConnected();
    switchAccounts();
  }, [transactionCount]);
  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,

        connectedAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
