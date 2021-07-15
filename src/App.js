import { useState } from 'react'
import Eth from 'ethjs'

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
  
  const [provider, setProvider] = useState(null)

  const connectToLedger = () => {
    setError(null)
    setChainId(null)
    setAccount(null)

    const connect = useTestnet ? ledgerConnectTestNet : ledgerConnectMainnet

    connect.connect()
      .then(provider => {
        // const { , address } = response
        const ethjs = new Eth(provider)

        // provider.sendAsync({method: 'eth_accounts' }, (response) => console.log(response))
        // setAccount(address[0])
        ethjs.accounts().then(accounts => setAccount(accounts[0]))
        ethjs.net_version().then(chainId => setChainId(chainId))

        console.log(ethjs)

        setProvider(ethjs)
      })
      .catch(err => setError(err.toString()))
  }

  const signMessage = () => {
    console.log('let us sign')
    console.log(provider)
    // provider.send({ method: 'personal_sign', params: ['Hello World!', account] })
    provider.personal_sign('Hello World', account)
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
      <hr/>
      {provider && (
        <div>
          <button onClick={signMessage}>Sign message</button>
        </div>
      )}
    </div>
  );
}

export default App;
