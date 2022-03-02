import { Flex, Box, Grid } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export const DashboardLayout = () => {
    return(
        <Box overflow={'hidden'}>
            <Header />
            <Flex justifyContent={"flex-start"}>
                <Box h='calc(100vh - 80px)' shadow="lg" d={['none', null, null, 'block']} flex={'1 0 16rem'}>
                    <Sidebar />
                </Box>
                <Box overflowY={"scroll"} width="100%" px={5} py={8}>
                    <Outlet />
                </Box>
            </Flex>
        </Box>
    )
}