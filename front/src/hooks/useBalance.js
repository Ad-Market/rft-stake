import React, {useEffect} from "react";
import { useWeb3React } from "@web3-react/core";
import { formatNumber } from "../utils";

export const useNativeBalance = () => {

    const {account, library} = useWeb3React();
    const [nativeBalance, setNativeBalance] = React.useState('');
    
    const getNativeBalance = async() => {
        if(!account || !library) return;

        library.eth.getBalance(account, (error, result) => {
            if(error) return;
            setNativeBalance(parseFloat(library.utils.fromWei(result, 'ether')).toFixed(4));
        })
    };

    useEffect(() => {
        getNativeBalance();
    }, [account, library]);

    return nativeBalance

}