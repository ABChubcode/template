//import React, { useContext } from "react";
//import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
//import { FaUniversalAccess } from "react-icons/fa"
import { BsInfoCircle } from "react-icons/bs";

import React, { useEffect, useState } from "react";
import Web3 from 'web3'
import { ethers } from "ethers";
//import { contractABI, contractAddress } from "../utils/constants";
import { fairfundContract } from '../utils/fairfund'; 


//import { TransactionContext } from "../context/TransactionContext";
import { Loader } from "./";
//import { shortenAddress } from '../utils/shortenAddress'; 

const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";


const Input = ({ placeholder, name, type, value, id }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.001"
    value={value}
    id={id}
    
    
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);



const Welcome = () => {
/**
    const {  isLoading } = useContext(TransactionContext);

   
    */

  const [web3, setWeb3] = useState()
  const [address, setAddress] = useState()
  const [ffContract, setFfContract] = useState()
  //const { connectWallet, currentAccount, handleChange, formData, sendTransaction } = useContext(TransactionContext);

  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')


  const [investor, setInvestor] = useState('');
  const [claimableReward, setClaimableReward] = useState(0);

  const [depositAmount, setDepositAmount] = useState(0);
  const [depositId, setDepositId] = useState(0);
  const [depositResult, setDepositResult] = useState(null);

  const [claimAllRewardResult, setClaimAllRewardResult] = useState(null);
  const [withdrawCapitalResult, setWithdrawCapitalResult] = useState(null);


  const [currentDepositId, setCurrentDepositId] = useState(0);
  const [depositState, setDepositState] = useState(null);
  const [ownedDeposits, setOwnedDeposits] = useState([]);

  const [totalDepositAmount, setTotalDepositAmount] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);


  const [dailyAmount, setDailyAmount] = useState(null);
  const [hourlyAmount, setHourlyAmount] = useState(null);

  const [amountPerDay, setAmountPerDay] = useState(0);
  const [amountPerHour, setAmountPerHour] = useState(0);




  useEffect(() => {
    
  }, [ffContract])


  const handleGetAllClaimableReward = async () => {
    const result = await ffContract.methods.getAllClaimableReward(address).call({
      from: address
    });
    const claimableRewardInEther = Web3.utils.fromWei(result, 'ether');
    setClaimableReward(claimableRewardInEther);
  };

  /*
  useEffect(() => {
    const fetchData = async () => {
        // Call the getClaimableReward function to get the claimable reward of the investor
        const claimableReward = await ffContract.methods.getClaimableReward(address).call();

        // Update the state with the claimable reward in ether
        setClaimableReward(Web3.utils.fromWei(claimableReward, 'ether'));
      }

    fetchData();
  }, [ffContract]); // The empty array as the second argument makes the effect only run once when the component mounts
*/




  const handleDeposit = async () => {
    const result = await ffContract.methods.deposit().send({
      from: address,
      value: Web3.utils.toWei(depositAmount.toString(), 'ether')
    });
    setDepositResult(result);
  };




  const handleClaimAllReward = async () => {
    const result = await ffContract.methods.claimAllReward().send({
      from: address
    });
    setClaimAllRewardResult(result);
  };


  











  const handleWithdrawCapital = async () => {
    const result = await ffContract.methods.withdrawCapital(depositId).send({
      from: address
    });
    setWithdrawCapitalResult(result);
  };






  const handleGetCurrentDepositID = async () => {
    const result = await ffContract.methods.getCurrentDepositID().call({
      from: address
    });
    setCurrentDepositId(result);
  };

 

  const handleGetDepositState = async () => {
    const depositState = await ffContract.methods.getDepositState(depositId).call({
      from: address
    });
    const depositAmountInEther = Web3.utils.fromWei(depositState.depositAmount, 'ether');
    const claimedAmountInEther = Web3.utils.fromWei(depositState.claimedAmount, 'ether');
  
    // Convert the timestamp to a human-readable time
    const date = new Date(depositState.depositAt * 1000);
    const humanReadableTime = `${date.toDateString()} ${date.toTimeString()}`;
  
    // Set the deposit state in state
    setDepositState({
      investor: depositState.address,
      depositAmount: depositAmountInEther,
      depositAt: humanReadableTime,
      claimedAmount: claimedAmountInEther,
      state: depositState.state
    });
  };
  

  const handleGetOwnedDeposits = async () => {
    const result = await ffContract.methods.getOwnedDeposits(address).call({
      from: address
    });
    setOwnedDeposits(result);
  };





  const handleGetTotalDepositAmount = async () => {
      // Get the array of deposit IDs that the investor owns
      const ownedDeposits = await ffContract.methods.getOwnedDeposits(address).call();
      // Initialize the total deposit amount to 0
      let totalDepositAmountInWei = 0;

      // Iterate through the array of deposit IDs
      for (const id of ownedDeposits) {
        // Get the deposit state
        const depositState = await ffContract.methods.getDepositState(id).call();

        // Add the deposit amount to the total deposit amount
        totalDepositAmountInWei += depositState.depositAmount;
      }

      // Convert the total deposit amount from wei to ether
      const totalDepositAmountInEther = Web3.utils.fromWei(totalDepositAmountInWei, 'ether');

      // Set the total deposit amount in ether in state
      setTotalDepositAmount(totalDepositAmountInEther);
  
  };



  const handleGetTotalAmount = async () => {
      // Get the array of deposit IDs that the investor owns
      const ownedDeposits = await ffContract.methods.getOwnedDeposits(address).call();

      // Initialize the total deposit amount to 0
      let totalDepositAmountInWei = 0;

      // Iterate through the array of deposit IDs
      for (const id of ownedDeposits) {
        // Get the deposit state
        const depositState = await ffContract.methods.getDepositState(id).call();

        // Add the deposit amount to the total deposit amount
        totalDepositAmountInWei += depositState.depositAmount;
      }

      // Convert the total deposit amount from wei to ether
      const totalDepositAmountInEther = web3.utils.fromWei(totalDepositAmountInWei, 'ether');

      // Get the total claimable reward for the investor
      const totalClaimableRewardInWei = await ffContract.methods.getAllClaimableReward(address).call();

      // Convert the total claimable reward from wei to ether
      const totalClaimableRewardInEther = web3.utils.fromWei(totalClaimableRewardInWei, 'ether');

      // Calculate the total amount in ether
      const totalAmountInEther = totalDepositAmountInEther+totalClaimableRewardInEther;

      // Set the total amount in ether in state
      setTotalAmount(totalAmountInEther);
    
  };



  const handleCalculateAmount = async () => {
      // Get the APR (annual percentage rate) in percentage
      const aprInPercentage = await ffContract.methods.apr().call();

      // Calculate the daily percentage rate
      const dailyPercentageRate = (aprInPercentage * 365) / 100;

      // Calculate the hourly percentage rate
      const hourlyPercentageRate = dailyPercentageRate / 24;







      // Get the array of deposit IDs that the investor owns
      const ownedDeposits = await ffContract.methods.getOwnedDeposits(investor).call();

      // Initialize the total deposit amount to 0
      let totalDepositAmountInWei = 0;

      // Iterate through the array of deposit IDs
      for (const id of ownedDeposits) {
        // Get the deposit state
        const depositState = await ffContract.methods.getDepositState(id).call();

        // Add the deposit amount to the total deposit amount
        totalDepositAmountInWei += depositState.depositAmount;
      }


      // Convert the total deposit amount from wei to ether
      const totalDepositAmountInEther = Web3.utils.fromWei(totalDepositAmountInWei, 'ether');


console.log(totalDepositAmountInEther)













      // Calculate the daily amount in ether
      const dailyAmountInEther = (totalDepositAmountInEther * dailyPercentageRate) / 1000;

      // Calculate the hourly amount in ether
      const hourlyAmountInEther = (totalDepositAmountInEther * hourlyPercentageRate) / 100;

      // Set the daily and hourly amounts in state
      setDailyAmount(dailyAmountInEther);
      setHourlyAmount(hourlyAmountInEther);
  
  };




