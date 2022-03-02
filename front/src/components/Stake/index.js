import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import {BackButton, Card, CardHeader, HelpButton} from "../Card/index";
import { MdHelpOutline } from "react-icons/md";
import { InitialContent, StakeContent, UnstakeContent } from "./views";

export const Stake = () => {  

    const navigation = {
        stake: {
            title: "Stake",
            iconLeft: <BackButton onClick={() => resetNavigation()} />,
            element: <StakeContent />
        },
        unstake: {
            title: "Unstake",
            iconLeft: <BackButton onClick={() => resetNavigation()} />,
            element: <UnstakeContent />
        },
        initial: {
            title: "RFT - BNB POOL",
            iconLeft: '',
            element: <InitialContent navigate={(e) => navigate(e)} /> 
        }
    }

    const [navigationState, setNavigationState] = React.useState(navigation.initial);

    const resetNavigation = () => setNavigationState(navigation.initial);

    const navigate = (e) => {
        if(e === 'stake') {
            setNavigationState(navigation.stake);
        }
        else if(e === 'unstake') {
            setNavigationState(navigation.unstake);
        }        
    }

     return (
        <Card width={'100%'} borderColor={'border.card'} justifySelf="center" h={'100%'} header={<CardHeader titleAlign={'center'} iconLeft={navigationState.iconLeft} iconRight={<HelpButton />} title={navigationState.title} />}>
            <Flex flexDirection={"column"} h={'100%'}>
                <Box px={5} mt={10}>
                    {navigationState.element}  
                </Box>
            </Flex>
        </Card>
     )
}