import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { useRef, useState, useEffect } from "react";
import { useWallet, InputTransactionData } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { DVOTING } from "./constants";
import './index.css';

// with custom configuration
const endpoint = 'https://aptos.devnet.m1.movementlabs.xyz';
const aptosConfig = new AptosConfig({ 
  fullnode: endpoint,
  faucet: 'https://faucet.movementlabs.xyz' 
});
const aptos = new Aptos(aptosConfig);

function App() {
  const { signAndSubmitTransaction, account } = useWallet();
  const name = useRef<HTMLInputElement>(null);
  const bio = useRef<HTMLTextAreaElement>(null);

  const [accountHasBio, setAccountHasBio] = useState(false);
  const [currentName, setCurrentName] = useState([]);
  const [currentBio, setCurrentBio] = useState(null);

  const fetchBio = async () => {
    if (!account) {
      console.log("No account")
      return [];
    }
  
    try {
      const candidateList = await aptos.getAccountResource(
        {
          accountAddress:account?.address,
          resourceType:`${DVOTING}::Voting1::CandidateList`
        }
      );
      console.log("Candidate List", candidateList.c_list, "Winner:", candidateList.winner);
      setAccountHasBio(true);
      if (candidateList) {
        setCurrentName(candidateList.cadnidate_list);
        setCurrentBio(candidateList.winner);
      } else {
        console.log("no bio")
      }
    } catch (e: any) {
      setAccountHasBio(false);
    }
  };

  async function initializeVote() {
      const transaction: InputTransactionData = {
        data: {
          function:`${DVOTING}::Voting1::initialize_with_candidate`,
          functionArguments:["0x2fb80d5bdeb1c2ae6d339d2f526916c6109d0ad1d8acdab018e2441ce80b6b89"]
        }
      }
      try {
        // sign and submit transaction to chain
        const response = await signAndSubmitTransaction(transaction);
        // wait for transaction
        console.log(`Success! View your transaction at https://explorer.aptoslabs.com/txn/${response.hash}`)
        await aptos.waitForTransaction({transactionHash:response.hash});
        fetchBio();
      } catch (error: any) {
        console.log("Error:", error)
      }
  }

  async function addCandidate() {
    const transaction: InputTransactionData = {
      data: {
        function:`${DVOTING}::Voting1::add_candidate`,
        functionArguments:["0xf57759cb6b0522dc4f8f60d9934fab3a98dae9ffadab79a0f5934ee3469f465f"]
      }
    }
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(transaction);
      // wait for transaction
      console.log(`Success! View your transaction at https://explorer.aptoslabs.com/txn/${response.hash}`)
      await aptos.waitForTransaction({transactionHash:response.hash});
      fetchBio();
    } catch (error: any) {
      console.log("Error:", error)
    }
  }

  async function vote() {
    const transaction: InputTransactionData = {
      data: {
        function:`${DVOTING}::Voting1::vote`,
        functionArguments:["0xf57759cb6b0522dc4f8f60d9934fab3a98dae9ffadab79a0f5934ee3469f465f", "0xb118a531aa5efb194f5e322aeee8e9d1e98c6220936d1cee90e1480911d51d64"]
      }
    }
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(transaction);
      // wait for transaction
      console.log(`Success! View your transaction at https://explorer.aptoslabs.com/txn/${response.hash}`)
      await aptos.waitForTransaction({transactionHash:response.hash});
      fetchBio();
    } catch (error: any) {
      console.log("Error:", error)
    }
  }

  async function declare_winner() {
    const transaction: InputTransactionData = {
      data: {
        function:`${DVOTING}::Voting1::declare_winner`,
        functionArguments:[]
      }
    }
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(transaction);
      // wait for transaction
      console.log(`Success! View your transaction at https://explorer.aptoslabs.com/txn/${response.hash}`)
      await aptos.waitForTransaction({transactionHash:response.hash});
      fetchBio();
    } catch (error: any) {
      console.log("Error:", error)
    }
  }

  return (
    <>
      <div className="navbar">
        <div className="navbar-text">Your Voting dApp</div>
        <div>
          <WalletSelector />
        </div>
      </div>
      <div className="center-container">
        
        <div className="row">
          <h1>Your Voting dApp</h1>
        </div>

        <div className="row">
          <button onClick={initializeVote}>Initialize Vote</button>
        </div>

        <div className="row">
          <button onClick={addCandidate}>Add Candidate</button>
        </div>

        <div className="row">
          <button onClick={vote}>Vote</button>
        </div>

        <div className="row">
          <button onClick={declare_winner}>Declare Winner</button>
        </div>

        <div className="row">
          <center>
            <h3>Candidates:</h3>
              <ul>
                {currentName?.map((name: string, index: number) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
              <h3>Winner:</h3>
              <p>{currentBio}</p>
          </center>
        </div>

      </div>
    </>
  );
}

export default App;