/*
const handleCalculateAmount = async () => {
  
  
    // Get the APR (annual percentage rate) in percentage
    const aprInPercentage = await ffContract.methods.apr().call();

    // Calculate the daily percentage rate
    const dailyPercentageRate = (aprInPercentage * 365) / 100;

    // Calculate the hourly percentage rate
    const hourlyPercentageRate = dailyPercentageRate / 24;

    // Get the array of deposit IDs for the investor
    const depositIDs = await ffContract.methods
        .ownedDeposits(address, { from: address })
        .call();

    // Calculate the total deposit amount in wei
    let totalDepositAmountInWei = 0;
    for (const depositID of depositIDs) {
      const deposit = await ffContract.methods.depositState(depositID).call();
      totalDepositAmountInWei += deposit.depositAmount;
    }

    // Convert the total deposit amount from wei to ether
    const totalDepositAmountInEther = Web3.utils.fromWei(totalDepositAmountInWei, 'ether');

    // Get the total claimable reward amount for the investor
    const totalClaimableRewardInWei = await ffContract.methods
      .getAllClaimableReward(address)
      .call();

    // Convert the total claimable reward amount from wei to ether
    const totalClaimableRewardInEther = Web3.utils.fromWei(totalClaimableRewardInWei, 'ether');

    // Calculate the total amount in ether
    const totalAmountInEther = totalDepositAmountInEther + totalClaimableRewardInEther;

    // Calculate the daily amount in ether
    const dailyAmountInEther = (totalAmountInEther * dailyPercentageRate) / 100;

    // Calculate the hourly amount in ether
    const hourlyAmountInEther = (totalAmountInEther * hourlyPercentageRate) / 100;

   // Set the daily and hourly amounts in state
   setDailyAmount(dailyAmountInEther);
   setHourlyAmount(hourlyAmountInEther);
  };
*/



