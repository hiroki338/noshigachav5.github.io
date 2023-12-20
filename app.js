// deployed contract address
const contractAddress = '0xe8961dfe3240d3671dbf765faa9d5ba0ecfa3464'; 
// ABI from remix
const contractABI = [

];


let walletAddress = null;
let provider = null;
let signer = null;
let contract = null;
// const decimal= 10**18;

async function connectWallet() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            walletAddress = (await window.ethereum.request({ method: 'eth_accounts' }))[0];
            document.getElementById('connectWallet').innerText = 'Connected';
            if (accounts && accounts.length > 0) {
                const truncatedAddress = `${accounts[0].slice(0, 5)}...${accounts[0].slice(-5)}`;
                document.getElementById('connectWallet').innerText = `Connected (${truncatedAddress})`;
                document.getElementById('connectWallet').disabled = true;
            }
            //provider = new ethers.providers.Web3Provider(window.ethereum);
            provider = new ethers.getDefaultProvider(network)
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            console.log('Wallet Connected');
            console.log("First 5 characters:", accounts[0].slice(0, 5));
            console.log("Last 5 characters:", accounts[0].slice(-5));
        } 
        catch (error) {
            console.error(error);
            document.getElementById('connectWallet').innerText = 'Wallet Connection Failed';
        }
    } else {
        alert('MetaMask extension not detected. Please install MetaMask and try again.');
    }
}

//function to use enter() function
async function toenter() {
    contract.enter();
    const tx = signer.sendTransaction({
        to: "0xE5Dc013d8002Cf9c2c8921D3c15Ab8B48013b42E",
        value: ethers.utils.par,
    
    });

      alert("You enter Lottery. Good Luck!");
}

// Function to check if the current user is the owner or manager
async function isOwnerOrManager() {
    try {
        // Get the owner and manager addresses from the contract
        const owner = await contract.Owner();
        const manager = await contract.manager();

        // Compare the owner and manager addresses with the current user's address
        return walletAddress === owner || walletAddress === manager;
    } catch (error) {
        console.error('Error checking if user is owner or manager:', error);
        return false;
    }
}

// Function to pick the winner and display winner information
async function pickWinner() {
    try {
        // Check if the wallet is connected
        if (walletAddress) {
            // Check if the current user is the owner or manager
            const isOwnerOrManager = await isOwnerOrManager();

            if (isOwnerOrManager) {
                // Continue with the existing logic to pick the winner and display information
                const tx = await contract.pickWinner({ from: walletAddress });
                await tx.wait();
                console.log('Winner picked');

                const [winner, winnings] = await contract.getWinnerInfo();
                document.getElementById('winner').innerText = `Winner Address: ${winner}`;
                document.getElementById('winnings').innerText = `Winnings: ${ethers.utils.formatEther(winnings)} ETH`;
            } else {
                alert('You are not authorized to pick the winner.');
            }
        } else {
            alert('Wallet not connected. Please connect your wallet.');
        }
    } catch (error) {
        console.error('Error picking winner:', error);
    }
}

// Example event listener for the "Pick Winner" button
document.getElementById('pickWinner').addEventListener('click', getWinnerInfo);



//function to use pickWinner() function
async function pickWinner() {
    try {       
        if (walletAddress) {
            // Call the "pickWinner" function on your contract
            const isOwnerOrManager = await isOwnerOrManager();
        if (isOwnerOrManager) {    
            const tx = await contract.pickWinner({ from: contractAddress });
            await tx.wait();
            console.log('Winner picked');
        } else {
            alert('Wallet not connected. Please connect your wallet.');
        }
        } catch (error) {
        console.error('ERROR picking winner:', error);
    }
}
}


// Function to pick the winner
async function getWinner() {
    try {
        // Call the getWinnerInfo function from the contract
        const [winner, winnings] = await contract.getWinnerInfo();

        // Display winner information on the HTML page
        document.getElementById('winner').innerText = `Winner Address: ${winner}`;
        document.getElementById('winnings').innerText = `Winnings: ${ethers.utils.formatEther(winnings)} ETH`;
    } catch (error) {
        console.error('Error picking winner:', error.message);
    }
}


//function to show players with getParticipants function call
async function getshowparticipants(){
try{
displayPlayers = await contract.getParticipants();
document.getElementById('participantsList').innerText = displayPlayers;
console.log('Get Participants SUCCESS');
}
catch(error){
    console.error('ERROR Getting Participants', error);
}
}