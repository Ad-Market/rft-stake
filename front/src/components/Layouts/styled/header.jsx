import React from "react";
import { chakra, Flex } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';
import { Heading, Box } from '@chakra-ui/react';
import {ReactComponent as Logo} from "../../../assets/svg/logo.svg";

export const HeaderWrapper = chakra('header', {
    baseStyle : {
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 6,
        bg: 'white',
    }
});

export const LogoWrapper = ({name}) => (
    <Flex alignItems={'center'} gap={3}>
        <Logo />
        <Heading display={["none", "", "block"]} as="h1" size="md" textTransform={"uppercase"} fontFamily={'Archivo'}>
            {name}
        </Heading>
    </Flex>
)