let web3;
let CANBalance = 0;

const contractAbi = [];
const contractAddress = 'YOUR_CONTRACT_ADDRESS';

const contract = new web3.eth.Contract(contractAbi, contractAddress);

async function initWeb3() 
{
    if(window.ethereum) 
    {
        web3 = new Web3(window.ethereum);
    try 
    {
        await window.ethereum.enable();
    } catch(error) 
    {
        console.error("User denied account access");
    }
    }  
    else if(window.web3) 
    {
        web3 = new Web3(window.web3.currentProvider);
    } 
    else 
    {
        alert('MetaMask not detected. Please install MetaMask to use this feature.');
    }
}

async function getUserAddress() 
{
  try 
  {
    if(!web3) 
    {
        await initWeb3();
    }
        const accounts = await web3.eth.getAccounts();
        return accounts[0] || null;
  } catch(error) 
    {
        console.error("Error retrieving user's Ethereum address", error);
        return null;
    }
}

async function getCANBalance(userAddress) 
{
    try 
    {
        if(!web3) 
        {
            await initWeb3();
        }
            const canBalance = await contract.methods.userCANBalance(userAddress).call();
            return canBalance;
    } catch(error) 
    {
        console.error("Error retrieving user's CAN balance", error);
        return 0;
    }
}

async function updateCANBalance() 
{
    const ethereumAddress = await getUserAddress();
    if(ethereumAddress) 
    {
        const canBalance = await getCANBalance(ethereumAddress);
        CANBalance = canBalance;
        document.getElementById('canAmount').innerText = CANBalance;
    }
}

async function updateUserDetails() 
{
    const ethereumAddress = await getUserAddress();
    if(ethereumAddress) 
    {
        const balance = await web3.eth.getBalance(ethereumAddress);
        const formattedBalance = web3.utils.fromWei(balance, 'ether');
        document.getElementById('walletAddress').innerText = ethereumAddress;
        document.getElementById('walletBalance').innerText = formattedBalance;
        updateCANBalance();
    }
}

initWeb3();
updateUserDetails();
