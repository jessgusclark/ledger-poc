import { useState } from 'react'
import './App.css';
import LedgerProvider from './LedgerProvider'

const ledgerConnectTestNet = new LedgerProvider({
  chainId: 31,
  rpcUrl: 'https://public-node.testnet.rsk.co',
  debug: true
})

const ledgerConnectMainnet = new LedgerProvider({
  chainId: 30,
  rpcUrl: 'https://public-node.rsk.co',
  debug: true
})

function App() {
  const [account, setAccount] = useState('')
  const [chainId, setChainId] = useState('')
  const [error, setError] = useState(null)
  const [useTestnet, setUseTestnet] = useState(true)
  
  const [provider, setProvider] = useState(null)
  const [result, setResult] = useState(null)

  const handleError = (err) => {
    console.log(err)
    setError(err.message)
  }

  const connectToLedger = async () => {
    setError(null)
    setChainId(null)
    setAccount(null)
    setResult(null)
    setProvider(null)

    const ledgerConnect = useTestnet ? ledgerConnectTestNet : ledgerConnectMainnet

    ledgerConnect.connect().then(() => {
      ledgerConnect.request({ method: 'eth_accounts' })
        .then(accounts => setAccount(accounts[0]))
        .catch(handleError)
      
      ledgerConnect.request({ method: 'eth_chainId' })
        .then(id => setChainId(id)).catch(handleError)

      setProvider(ledgerConnect)
    }).catch(handleError)
  }

  const signMessage = () => {
    setResult(null)
    provider.request({ method: 'personal_sign', params: ['test', account] })
      .then(res => setResult(res))
      .catch(handleError)
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
          <button onClick={signMessage}>Sign message</button><br/>
        </div>
      )}
      {result && <p><strong>Result:</strong> {result}</p>}
    </div>
  );
}

export default App;
