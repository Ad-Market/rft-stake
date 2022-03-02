import React, { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { getContract } from "../utils";

export const useContract = (contractAddress, ABI, withSigner = true) => {

    const {library, chainId, account} = useWeb3React();

    return useMemo(() => {
        if (!contractAddress || !ABI || !library || !chainId) return null
        let address;
        if (typeof contractAddress === 'string') address = contractAddress
        else address = address[chainId]
        if (!address) return null
        try {
          return getContract(address, ABI, library, withSigner && account ? account : undefined)
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [contractAddress, ABI, library, chainId, withSigner, account])

}