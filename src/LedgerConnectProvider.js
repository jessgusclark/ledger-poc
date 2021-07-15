import ProviderEngine from "web3-provider-engine";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc'

class LedgerProvider {
  constructor(opts) {
    this.chainId = opts.chainId
    this.rpcUrl = opts.rpcUrl
  }

  connect() {
    return new Promise((resolve, reject) => {
      console.log('calling connect...', this.chainId, this.rpcUrl)
      const engine = new ProviderEngine();
      const getTransport = () => TransportWebUSB.create();
      const ledger = createLedgerSubprovider(getTransport, {
          networkId: 31,
          accountsLength: 1, // get a single account
          // paths: ["44'/60'/x'/0/0", "44'/60'/0'/x"],
      });
      engine.addProvider(ledger);
      engine.addProvider(new RpcSubprovider({ rpcUrl: 'https://public-node.testnet.rsk.co' }));
      engine.start();

      // this will prompt the window to connect:
      ledger.getAccounts((error, response) => {
        return error ? reject(error) : resolve(engine)
      })
    })
  }
}

export default LedgerProvider
