import { Contract } from '@ethersproject/contracts';
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value){
    try {
      return getAddress(value)
    } catch {
      return false
    }
  }
  
  // shorten the checksummed version of the input address to have 0x + 4 characters at start and end
  export function shortenAddress(address, chars = 4){
    const parsed = isAddress(address)
    if (!parsed) {
      throw Error(`Invalid 'address' parameter '${address}'.`)
    }
    return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
  }

// account is optional
export function getContract(address, ABI, library, account){
    if (!isAddress(address) || address === AddressZero) {
      throw Error(`Invalid 'address' parameter '${address}'.`)
    }
    
    return new library.eth.Contract(ABI, address)
}

export const formatNumber = (value, library) => {
  if(!library) return;

  value = parseFloat(library.utils.fromWei(value, 'ether'));
  value = parseFloat(value.toPrecision());
  return value < 1 ? value.toFixed(2) : value.toFixed(1);
}

