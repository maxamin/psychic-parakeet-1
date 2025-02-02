let web3;
let CANBalance = 0;

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

function updateCANBalance() 
{
    document.getElementById('canAmount').innerText = CANBalance;
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

        CANBalance = 0;
        updateCANBalance();
    }
}

async function logout() 
{
    if(web3 && web3.currentProvider && web3.currentProvider.close) 
    {
        await web3.currentProvider.close();
        web3 = null;
    }

    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function() 
{
    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) 
    {
        logoutButton.addEventListener('click', async function() 
        {
            await logout();
        });
    }
});

initWeb3();
updateUserDetails();
