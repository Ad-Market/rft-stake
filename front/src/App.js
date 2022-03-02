import React from 'react';
import {ChakraProvider} from '@chakra-ui/react';
import theme from './theme/index';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { DashboardLayout } from './components/Layouts/DashboardLayout';
import Web3 from 'web3';
import { Web3ReactProvider } from '@web3-react/core';
import { Portfolio } from './pages/Portfolio';
import { RewardsTracker } from './pages/RewardsTracker';
import { StakePage } from './pages/StakePage';
import { Presale } from './pages/Presale';
import { Swap } from './pages/Swap';
import { Governance } from './pages/Governance';

function App() {

	function getLibrary(provider){
		return new Web3(provider);
	}

	return (
		<Web3ReactProvider getLibrary={getLibrary}>
			<ChakraProvider theme={theme}>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<></>} />
						<Route path="/app" element={<DashboardLayout />}>
							<Route index element={<Dashboard />} />
							<Route path="stake" element={<StakePage />} />
							<Route path="portfolio" element={<Portfolio />} />
							<Route path="rewards" element={<RewardsTracker />} />
							<Route path="presale" element={<Presale />} />
							<Route path="swap" element={<Swap />} />
							<Route path="governance" element={<Governance />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</ChakraProvider>
		</Web3ReactProvider>
	);
}

export default App;
