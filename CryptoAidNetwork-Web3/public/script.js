let web3;

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
        alert('MetaMask not detected! Please install MetaMask to log in.');
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

async function redirectToDashboard() 
{
    const ethereumAddress = await getUserAddress();

    if(ethereumAddress) 
    {
        window.location.href = 'dashboard.html';
    }
}

async function signIn() 
{
    await redirectToDashboard();
}

initWeb3();