const fetchData = async () => {
  
      // Call the getClaimableReward function to get the claimable reward of the investor
      const claimableReward = await ffContract.methods.getClaimableReward(address).call();
      // Convert the claimable reward from wei to ether
      const claimableRewardInEther = web3.utils.fromWei(claimableReward, 'ether');

      // Call the getOwnedDeposits function to get the IDs of the deposits made by the investor
      const depositIDs = await ffContract.methods.getOwnedDeposits(address).call();

      // Initialize the total deposit amount to 0
      let totalDepositAmount = 0;

      // Iterate through the deposit IDs
      for (const id of depositIDs) {
        // Get the deposit state of the current ID
        const deposit = await ffContract.methods.depositState(id).call();

        // Add the deposit amount to the total deposit amount
        totalDepositAmount += deposit.depositAmount;
      }


      // Convert the total deposit amount from wei to ether
      const totalDepositAmountInEther = web3.utils.fromWei(totalDepositAmount, 'ether');

      // Calculate the total amount in ether
      const totalAmountInEther = claimableRewardInEther+totalDepositAmountInEther;

      // Update the states with the claimable reward and total amount in ether
      setClaimableReward(parseFloat(claimableRewardInEther));
      setTotalAmount(parseFloat(totalAmountInEther));

      // Calculate the amount per day and per hour
      const secondsPerDay = 86400;
      const secondsPerHour = 3600;
      setAmountPerDay((totalAmountInEther / secondsPerDay));
      setAmountPerHour((totalAmountInEther / secondsPerHour));
    };












  const DepositHandler = async () => {
    setError('')
    setSuccessMsg('')
    const amount = document.getElementById("depositInput").value;
    const parsedAmount = ethers.utils.parseEther(amount);
    try {
      await ffContract.methods.deposit().send({
        from: address,
        value: parsedAmount._hex,
        gasPrice: null
      })
      updateState()
    } catch(err) {
      setError(err.message)
    }
  }

    const connectWalletHandler = async () => {
      setError('')
      setSuccessMsg('')
      /* check if MetaMask is installed */
      if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        try {
          /* request wallet connection */
          await window.ethereum.request({ method: "eth_requestAccounts"})
          /* create web3 instance & set to state */
          const web3 = new Web3(window.ethereum)
          /* set web3 instance in React state */
          setWeb3(web3)
          /* get list of accounts */
          const accounts = await web3.eth.getAccounts()
          /* set account 1 to React state */
          setAddress(accounts[0])
  
          /* create local contract copy */
          /*const lc = lotteryContract(web3)
          setLcContract(lc)*/
  
          /* create local contract copy */
          const ff = fairfundContract(web3)
          setFfContract(ff)
  
          window.ethereum.on('accountsChanged', async () => {
            const accounts = await web3.eth.getAccounts()
            console.log(accounts[0])
            /* set account 1 to React state */
            setAddress(accounts[0])
          })
        } catch(err) {
          setError(err.message)
        }
      } else {
        /* MetaMask is not installed */
        console.log("Please install MetaMask")
      }
    }
  

   // query the contract for ALL the claimable rewards associated with a wallet address
