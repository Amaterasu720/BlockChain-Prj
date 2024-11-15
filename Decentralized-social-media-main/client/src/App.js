// Import necessary components and libraries
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import Widgets from "./Widgets";
import "./App.css";
import { useState, useEffect } from "react";
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Create a context for managing color mode (light/dark theme)
const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {
  // Use theme and color mode context from Material-UI
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  // State to store the current Ethereum account
  const [currentAccount, setCurrentAccount] = useState('');
  // State to track if the user is connected to the correct network
  const [correctNetwork, setCorrectNetwork] = useState(false);

  // Function to connect the user's wallet via MetaMask
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Metamask not detected');
        return;
      }

      // Get the chain ID of the connected network
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log('Connected to chain:' + chainId);

      // Check if the chain ID matches Sepolia Testnet
      const sepoliaChainId = '0xaa36a7';
      if (chainId !== sepoliaChainId) {
        alert('You are not connected to the Sepolia Testnet!');
        return;
      }

      // Request account access and update state with the first account
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Found account', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log('Error connecting to Metamask', error);
    }
  };

  // Function to verify if the user is on the correct network
  const checkCorrectNetwork = async () => {
    const { ethereum } = window;
    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log('Connected to chain:' + chainId);

    const sepoliaChainId = '0xaa36a7';
    if (chainId !== sepoliaChainId) {
      setCorrectNetwork(false);
    } else {
      setCorrectNetwork(true);
    }
  };

  // Lifecycle hook to connect wallet and check network on component mount
  useEffect(() => {
    connectWallet();
    checkCorrectNetwork();
  });

  return (
    <>
      {/* Wrapper Box with theme styling */}
      <Box
        sx={{
          width: '100%',
          alignItems: 'center',
          bgcolor: 'background.default',
          color: 'text.primary',
          borderRadius: 1,
          p: 3,
        }}
      >
        {/* Theme toggle button */}
        <div sx={{ display: 'flex', justifyContent: 'center', position: 'absolute', top: 0 }}>
          {theme.palette.mode} mode
          <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </div>

        {/* Main application content */}
        <div>
          {currentAccount === '' ? (
            // Show "Connect Wallet" button if no account is connected
            <button
              className='connect_button'
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          ) : correctNetwork ? (
            // Render the app components if connected to the correct network
            <div className="app">
              <Sidebar />
              <Feed />
              <Widgets />
            </div>
          ) : (
            // Show prompt if the user is on the wrong network
            <div className='prompt'>
              <div>----------------------------------------</div>
              <div>Please connect to the Sepolia Testnet</div>
              <div>and reload the page</div>
              <div>----------------------------------------</div>
            </div>
          )}
        </div>
      </Box>
    </>
  );
}

// Main function wrapping the app with color mode context and theme provider
export default function ToggleColorMode() {
  const [mode, setMode] = React.useState('light');

  // Memoized toggle function for light/dark mode
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  // Memoized Material-UI theme configuration
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
