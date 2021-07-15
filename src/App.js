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
  const [error, setError] = useState(null)

  const connectToLedger = () => {
    setError(null)

    ledgerConnect.connect()
      .then(response => {
        const { provider, address } = response
        const ethQuery = new Eth(provider)

        setAccount(address[0])
        ethQuery.net_version().then(chainId => setChainId(chainId))
      })
      .catch(err => setError(err.toString()))
  }

  return (
    <div className="App">
      <h1>Ledger POC</h1>
      <p>Connect your ledger, open up the <strong>Ethereum</strong> App, and set <em>Contract data:</em> <strong>Allowed</strong>.</p>
      <button onClick={connectToLedger}>Connect to Ledger</button>
      <p>accounts: {account}</p>
      <p>chainId: {chainId}</p>
      {error && <p><strong>Error: </strong> {error} </p>}
    </div>
  );
}

export default App;
