import { useState } from 'react'
import Eth from 'ethjs'
import Web3 from 'web3'
import './App.css';
import LedgerConnectProvider from './LedgerConnectProvider'

const ledgerConnect = new LedgerConnectProvider({
  chainId: 31,
  rpcUrl: 'https://public-node.testnet.rsk.co'
})

function App() {
  const [account, setAccount] = useState('')
  const [chainId, setChainId] = useState('')

  const connectToLedger = () => {
    console.log('connecting to ledger...')

    ledgerConnect.connect().then(provider => {
      console.log('the then...')
      console.log('provider', provider)
      console.log('ledger provider:', provider._providers[0])

      /*
      provider._providers[0].getAccounts(res => console.log('accounts:', res))
      const ethQuery = new Eth(provider)
      ethQuery.net_version().then(chainId => setChainId(chainId))
      ethQuery.accounts().then(console.log)
      
      const web3 = new Web3(provider)
      web3.eth.getAccounts().then(console.log)
      */
    })
  }

  return (
    <div className="App">
      <h1>Ledger POC</h1>
      <button onClick={connectToLedger}>Connect to Ledger</button>
      <p>accounts: {account}</p>
      <p>chainId: {chainId}</p>
    </div>
  );
}

export default App;
