import { useState } from 'react'
import Eth from 'ethjs-query'

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
    ledgerConnect.connect().then(provider => {
      const ethQuery = new Eth(provider)

      ethQuery.accounts().then(accounts => accounts[0] && setAccount(accounts[0]))
      ethQuery.net_version().then(chainId => setChainId(chainId))
    })
  }

  return (
    <div className="App">
      <h1>Ledger POC</h1>
      <p>Connect your ledger, open up the <strong>Ethereum</strong> App, and set <em>Contract data:</em> <strong>Allowed</strong>.</p>
      <button onClick={connectToLedger}>Connect to Ledger</button>
      <p>accounts: {account}</p>
      <p>chainId: {chainId}</p>
    </div>
  );
}

export default App;
