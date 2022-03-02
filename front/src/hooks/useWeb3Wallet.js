import React, {useEffect} from 'react';
import { useWeb3React } from "@web3-react/core"
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import {useMoralisWeb3Api} from 'react-moralis';

export const useWeb3Wallet = () => {
    
    const {active, account, activate, deactivate, connector } = useWeb3React();
    
    const walletConnect = new WalletConnectConnector({
        rpc: {56: 'https://bsc-dataseed.binance.org/'},
        qrcode: true
    });

    const injected = new InjectedConnector({
        supportedChainIds: [1, 3, 4, 5, 42, 56, 97, 1337],
        rpc: {97: 'https://data-seed-prebsc-1-s1.binance.org:8545/', 1337: 'http://localhost:8545/'}
    })

    useEffect(() => {
        injected.isAuthorized().then(async(isAuthorized) => {
            if (isAuthorized) {
                setTimeout(() => activate(injected), 1);
            }
        })  
    }, []);

    const resetWalletConnector = () => {
        if (
            walletConnect &&
            walletConnect instanceof WalletConnectConnector &&
            walletConnect.walletConnectProvider?.wc?.uri
          ) {
            walletConnect.walletConnectProvider = undefined
          }
    }

    const connect = async(type) => {
        if(type === "walletconnect"){
            await activate(walletConnect)
            .catch(() => {
                resetWalletConnector();
            });
        }else if(type === "injected"){
            await activate(injected)
        }

    };

    const disconnect = async() => {
        try {
            deactivate()
        }catch(error){
            console.log(error)
        }
    }

    return {
        connect,
        disconnect,
        account,
        active,
    }
}

export const useActiveTokens = (chain) => {

    const {account, active} = useWeb3Wallet();
    const { account: moralis } = useMoralisWeb3Api();

    const [tokens, setTokens] = React.useState([]);

    const getActiveTokens = async() => {
        const options = { chain: chain, address: account };
        const tokens = await moralis.getTokenBalances(options);
        setTokens(tokens);
    }

    useEffect(() => {
        if(account && active){
            getActiveTokens();
        }
    }, [account, active])


    return {tokens}

}

export const useTransactions = (chain) => {

    const {account, active} = useWeb3Wallet();
    const [transactions, setTxs] = React.useState([]);
    const [tokensTxs, setTokensTxs] = React.useState([]);
    const {account: Moralis} = useMoralisWeb3Api();
    const {connector} = useWeb3React();

    const getAllTransactions = async() => {
        const chainId = await connector.getChainId();
        console.log(chainId)
        const options = { chain: chainId, address: account, order: "desc", from_block: "0" };
        const transactions = await Moralis.getTransactions(options);
        setTxs(transactions);
    }

    const getTokenTransactions = async() => {
        const chainId = await connector.getChainId();
        const options = { chain: chainId, address: account, order: "desc", from_block: "0"};
        const transactions = await Moralis.getTokenTransfers(options);
        setTokensTxs(transactions);
    }

    useEffect(() => {
        if(account && active){
            getTokenTransactions();
            getAllTransactions();
        }
    }, [account, active])
    
    return {
        transactions,
        tokensTxs
    }

}