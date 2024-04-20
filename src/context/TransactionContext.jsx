import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";





export const TransactionContext = React.createContext();

const { ethereum } = window;


const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  console.log({transactionsContract, provider,signer});
  return transactionsContract;
  
};













export const TransactionsProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setformData] = useState({ amount: "" });

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };


  // check wallet MM #1
  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log(accounts)

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        // getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };


  // connect wallet MM #2
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");
      const accounts = await ethereum.request({ method: "eth_requestAccounts", });
      setCurrentAccount(accounts[0]);

    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };


 





  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { amount } = formData;
        const transactionsContract = createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        await transactionsContract.methods.deposit().send({
          
            from: currentAccount,
            gasPrice: null,
            value: parsedAmount._hex,
          
        });

        
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };






// query the contract for a list of all the deposits associated with a wallet address
const getOwnedDeposits = async (address) => {
  return new Promise((resolve, reject) => {
    let ownedDeposits = getOwnedDeposits(address);
    console.log('Owned Deposits: ' + ownedDeposits);
      try {
          ffContract.methods
              .getOwnedDeposits(address)
              .call({ from: address })
              .then(result => {
                  resolve(result);
              })
              .catch(error => reject(error))
      }
      catch(error) {
          reject(error);
      }
  });
}





  
  useEffect(() => {
    checkIfWalletIsConnect();
  
    
  }, []);



  return (
    <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, sendTransaction, handleChange, getOwnedDeposits }}
    >
      {children}
    </TransactionContext.Provider>
  );
};




