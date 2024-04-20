// src/App.js
import { useState } from 'react';
import Web3 from 'web3';
import VendingMachineContract from './contract/VendingMachine.json'; // Import the JSON file of your contract

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.requestAccounts();
        setAccounts(accounts);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = VendingMachineContract.networks[networkId];
        const instance = new web3Instance.eth.Contract(
          VendingMachineContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(instance);

        const balance = await instance.methods.getVendingMachineBalance().call();
        setBalance(balance);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Web3 not found');
    }
  };

  const restockVendingMachine = async () => {
    try {
      await contract.methods.restock(100).send({ from: accounts[0] });
      const balance = await contract.methods.getVendingMachineBalance().call();
      setBalance(balance);
    } catch (error) {
      console.error(error);
    }
  };

  const purchaseDonuts = async () => {
    try {
      await contract.methods.purchase(1).send({ from: accounts[0], value: web3.utils.toWei('2', 'ether') });
      const balance = await contract.methods.getVendingMachineBalance().call();
      setBalance(balance);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Vending Machine App</h1>
      {web3 ? (
        <div>
          <p>Connected: {accounts[0]}</p>
          <p>Vending Machine Balance: {balance}</p>
          <button onClick={restockVendingMachine}>Restock Vending Machine</button>
          <button onClick={purchaseDonuts}>Purchase Donuts</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

export default App;
