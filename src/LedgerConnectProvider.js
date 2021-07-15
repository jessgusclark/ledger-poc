import ProviderEngine from "web3-provider-engine";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc'
import HookedWalletSubprovider from "web3-provider-engine/subproviders/hooked-wallet";

class LedgerProvider {
  constructor(opts) {
    this.chainId = opts.chainId
    this.rpcUrl = opts.rpcUrl
    
    // is the ledger using the Ethereum app or the RSK app:
    this.paths = opts.chainId === 30 ? ["44'/137'/x'/0/0"] : ["44'/60'/x'/0/0"]
  }

  connect() {
    return new Promise((resolve, reject) => {
      console.log('calling connect...', this.chainId, this.rpcUrl)
      const engine = new ProviderEngine();
      const getTransport = () => TransportWebUSB.create();
      const ledger = createLedgerSubprovider(getTransport, {
          networkId: this.chainId,
          accountsLength: 1, // get a single account
          paths: this.paths,
      });
      engine.addProvider(new HookedWalletSubprovider(ledger));
      engine.addProvider(new RpcSubprovider({ rpcUrl: this.rpcUrl }));
      engine.start();

      resolve(engine)
      /*
      // this will prompt the window to connect:
      ledger.getAccounts((error, response) => {
        return error ? reject(error) : resolve({ address: response, provider: engine })
      })
      */
     
    })
  }
}

export default LedgerProvider