const getAllClaimableRewards = (address) => {
  return new Promise((resolve, reject) => {
      try {
          //let web3 = new Web3(rpcToUse);
          //let contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
          ffContract.methods
              .getAllClaimableReward(address)
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



    return (
      <div className="flex w-full justify-center items-center">
        <div className="flex md:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
          <div className="flex flex-1 justify-start items-start flex-col md:mr-10">
            <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
              Send Crypto <br /> a
            </h1>
            <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
              Explore the crypto world. 
            </p>
            
            {!address && (
              <button
                type="button"
                onClick={connectWalletHandler}
                className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
              >
                <p className="text-white text-base font-semibold">Connect Wallet</p>
              </button>
            )}
            
            
            <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
              <div className={`rounded-tl-2xl ${companyCommonStyles}`}>
                Reliability
              </div>
              <div className={companyCommonStyles}>Security</div>
              <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>
                Universal Fund
              </div>
              <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>
                20% monthly 
              </div>
              <div className={companyCommonStyles}>Low Fees</div>
              <div className={`rounded-br-2xl ${companyCommonStyles}`}>
                Blockchain
              </div>
              
            </div>

            <div>

                <button onClick={handleGetAllClaimableReward} 
                    className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">
                  All Claimable Rewards
                </button>

                
                  <button onClick={handleClaimAllReward}
                    className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">
                        Claim All Reward
                  </button>
                  {claimAllRewardResult && (
                    <p>Transaction Hash: {claimAllRewardResult.transactionHash}</p>
                  )}

            
              

                <button 
                   className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"

                  onClick={handleGetCurrentDepositID}>Current Deposit ID</button>
                  {currentDepositId && <p className="text-white font-semibold text-lg mt-1">Current Deposit ID: {currentDepositId}</p>}

                  <button 
                    className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"

                    onClick={handleGetOwnedDeposits}>Owned Deposits</button>
                    {ownedDeposits.length > 0 && (
                      <ul className="text-white font-semibold text-lg mt-1">
                        {ownedDeposits.map(depositId => (
                          <li key={depositId}>{depositId}</li>
                        ))}
                      </ul>
                    )}


                <button 
                 className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"

                onClick={handleGetDepositState}>Get Deposit State</button>
                 <input
                  className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism"
                  type="number"
                  value={depositId}
                  onChange={e => setDepositId(e.target.value)}
                />
                {depositState && (
                  <div>
                    <p className="text-white font-semibold text-lg mt-1">Investor: {depositState.address}</p>
                    <p className="text-white font-semibold text-lg mt-1">Deposit Amount: {depositState.depositAmount}</p>
                    <p className="text-white font-semibold text-lg mt-1">Deposit At: {depositState.depositAt}</p>
                    <p className="text-white font-semibold text-lg mt-1">Claimed Amount: {depositState.claimedAmount}</p>
                    <p className="text-white font-semibold text-lg mt-1">State: {depositState.state ? 'Active' : 'Withdrawn'}</p>
                  </div>
                )}

            {/*<div>
                  <button onClick={fetchData}>Get Data</button>
                  <h1>Claimable Reward: {claimableReward} ETH</h1>
                  <h1>Total Amount: {totalAmount/10**16} ETH</h1>
                  <h1>Amount per Day: {amountPerDay/10**13} ETH</h1>
                  <h1>Amount per Hour: {amountPerHour/10**15} ETH</h1>
                </div>*/}

            </div>
            
          </div>
          
          <div className="flex flex-col flex-1 items-center justify-start w-full md:mt-0 mt-10">

          
               
            <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism ">
              <div className="flex justify-between flex-col w-full h-full">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                    <SiEthereum fontSize={21} color="#fff" />
                  </div>
                  <BsInfoCircle fontSize={17} color="#fff" />
                  
                </div>
                <div>
                  <p className="text-white font-light text-sm min-h-[50px] sm:px-0 px-0 sm:min-w-[100px]">
                    {address}
                  </p>
                  
                  <h1>Claimable Reward:</h1>
                  <p className="text-white font-light text-sm min-h-[50px] sm:px-0 px-0 sm:min-w-[100px]">
                  {claimableReward} ETH
                  </p>
                  
                   
                  
                </div>
              </div>


            </div>
            
            <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                <Input type="number" id="depositInput" placeholder="Enter Amount" ></Input>
              <div className="h-[1px] w-full bg-gray-400 my-2" />
              
              {false
              ? <Loader />
              : (
                <button
                  type="button"
                  onClick={DepositHandler}
                  className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                >
                  Deposit 
                </button>
              )}


              
              <button     
              className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
              onClick={handleWithdrawCapital}>Withdraw Capital</button>
              {withdrawCapitalResult && (
                <p className="text-white font-semibold text-lg mt-1">Transaction Hash: {withdrawCapitalResult.transactionHash}</p>
              )}


              

               
                

                  <div>
                    
                    <button 
                      className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                    onClick={handleGetTotalDepositAmount}>Get Total Deposit Amount</button>
                    {totalDepositAmount && <p className="text-white font-semibold text-lg mt-1">Total Deposit Amount: {totalDepositAmount} ether</p>}
                  </div>

                  <div>
                    
                    <button 
                      className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                      onClick={handleGetTotalAmount}>Get total amount</button>
                    {totalAmount && <p className="text-white font-semibold text-lg mt-1">Total amount: {totalAmount} ether</p>}
                  </div>





                  <div>
                    
                    <button 
                        className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                        onClick={handleCalculateAmount}>Calculate Amount</button>
                    <div className="text-white font-semibold text-lg mt-1">Hourly Amount: {hourlyAmount}</div>
                    <div className="text-white font-semibold text-lg mt-1">Daily Amount: {dailyAmount}</div>
                    
                  </div>
                                            


                  
                      
            </div>



            
              {/*<input
                type="number"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
              />
              <button 
             className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
              onClick={handleDeposit}>Deposit</button>
              {depositResult && <p className="text-white font-semibold text-lg mt-1">Transaction Hash: {depositResult.transactionHash}</p>}
              */}


              
              
            
          </div>

          
        </div>
      </div>
    );
}

export default Welcome;

















/**
 


import React, { useContext } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

import { TransactionContext } from "../context/TransactionContext";
import { Loader } from "./";
import { shortenAddress } from '../utils/shortenAddress'; 

const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);


const Welcome = () => {

    const { currentAccount, connectWallet, handleChange, sendTransaction, formData, isLoading } = useContext(TransactionContext);

   
    const handleSubmit = (e) => {
      const { addressTo, amount, keyword, message } = formData;

      e.preventDefault();

      if (!addressTo || !amount || !keyword || !message) return;

      sendTransaction();
    
    }

    return (
      <div className="flex w-full justify-center items-center">
        <div className="flex md:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
          <div className="flex flex-1 justify-start items-start flex-col md:mr-10">
            <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
              Send Crypto <br /> across the world
            </h1>
            <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
              Explore the crypto world. Buy and sell cryptocurrencies easily on Boundless Exchange.
            </p>
            {!currentAccount && (
              <button
                type="button"
                onClick={connectWallet}
                className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
              >
                <p className="text-white text-base font-semibold">Connect Wallet</p>
              </button>
            )}
            
            <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
              <div className={`rounded-tl-2xl ${companyCommonStyles}`}>
                Reliability
              </div>
              <div className={companyCommonStyles}>Security</div>
              <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>
                Boundless
              </div>
              <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>
                Web 3.0
              </div>
              <div className={companyCommonStyles}>Low Fees</div>
              <div className={`rounded-br-2xl ${companyCommonStyles}`}>
                Blockchain
              </div>
              
            </div>
          </div>
          
          <div className="flex flex-col flex-1 items-center justify-start w-full md:mt-0 mt-10">
            <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism ">
              <div className="flex justify-between flex-col w-full h-full">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                    <SiEthereum fontSize={21} color="#fff" />
                  </div>
                  <BsInfoCircle fontSize={17} color="#fff" />
                </div>
                <div>
                  <p className="text-white font-light text-sm">
                    {shortenAddress(currentAccount)}
                  </p>
                  <p className="text-white font-semibold text-lg mt-1">
                    Ethereum
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
              <Input placeholder="Address To" name="addressTo" type="text" handleChange={handleChange} />
              <Input placeholder="Amount (ETH)" name="amount" type="number" handleChange={handleChange} />
              <Input placeholder="Keyword (Gif)" name="keyword" type="text" handleChange={handleChange} />
              <Input placeholder="Enter Message" name="message" type="text" handleChange={handleChange} />
              
              <div className="h-[1px] w-full bg-gray-400 my-2" />
              
              {isLoading
              ? <Loader />
              : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                >
                  Send now
                </button>
              )}

              
              
            </div>
            
          </div>
        </div>
      </div>
    );
}

export default Welcome;
import React, { useContext } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

import { TransactionContext } from "../context/TransactionContext";
import { Loader } from "./";
import { shortenAddress } from '../utils/shortenAddress'; 

const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);


const Welcome = () => {

    const { currentAccount, connectWallet, handleChange, sendTransaction, formData, isLoading } = useContext(TransactionContext);

   
    const handleSubmit = (e) => {
      const { addressTo, amount, keyword, message } = formData;

      e.preventDefault();

      if (!addressTo || !amount || !keyword || !message) return;

      sendTransaction();
    
    }

    return (
      <div className="flex w-full justify-center items-center">
        <div className="flex md:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
          <div className="flex flex-1 justify-start items-start flex-col md:mr-10">
            <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
              Send Crypto <br /> across the world
            </h1>
            <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
              Explore the crypto world. Buy and sell cryptocurrencies easily on Boundless Exchange.
            </p>
            {!currentAccount && (
              <button
                type="button"
                onClick={connectWallet}
                className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
              >
                <p className="text-white text-base font-semibold">Connect Wallet</p>
              </button>
            )}
            
            <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
              <div className={`rounded-tl-2xl ${companyCommonStyles}`}>
                Reliability
              </div>
              <div className={companyCommonStyles}>Security</div>
              <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>
                Boundless
              </div>
              <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>
                Web 3.0
              </div>
              <div className={companyCommonStyles}>Low Fees</div>
              <div className={`rounded-br-2xl ${companyCommonStyles}`}>
                Blockchain
              </div>
              
            </div>
          </div>
          
          <div className="flex flex-col flex-1 items-center justify-start w-full md:mt-0 mt-10">
            <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism ">
              <div className="flex justify-between flex-col w-full h-full">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                    <SiEthereum fontSize={21} color="#fff" />
                  </div>
                  <BsInfoCircle fontSize={17} color="#fff" />
                </div>
                <div>
                  <p className="text-white font-light text-sm">
                    {shortenAddress(currentAccount)}
                  </p>
                  <p className="text-white font-semibold text-lg mt-1">
                    Ethereum
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
              <Input placeholder="Address To" name="addressTo" type="text" handleChange={handleChange} />
              <Input placeholder="Amount (ETH)" name="amount" type="number" handleChange={handleChange} />
              <Input placeholder="Keyword (Gif)" name="keyword" type="text" handleChange={handleChange} />
              <Input placeholder="Enter Message" name="message" type="text" handleChange={handleChange} />
              
              <div className="h-[1px] w-full bg-gray-400 my-2" />
              
              {isLoading
              ? <Loader />
              : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                >
                  Send now
                </button>
              )}

              
              
            </div>
            
          </div>
        </div>
      </div>
    );
}

export default Welcome;





 */






































/**     connecting wallet to MM

import React, { useContext } from "react";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { TransactionContext } from "../context/TransactionContext";


const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";



const Welcome = () => {
  

    const { connectWallet, currentAccount } = useContext(TransactionContext);

    

    return (
      <div className="flex w-full justify-center items-center">
        <div className="flex md:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
          <div className="flex flex-1 justify-start items-start flex-col md:mr-10">
            <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
              Send Crypto <br /> across the world
            </h1>
            <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
              Explore the crypto world. Buy and sell cryptocurrencies easily on Universal Exchange.
            </p>
            
            {!currentAccount && (
              <button
                type="button"
                onClick={connectWallet}
                className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
              >
                <p className="text-white text-base font-semibold">Connect Wallet</p>
              </button>
            )}
            
            
            
          </div>
          
          <div className="flex flex-col flex-1 items-center justify-start w-full md:mt-0 mt-10">
            <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism ">
              <div className="flex justify-between flex-col w-full h-full">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                    <SiEthereum fontSize={21} color="#fff" />
                  </div>
                  <BsInfoCircle fontSize={17} color="#fff" />
                </div>
                <div>
                  <p className="text-white font-light text-sm">
                    e4r
                  </p>
                  <p className="text-white font-semibold text-lg mt-1">
                    Avalanche 
                  </p>
                </div>
              </div>
            </div>
          
            
          </div>
        </div>
      </div>
    );
}

export default Welcome;

**/
