import { useWeb3React } from "@web3-react/core";
import React, { useEffect } from "react";
import { ERC20 } from "../abis/ERC20";
import { STAKETOKEN_ABI } from "../abis/StakeToken";
import {STAKEFACTORY_ADDRESS} from "../abis/StakeFactory";
import { formatNumber } from "../utils";
import { useContract } from "./useContract";

export const useERC20 = (contractAddress) => {

    const contract = useContract(contractAddress, STAKETOKEN_ABI);
    const {account, library} = useWeb3React();
    const [state, setState] = React.useState({name: "", symbol: '', balance: ""});
    let max_int = '9007199254740991000000000000';

    const approve = async (spender) => {
        try{
            if(!contract) return;
            else{
                if(account){
                    contract.methods.approve(spender, library.utils.toWei(max_int, 'ether')).send({from: account});
                }
            }
        }catch(err){
            console.log(err);
        }
    };

    const getTokenName = async() => {
        try{
            let name = await contract.methods.name().call();
            setState((prevState) => ({...prevState, name}));
        }
        catch(err){
            console.log(err);
        }
    }

    const getTokenSymbol = async() => {
        try{
            let symbol = await contract.methods.symbol().call();
            setState((prevState) => ({...prevState, symbol}));
        }catch(err){
            console.log(err);
        }
    }

    const getBalance = async() => {
        try{
            let balance = await contract.methods.balanceOf(account).call();
            balance = formatNumber(balance, library);
            setState((prevState) => ({...prevState, balance}));
        }catch(err){
            console.log(err)
        }
    }

    const getStakingContractBalance = async() => {
        try{
            let balance = await contract.methods.balanceOf(STAKEFACTORY_ADDRESS).call();
            console.log(balance);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        getTokenName();
        getTokenSymbol();
        getBalance();
        getStakingContractBalance();
        // setRouter();
    }, [account, contract, library, contractAddress]);


    return {
        ...state,
        approve
    }

}