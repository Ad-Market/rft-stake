import React from  'react';
import { HeaderWrapper, LogoWrapper } from './styled/header';
import {ColorModeSwitcher} from '../ColorMode/ColorModeSwitcher';
import { Button, chakra, Flex, Portal, useColorModeValue } from '@chakra-ui/react';
import { useWeb3Wallet } from '../../hooks/useWeb3Wallet';
import { useDisclosure } from '@chakra-ui/react';
import { Modal } from '../Modal';
import { useNavigate } from "react-router-dom"

export const Header = ({}) => {

    const {isOpen, onToggle } = useDisclosure();
    const {active, account, connect} = useWeb3Wallet();

    return (
        <chakra.header shadow={'lg'} h='80px' d='flex' alignItems='center' justifyContent='space-between' px={[4, 6]} borderBottom={'solid 2px'} borderColor={useColorModeValue('rgba(255,255,255, 1)', 'rgba(255,255,255,0.15)')}>
            <LogoWrapper name={"Reflecty"} />
            <Flex alignItems={'center'} gap={3}>
                <Button variant={"outline"} size="md">
                
                  BSC
                </Button>
                <Button onClick={() => connect("injected")} variant={"outline"} size="md">
                    {!account && !active ? 'Connect wallet' : 'Disconnect' }
                </Button>
            </Flex>
            <Portal>
                <Modal isOpen={isOpen} onToggle={onToggle}  />
            </Portal>
        </chakra.header>
    )
}