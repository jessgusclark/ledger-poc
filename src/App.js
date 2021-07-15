import { useState } from 'react'
import Eth from 'ethjs-query'

import './App.css';
import LedgerConnectProvider from './LedgerConnectProvider'

const ledgerConnectTestNet = new LedgerConnectProvider({
  chainId: 31,
  rpcUrl: 'https://public-node.testnet.rsk.co'
})

const ledgerConnectMainnet = new LedgerConnectProvider({
  chainId: 30,
  rpcUrl: 'https://public-node.rsk.co'
})

function App() {
  const [account, setAccount] = useState('')
  const [chainId, setChainId] = useState('')
  const [error, setError] = useState(null)
  const [useTestnet, setUseTestnet] = useState(true)

  const connectToLedger = () => {
    setError(null)

    const connect = useTestnet ? ledgerConnectTestNet : ledgerConnectMainnet

    connect.connect()
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
      <p>Connect your ledger, open up the <strong>{useTestnet ? 'Ethereum' : 'RSK'}</strong> App, and set <em>Contract data:</em> <strong>Allowed</strong>.</p>
      
      <button onClick={() => setUseTestnet(!useTestnet)}>Network: RSK {useTestnet ? 'Testnet' : 'Mainnet'}</button>
      <button onClick={connectToLedger}>Connect to Ledger</button>
      <p>accounts: {account}</p>
      <p>chainId: {chainId}</p>
      {error && <p><strong>Error: </strong> {error} </p>}
    </div>
  );
}

export default App;
