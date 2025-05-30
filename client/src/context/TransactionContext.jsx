import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

// Check if window.ethereum exists
const getEthereum = () => {
  const { ethereum } = window;
  if (!ethereum) {
    console.error("Ethereum object not found! Make sure MetaMask is installed.");
    return null;
  }
  return ethereum;
};

const getEthereumContract = () => {
  try {
    const ethereum = getEthereum();
    if (!ethereum) return null;

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log("Contract initialized successfully:", {
      provider,
      signer,
      contractAddress,
    });

    return transactionsContract;
  } catch (error) {
    console.error("Error creating Ethereum contract:", error);
    return null;
  }
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount") || "0");
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = (e, name) => {
    try {
      setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
    } catch (error) {
      console.error("Error updating form data:", error);
      setError("Failed to update form field. Please try again.");
    }
  };

  const getAllTransactions = async () => {
    try {
      console.log("Fetching all transactions...");
      const ethereum = getEthereum();
      if (!ethereum) {
        setError("MetaMask is not installed. Please install it to use this application.");
        return;
      }
        
      const transactionsContract = getEthereumContract();
      if (!transactionsContract) {
        setError("Failed to initialize contract connection.");
        return;
      }

      console.log("Requesting transactions from contract...");
      const availableTransactions = await transactionsContract.getAllTransactions();
      console.log("Raw transactions received:", availableTransactions);

      const structuredTransactions = availableTransactions.map((transaction) => {
        try {
          const amountInEth = parseInt(transaction.amount._hex) / (10 ** 18);
          return {
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
            message: transaction.message,
            keyword: transaction.keyword,
            amount: amountInEth
          };
        } catch (err) {
          console.error("Error processing transaction:", err, transaction);
          return null;
        }
      }).filter(Boolean);

      console.log("Processed transactions:", structuredTransactions);
      setTransactions(structuredTransactions);
      setError(null);
    } catch (error) {
      console.error("Failed to get transactions:", error);
      setError("Failed to fetch transactions. Please check your connection and try again.");
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      console.log("Checking if wallet is connected...");
      const ethereum = getEthereum();
      if (!ethereum) {
        setError("MetaMask is not installed. Please install it to use this application.");
        return false;
      }

      try {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        console.log("Accounts found:", accounts);

        if (accounts.length) {
          setCurrentAccount(accounts[0]);
          console.log("Wallet already connected:", accounts[0]);
          return true;
        } else {
          console.log("No authorized accounts found");
          setError("No authorized accounts found. Please connect your wallet.");
          return false;
        }
      } catch (requestError) {
        console.error("Error requesting accounts:", requestError);
        setError("Failed to access your wallet. Please check MetaMask permissions.");
        return false;
      }
    } catch (error) {
      console.error("Wallet connection check failed:", error);
      setError("Wallet connection check failed.");
      return false;
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      console.log("Checking for existing transactions...");
      const ethereum = getEthereum();
      if (!ethereum) return false;

      const transactionsContract = getEthereumContract();
      if (!transactionsContract) return false;

      const currentTransactionCount = await transactionsContract.getTransactionCount();
      console.log("Current transaction count:", currentTransactionCount.toString());

      window.localStorage.setItem("transactionCount", currentTransactionCount.toString());
      setTransactionCount(currentTransactionCount.toString());
      return true;
    } catch (error) {
      console.error("Failed to check existing transactions:", error);
      setError("Failed to verify transaction history.");
      return false;
    }
  };

  const connectWallet = async () => {
    try {
      console.log("Attempting to connect wallet...");
      const ethereum = getEthereum();
      if (!ethereum) {
        setError("MetaMask is not installed. Please install it to use this application.");
        return false;
      }

      try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        console.log("Connected to account:", accounts[0]);
        setCurrentAccount(accounts[0]);
        setError(null);
        
        // We'll refresh transaction data instead of reloading the page
        await getAllTransactions();
        return true;
      } catch (requestError) {
        console.error("User denied account access:", requestError);
        setError("Connection request was denied. Please approve the connection request in MetaMask.");
        return false;
      }
    } catch (error) {
      console.error("Connect wallet error:", error);
      setError("Failed to connect wallet. Please try again.");
      return false;
    }
  };

  const sendTransaction = async () => {
    try {
      console.log("Preparing to send transaction...");
      const ethereum = getEthereum();
      if (!ethereum) {
        setError("MetaMask is not installed. Please install it to use this application.");
        return false;
      }

      // Validate form data
      const { addressTo, amount, keyword, message } = formData;
      if (!addressTo || !amount) {
        setError("Please provide recipient address and amount");
        return false;
      }

      try {
        const transactionsContract = getEthereumContract();
        if (!transactionsContract) {
          setError("Failed to initialize contract connection.");
          return false;
        }

        console.log("Parsing amount:", amount);
        const parsedAmount = ethers.utils.parseEther(amount);
        console.log("Parsed amount:", parsedAmount.toString());

        console.log("Sending transaction to address:", addressTo);
        console.log("From account:", currentAccount);

        // First send ETH transaction
        await ethereum.request({
          method: "eth_sendTransaction",
          params: [{
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", // 21000 GWEI
            value: parsedAmount._hex,
          }],
        });

        console.log("ETH transfer initiated, now adding to blockchain...");
        
        // Then add to our contract
        const transactionHash = await transactionsContract.addToBlockchain(
          addressTo, 
          parsedAmount, 
          message || "", 
          keyword || ""
        );

        setIsLoading(true);
        console.log(`Transaction submitted. Hash: ${transactionHash.hash}`);
        console.log("Waiting for transaction confirmation...");
        
        await transactionHash.wait();
        console.log(`Transaction confirmed! Hash: ${transactionHash.hash}`);
        
        setIsLoading(false);
        setError(null);

        // Update transaction count
        const transactionsCount = await transactionsContract.getTransactionCount();
        console.log("New transaction count:", transactionsCount.toString());
        setTransactionCount(transactionsCount.toString());
        localStorage.setItem("transactionCount", transactionsCount.toString());
        
        // Refresh transactions
        await getAllTransactions();
        
        // Reset form data
        setformData({ addressTo: "", amount: "", keyword: "", message: "" });
        
        return true;
      } catch (txError) {
        setIsLoading(false);
        console.error("Transaction error:", txError);
        
        if (txError.code === 4001) {
          setError("Transaction was rejected by user.");
        } else {
          setError(`Transaction failed: ${txError.message || "Unknown error"}`);
        }
        return false;
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Send transaction error:", error);
      setError("Transaction failed. Please check your inputs and try again.");
      return false;
    }
  };

  // Initialize wallet connection and transaction data
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log("Initializing application...");
        const isConnected = await checkIfWalletIsConnect();
        if (isConnected) {
          await checkIfTransactionsExists();
          await getAllTransactions();
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    initialize();
  }, []);

  // Listen for account changes
  useEffect(() => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    const handleAccountsChanged = (accounts) => {
      console.log("Accounts changed:", accounts);
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      } else {
        setCurrentAccount("");
        setTransactions([]);
      }
    };

    ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setformData,
        handleChange,
        sendTransaction,
        transactions,
        isLoading,
        transactionCount,
        error,
        setError
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};