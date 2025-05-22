// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to donate!');
        return;
    }

    // Connect Wallet Button
    document.getElementById('connectWallet')?.addEventListener('click', connectWallet);
    
    // Donate Button
    document.getElementById('donateButton')?.addEventListener('click', handleDonation);
});

let web3;
let accounts = [];

async function connectWallet() {
    try {
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        web3 = new Web3(window.ethereum);
        updateWalletDisplay();
    } catch (error) {
        console.error('Wallet connection error:', error);
        alert('Failed to connect wallet: ' + error.message);
    }
}

function updateWalletDisplay() {
    const walletDisplay = document.getElementById('walletAddress');
    if (walletDisplay && accounts.length > 0) {
        const shortAddress = `${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
        walletDisplay.textContent = shortAddress;
    }
}

async function handleDonation() {
    const donateBtn = document.getElementById('donateButton');
    try {
        if (!accounts.length) {
            alert('Please connect your wallet first!');
            return;
        }

        const amount = document.getElementById('donationAmount').value;
        if (!amount || isNaN(amount)) {
            alert('Please enter a valid ETH amount');
            return;
        }

        donateBtn.disabled = true;
        donateBtn.textContent = 'Processing...';

        // REPLACE THIS WITH YOUR ACTUAL CHARITY WALLET ADDRESS
        const charityAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
        const amountInWei = web3.utils.toWei(amount, 'ether');

        const tx = await web3.eth.sendTransaction({
            from: accounts[0],
            to: charityAddress,
            value: amountInWei
        });

        alert(`Thank you for donating ${amount} ETH!\nTX Hash: ${tx.transactionHash}`);
        document.getElementById('donationAmount').value = '';
        
    } catch (error) {
        console.error('Donation error:', error);
        alert(`Donation failed: ${error.message}`);
    } finally {
        if (donateBtn) {
            donateBtn.disabled = false;
            donateBtn.textContent = 'Donate Now';
        }
    }
}