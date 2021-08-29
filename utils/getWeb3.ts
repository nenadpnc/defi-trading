import Web3 from 'web3'

const getWeb3 = () => {
  // using local ganache node
  const localProvider = `http://localhost:8545`
  let web3;
  if (typeof window !== 'undefined' && (window as any).web3 !== 'undefined') {
    web3 = (window as any).web3
  }

  if (web3) {
    web3 = new Web3(web3.currentProvider)
  } else {
    const provider = new Web3.providers.HttpProvider(localProvider)
    web3 = new Web3(provider)
  }

  return web3 as Web3;
}

export default getWeb3;
