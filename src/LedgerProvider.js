import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import Eth from "@ledgerhq/hw-app-eth";

class LedgerProvider {
  constructor(opts) {
    console.log('🦄 constructor', opts)
    this.chainId = opts.chainId
    this.rpcUrl = opts.rpcUrl
    this.isLedger = true
    this.selectedAddress = null
    this.eth = null

    // is the ledger using the Ethereum app or the RSK app:
    this.path = opts.chainId === 30 ? "44'/137'/0'/0/0" : "44'/60'/0'/0/0"
  }

  connect() {
    console.log('🦄 connect')
    return new Promise((resolve, reject) => {
      TransportWebUSB.create()
        .then(transport => {
          this.eth = new Eth(transport)
          console.log('🦄 eth!', this.eth)
          // this command here will prompt to connect to the ledger:
          this.eth.getAddress(this.path)
            .then(result => this.selectedAddress = result.address)
            .catch(err => reject(err))

          resolve(true)
        })
        .catch(err => {
          console.log('boo!', err)
          reject(err)
        })
    })
  }

  request(request) {
    const { method, params } = request
    console.log('🦄 request', request)

    switch(method) {
      case 'eth_accounts':
        return new Promise((resolve, reject) =>
          this.eth.getAddress(this.path)
            .then(result => resolve([result.address])).catch(err => reject(err)))

      case 'eth_chainId':
      case 'net_version':
        return Promise.resolve(this.chainId)

      // reference: https://github.com/LedgerHQ/ledgerjs/tree/master/packages/hw-app-eth#signpersonalmessage
      case 'personal_sign':
        return this.eth.signPersonalMessage(this.path, Buffer.from(params[0]).toString("hex"))
          .then(result => {
            let v = (result['v'] - 27).toString(16);
            if (v.length < 2) {
              v = "0" + v;
            }
            return `${result['r']}${result['s']}${v}`
          })
      
      default:
        throw(new Error(`The method '${method}' is not supported.`))
    }
  }
}

export default LedgerProvider
