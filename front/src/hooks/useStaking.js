import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useMemo } from "react"
import { STAKEFACTORY_ABI, STAKEFACTORY_ADDRESS } from "../abis/StakeFactory";
import { STAKETOKEN_ADDRESS } from "../abis/StakeToken";
import { formatNumber } from "../utils";
import { useContract } from "./useContract"


export const useStaking = (account) => {
    
    const contract = useContract(STAKEFACTORY_ADDRESS, STAKEFACTORY_ABI);
    const [totalStaked, setTotalStaked] = React.useState();
    const [rewards, setRewards] = React.useState();
    const [distributed, setDistributed] = React.useState();
    const {library} = useWeb3React();

    const getDistributed = async() => {
        try{
            if(!contract) return;
            else{
                if(account){
                    let distributed = await contract.methods.getRealisedEarnings(account).call();
                    setDistributed(distributed);
                }else{
                    let distributed = await contract.methods.totalRealised().call();
                    setDistributed(distributed);
                }
            }
        }catch(err){
            console.log(err);
        }
    };
            

    const getTotalStaked = async () => {
        let stake;
        if(!contract) return;
        else{
            if(account){
                stake = await contract.methods.getStake(account).call();
            }else{
                stake = await contract.methods.totalStaked().call();
            }
            setTotalStaked(library.utils.fromWei(stake, 'ether'));
            return;
        }         
    };

    const getRewardsToClaim = async () => {
        let rewards;
        if(!contract) return;
        else{
            if(account){
                rewards = await contract.methods.getUnrealisedEarnings(account).call({from: account});
            }else{
                rewards = await contract.methods.getTotalRewards().call();
            }
        }
        setRewards(library.utils.fromWei(rewards, 'ether'));
        return;
    };

    const stake = async (amount) => {
        if (contract && account) {
            amount = library.utils.toWei(amount, 'ether');
            const stake = await contract.methods.stake(amount).send({from: account});
            return stake;
        }
        return;
    }

    const unstake = async (amount) => {
        if (contract && account) {
            amount = library.utils.toWei(amount, 'ether');
            const stake = await contract.methods.unstake(amount).send({from: account});
            return stake;
        }
        return;
    }

    const claimRewards = async () => {
        if (contract && account) {
            await contract.methods.realise().send({from: account});
        }
        return;
    }

    useEffect(() => {
        getTotalStaked();
        getRewardsToClaim();
        getDistributed();
    }, [account, contract, library ]);

    return {
        totalStaked,
        rewards,
        distributed,
        stake,
        unstake,
        claimRewards
    }


}
