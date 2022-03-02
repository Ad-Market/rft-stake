import React from "react";
import { Box, chakra, Flex, IconButton, Text } from "@chakra-ui/react";
import { MdSwapVert, MdDashboard } from "react-icons/md";
import { GiReceiveMoney, GiCrownCoin } from "react-icons/gi";
import { IoIosStats } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { FaGithub, FaTelegramPlane, FaTwitter } from "react-icons/fa";
import { ColorModeSwitcher } from "../ColorMode/ColorModeSwitcher";
import {ReactComponent as Logo} from "../../assets/svg/logo.svg";

const ItemLink = chakra(NavLink);

const Item = ({icon, title, to}) => {
    
    return (
        <ItemLink _activeLink={{'>div': {opacity: 1, fontWeight: 900}}} to={to} _hover={{'>div': {opacity: 1}, cursor: "pointer"}} display={"flex"} alignItems="center" justifyContent="start" gap={4}>
            {icon}
            <Box _hover={{opacity: 1, cursor: "pointer"}} fontWeight="600" opacity={0.8} fontSize="17">{title}</Box>
        </ItemLink>
    )
}

export const Sidebar = () => { 

    return (
        <Flex direction={"column"} justifyContent="space-between" height={"100%"} px={'8'} py={"16"} borderRight={"2px solid"} borderColor={"rgba(255, 255, 255, 0.15)"}>
            <Flex flexDir={"column"} height={"100%"} gap={7}>
                <Item to="/app/" icon={<MdDashboard color="#7993ff" size={18} />} title={"Dashboard"} />
                <Item to="/app/swap" icon={<MdSwapVert color="#7993ff" size={18} />} title={"Swap"} />
                <Item to="/app/stake" icon={<GiReceiveMoney color="#7993ff" size={18} />} title={"Staking"} />
                <Item to="/app/rewards" icon={<IoIosStats color="#7993ff" size={18} />} title={"Track"} />
                <Item to="/app/governance" icon={<GiCrownCoin color="#7993ff" size={20} />} title={"Governance"} />
                <Item to="/app/presale" icon={<GiCrownCoin color="#7993ff" size={20} />} title={"Presale"} />
            </Flex>
            <Box>
                <Flex align="center" mt={7}>
                    <ColorModeSwitcher size="md" fontSize="lg" minW="0" minH="0"/>       
                    <IconButton size="md" fontSize="lg" minW="0" minH="0" variant="ghost" ml="5">
                        <FaTelegramPlane color="#7993ff" size={18} />
                    </IconButton>
                    <IconButton size="md" fontSize="lg"  minW="0" minH="0" variant="ghost" ml="5">
                        <FaTwitter color="#7993ff" size={18} />
                    </IconButton>                             
                </Flex>
                <Flex align="center">
                    <Logo />
                   <Text ml={3}>100$</Text>           
                </Flex>
            </Box>
        </Flex>
    );
}