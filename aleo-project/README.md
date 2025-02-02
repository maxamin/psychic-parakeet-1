# React + Aleo + Leo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/AleoHQ/sdk/tree/testnet3/create-aleo-app/template-react)

This template provides a minimal setup to get React and Aleo working in Vite
with HMR and some ESLint rules.

This template includes a Leo program that is loaded by the web app located in
the `helloworld` directory.

Note: Webpack is currently used for production builds due to a
[bug](https://github.com/vitejs/vite/issues/13367) with Vite related to nested
workers.

### Start in development mode

```bash
npm run dev
```

Your app should be running on http://localhost:5173/

### Build Leo program

1. Copy the `helloworld/.env.example` to `helloworld/.env` (this will be ignored
   by Git):

   ```bash
   cd helloworld
   cp .env.example .env
   ```

2. Replace `PRIVATE_KEY=user1PrivateKey` in the `.env` with your own key (you
   can use an existing one or generate your own at https://aleo.tools/account)

3. Follow instructions to install Leo here: https://github.com/AleoHQ/leo

4. You can edit `helloworld/src/main.leo` and run `leo run` to compile and update the
   Aleo instructions under `build` which are loaded by the web app.

## Deploy program from web app

> [!WARNING]  
> This is for demonstration purposes or local testing only, in production applications you
> should avoid building a public facing web app with private key information

Information on generating a private key, seeding a wallet with funds, and finding a spendable record can be found here
if you are unfamiliar: https://developer.aleo.org/testnet/getting_started/deploy_execute_demo

Aleo programs deployed require unique names, make sure to edit the program's name to something unique in `helloworld/src/main.leo`, `helloworld/program.json`, rename `helloworld/inputs/helloworld.in` and rebuild.

1. In the `worker.js` file modify the privateKey to be an account with available
   funds

   ```js
   // Use existing account with funds
   const account = new Account({
     privateKey: "user1PrivateKey",
   });
   ```

2. (Optional) Provide a fee record manually (located in commented code within `worker.js`)

   If you do not provide a manual fee record, the SDK will attempt to scan for a record starting at the latest block. A simple way to speed this up would be to make a public transaction to this account right before deploying.
   
3. Run the web app and hit the deploy button

## Production deployment

### Build

`npm run build`

Upload `dist` folder to your host of choice.

### ⚠️ Header warnings

`DOMException: Failed to execute 'postMessage' on 'Worker': SharedArrayBuffer transfer requires self.crossOriginIsolated`

If you get a warning similar to this when deploying your application, you need
to make sure your web server is configured with the following headers:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

We've included a `_headers` file that works with some web hosts (e.g. Netlify)
but depending on your host / server setup you may need to configure the headers
manually.


fresh-theme-sadeh
===================
A compact, no-frills résumé theme for candidates with lengthy work histories.
Collapses older work history into a single summary entry.

<!-- ![](sadeh.png) -->

## Use

The Sadeh theme folds the candidates last several jobs into a single entry
in order to conserve vertical space. Your resume should have at least 7 or 8
job entries in order for this theme to make sense.

## License

MIT. See [LICENSE.md][lic] for details.

[lic]: https://github.com/nekofar/fresh-theme-sadeh/blob/master/LICENSE.md


# IntelliJ Hardhat Plugin

[![JetBrains Plugins](https://img.shields.io/jetbrains/plugin/v/18551-hardhat)](https://plugins.jetbrains.com/plugin/18551-hardhat)
[![JetBrains plugins](https://img.shields.io/jetbrains/plugin/d/18551-hardhat)](https://plugins.jetbrains.com/plugin/18551-hardhat/versions)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/KartanHQ/intellij-hardhat/build.yml?branch=master)](https://github.com/KartanHQ/intellij-hardhat/actions/workflows/build.yml)
[![GitHub](https://img.shields.io/github/license/KartanHQ/intellij-hardhat)](https://github.com/KartanHQ/intellij-hardhat/blob/master/LICENSE)
[![Twitter Follow](https://img.shields.io/badge/follow-%40nekofar-1DA1F2?logo=twitter&style=flat)](https://twitter.com/nekofar)
[![Donate](https://img.shields.io/badge/donate-nekofar.crypto-a2b9bc?logo=ko-fi&logoColor=white)](https://ud.me/nekofar.crypto)


<!-- Plugin description -->
Provides boilerplate codes for easier smart contract creation using [Hardhat](https://hardhat.org) CLI.

Speed up the setup phase of contract development for both new and experienced developers.
<!-- Plugin description end -->

## Installation

For plugin installation, navigate to `Preferences`, then `Plugins`, and finally `Marketplace`. In the search bar, enter `Hardhat`.




# web3swift
**web3swift** is an iOS toolbelt for interaction with the Ethereum network.

## Social media
[Join our discord](https://discord.gg/8bHCNmhS7x) or [Telegram](https://t.me/web3swift) if you need support or want to contribute to web3swift development!

![matter-github-swift](https://github.com/web3swift-team/web3swift/blob/develop/web3swift-logo.png)
[![Web3swift CI](https://github.com/web3swift-team/web3swift/actions/workflows/macOS-12.yml/badge.svg)](https://github.com/web3swift-team/web3swift/actions/workflows/macOS-12.yml)
[![Swift](https://img.shields.io/badge/Swift-5.4-orange.svg?style=flat)](https://developer.apple.com/swift/)
[![Platform](https://img.shields.io/cocoapods/p/web3swift?style=flat)](http://cocoapods.org/pods/web3swift)
[![CocoaPods Compatible](https://img.shields.io/cocoapods/v/web3swift?style=flat)](http://cocoapods.org/pods/web3swift)
[![License](https://img.shields.io/cocoapods/l/web3swift.svg?style=flat)](https://github.com/web3swift-team/web3swift/blob/master/LICENSE.md)
[![support](https://brianmacdonald.github.io/Ethonate/svg/eth-support-blue.svg)](https://brianmacdonald.github.io/Ethonate/address#0xe22b8979739d724343bd002f9f432f5990879901)
[![Stackoverflow](https://img.shields.io/badge/stackoverflow-ask-blue.svg)](https://stackoverflow.com/questions/tagged/web3swift)

---

<!-- MarkdownTOC -->

- [Core features](#core-features)
- [Installation](#installation)
    - [Swift Package](#swift-package)
    - [CocoaPods](#cocoapods)
- [Example usage](#example-usage)
    - [Send Ether](#send-ether)
    - [Contract read method](#contract-read-method)
    - [Write Transaction and call smart contract method](#write-transaction-and-call-smart-contract-method)
    - [Sending network request to a node](#sending-network-request-to-a-node)
- [Build from source](#build-from-source)
    - [SPM](#spm)
- [Requirements](#requirements)
- [Documentation](#documentation)
- [Projects that are using web3swift](#projects-that-are-using-web3swift)
- [Support](#support)
- [Contribute](#contribute)
    - [Contribution](#contribution)
- [Credits](#credits)
- [Security Disclosure](#security-disclosure)
- [License](#license)

<!-- /MarkdownTOC -->



## Core features

- [x] :zap: Swift implementation of [web3.js](https://github.com/ethereum/web3.js/) functionality
- [x] :thought_balloon: Interaction with remote node via **JSON RPC**
- [x] 🔐 Local **keystore management** (`geth` compatible)
- [x] 🤖 Smart-contract **ABI parsing**
- [x] 🔓**ABI decoding** (V2 is supported with return of structures from public functions. Part of 0.4.22 Solidity compiler)
- [x] 🕸Ethereum Name Service **(ENS) support** - a secure & decentralised way to address resources both on and off the blockchain using simple, human-readable names
- [x] :arrows_counterclockwise: **Smart contracts interactions** (read/write)
- [x]  ⛩ **Infura support**
- [x] ⚒  **Parsing TxPool** content into native values (ethereum addresses and transactions) - easy to get pending transactions
- [x] 🖇 **Event loops** functionality
- [x] 🕵️‍♂️ Possibility to **add or remove "middleware" that intercepts**, modifies and even **cancel transaction** workflow on stages "before assembly", "after assembly" and "before submission"
- [x] ✅**Literally following the standards** (BIP, EIP, etc):
    - [x] **[BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) (HD Wallets), [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) (Seed phrases), [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) (Key generation prefixes)**
- [x] **[EIP-20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md)** (Standard interface for tokens - ERC-20), **[EIP-67](https://github.com/ethereum/EIPs/issues/67)** (Standard URI scheme), **[EIP-155](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md)** (Replay attacks protection), **[EIP-2718](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2718.md)** (Typed Transaction Envelope), **[EIP-1559](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md)** (Gas Fee market change)
    - [x] **And many others** *(For details about this EIP's look at [Documentation page](https://github.com/web3swift-team/web3swift/blob/master/Documentation/))*: EIP-165, EIP-681, EIP-721, EIP-777, EIP-820, EIP-888, EIP-1155, EIP-1376, EIP-1400, EIP-1410, EIP-1594, EIP-1633, EIP-1643, EIP-1644, EIP-4361 ([SIWE](https://eips.ethereum.org/EIPS/eip-4361)), ST-20
- [x] **RLP encoding**
- [x] Base58 encoding scheme
- [x] Formatting to and from Ethereum Units
- [x] Comprehensive Unit and Integration Test Coverage

## Installation

### Swift Package (Recommended)
The [Swift Package Manager](https://swift.org/package-manager/ "") is a tool for automating the distribution of Swift code that is well integrated with Swift build system.

Once you have your Swift package set up, adding `web3swift` as a dependency is as easy as adding it to the `dependencies` value of your `Package.swift`.
```swift
dependencies: [
    .package(url: "https://github.com/web3swift-team/web3swift.git", .upToNextMajor(from: "3.0.0"))
]
```

Or if your project is not a package follow these guidelines on [how to add a Swift Package to your Xcode project](https://developer.apple.com/documentation/xcode/adding-package-dependencies-to-your-app).


## Example usage
In the imports section:

```swift
import web3swift
import Web3Core
```

### CocoaPods

[CocoaPods](http://cocoapods.org) is a dependency manager for Cocoa projects. You can install it with the following command:

```bash
$ sudo gem install cocoapods
```

To integrate web3swift into your Xcode project using CocoaPods, specify it in your `Podfile`:

```ruby
source 'https://github.com/CocoaPods/Specs.git'
platform :ios, '13.0'

target '<Your Target Name>' do
    use_frameworks!
    pod 'web3swift'
end
```

Then, run the following command:
```bash
$ pod install
```

> **WARNING**: CocoaPods is a powerful tool for managing dependencies in iOS development, but it also has some limitations that preventing us of providing first class support there. We highly recommend using SPM first as using CocoaPods will delay new updates and bug fixes being delivered to you.

### Send Ether
```swift
let transaction: CodableTransaction = .emptyTransaction
transaction.from = from ?? transaction.sender // `sender` one is if you have private key of your wallet address, so public key e.g. your wallet address could be interpreted
transaction.value = value
transaction.gasLimitPolicy = .manual(78423)
transaction.gasPricePolicy = .manual(20000000000)
web3.eth.send(transaction)
```

### Contract read method
```swift
let contract = web3.contract(Web3.Utils.erc20ABI, at: receipt.contractAddress!)!
let readOp = contract.createReadOperation("name")!
readOp.transaction.from = EthereumAddress("0xe22b8979739D724343bd002F9f432F5990879901")
let response = try await readTX.callContractMethod()
```

### Write Transaction and call smart contract method
```swift
let abiString = "[]" // some ABI string
let bytecode = Data.fromHex("") // some ABI bite sequence
let contract = web3.contract(abiString, at: nil, abiVersion: 2)!
let parameters: [Any] = [...]
let deployOp = contract.prepareDeploy(bytecode: bytecode, constructor: contract.contract.constructor, parameters: parameters)!
deployOp.transaction.from = "" // your address
deployOp.transaction.gasLimitPolicy = .manual(3000000)
let result = try await deployTx.writeToChain(password: "web3swift")
```

### Sending network request to a node
```swift
func feeHistory(blockCount: UInt, block: BlockNumber, percentiles:[Double]) async throws -> Web3.Oracle.FeeHistory {
    let requestCall: APIRequest = .feeHistory(blockCount, block, percentiles)
    let response: APIResponse<Web3.Oracle.FeeHistory> = try await APIRequest.sendRequest(with: web3.provider, for: requestCall) /// explicitly declaring `Result` type is **required**.
    return response.result
}
```
## Build from source
### SPM
```bash
git clone https://github.com/web3swift-team/web3swift.git
cd web3swift
swift build
```

## Requirements
- iOS 13.0 / macOS 10.15
- Xcode 12.5
- Swift 5.5

## Documentation
Documentation is under construction👷🏻👷🏼‍♀️. We’re trying our best to comment all public API as detailed as we can, but the end it still far to come. But in one of the nearest minor updates we’ll bring DocC support of already done amount of docs. And your PR in such are more than welcome.

## Projects that are using web3swift
Please take a look at [Our customers](https://github.com/web3swift-team/web3swift/wiki/Our-Customers) wiki page.

## Support

**[Join our discord](https://discord.gg/8bHCNmhS7x) and [Telegram](https://t.me/web3swift) if you need support or want to contribute to web3swift development!**

- If you **need help**, please take a look at our [FAQ](https://github.com/web3swift-team/web3swift/wiki/FAQ "") or [open an issue](https://github.com/web3swift-team/web3swift/issues).
- If you'd like to **see web3swift best practices**, check [Projects that using web3swift](https://github.com/web3swift-team/web3swift/wiki/Our-Customers).
- If you **found a bug**, [open an issue](https://github.com/web3swift-team/web3swift/issues).

## Development
To do local development and run the local tests, we recommend to use [ganache](https://github.com/trufflesuite/ganache) which is also used by CI when running github actions.

```cli
// To install
$ npm install ganache --global

// To run
$ ganache
```

This will create a local blockchain and also some test accounts that are used throughout our tests.
Make sure that `ganache` is running on its default port `8546`. To change the port in test cases locate `LocalTestCase.swift` and modify the static `url` variable.

### Before you commit

We are using [pre-commit](https://pre-commit.com) to run validations locally before a commit is created. Please, install pre-commit and run `pre-commit install` from project's root directory. After that before every commit git hook will run and execute `codespell`, `swiftlint` and other checks.

## Contribute
Want to improve? It's awesome:
Then good news for you: **We are ready to pay for your contribution via [@gitcoin bot](https://gitcoin.co/grants/358/web3swift)!**

- If you **have a feature request**, [open an issue](https://github.com/web3swift-team/web3swift/issues).
- If you **want to contribute**, [submit a pull request](https://github.com/web3swift-team/web3swift/pulls).

### Contribution
1. You are more than welcome to participate and get bounty by contributing! **Your contribution will be paid via  [@gitcoin Grant program](https://gitcoin.co/grants/358/web3swift).**
2. Find or create an [issue](https://github.com/web3swift-team/web3swift/issues)
3. You can find open bounties in [Gitcoin Bounties](https://gitcoin.co/explorer?applicants=ALL&keywords=web3swift&order_by=-web3_created) list
4. Commita fix or a new feature in branch, push your changes
5. [Submit a pull request to **develop** branch](https://github.com/web3swift-team/web3swift/pulls)
    1. Please, provide detailed description to it to help us proceed it faster.

[@skywinder](https://github.com/skywinder) are charged with open-sourсe and do not require money for using web3swift library.
We want to continue to do everything we can to move the needle forward.

- **Support us** via [@gitcoin Grant program](https://gitcoin.co/grants/358/web3swift)
- Ether wallet address: `0x6A3738c6299f45c31697aceA647D49EdCC9C28A4`

<img src="https://raw.githubusercontent.com/skywinder/web3swift/develop/img/Ether-donations.jpeg" width="300" />

## Credits

- Alex Vlasov, [@shamatar](https://github.com/shamatar) - for the initial implementation
- Petr Korolev, [@skywinder](https://github.com/skywinder) - bootstrap and continuous support
- Anton Grigorev, [@baldyash](https://github.com/BaldyAsh) - core contributor, who use it and making a lot of improvements
- Yaroslav Yashin [@yaroslavyaroslav](https://github.com/yaroslavyaroslav) - core contributor of 3.0.0 and later releases.
- Thanks to [web3swift's growing list of contributors](https://github.com/web3swift-team/web3swift/graphs/contributors).

## Security Disclosure

If you believe you have identified a security vulnerability with web3swift, you should report it as soon as possible via email to [web3swift@oxor.io](mailto:web3swift@oxor.io). Please do not post it to a public issue tracker.

## License

web3swift is available under the Apache License 2.0 license. See the [LICENSE](https://github.com/web3swift-team/web3swift/blob/master/LICENSE.md) for details.



<h1 align="center">
  saeid
</h1>

<p align="center">
  <a href="mailto:saeidha@gmail.com">saeidha@gmail.com</a> . 
  <a href="https://google.com">saeid.ha.com</a>
</p>

---

I'm a self-taught Software Developer. I have around two decades of experience in the software industry. At the moment, I work on software development projects as a freelancer.

I enjoy learning and experiment with new things and self-studies, especially if related to new technologies and software development. I have worked with different platforms, mostly in the field of mobile and web development.

Sometimes I give consultation to the startups or cooperate with them.

## SKILLS

  - Backend: Slim Express.js Sinatra REST GraghQL SOAP RPC 
  - Frontend: JavaScript CSS HTML5 Sass Less Bootstrap jQuery Vue.js React 
  - Mobile: Java Objective-C Swift Kotlin Android iOS Flutter 
  - DevOps: Linux Apache Nginx Git Docker Kubernetes Vagrant Selenium 
  - Database: MySQL MariaDB MongoDB Redis SQLite MSSQL Realm 
  - Games: Unity Godot 
  - Projects: Agile Scrum Kanban 
  - Programming: PHP Python Java Objective-C C Shell Perl Go Ruby Node TypeScript 

## EMPLOYMENT

- ***Senior Software Developer***, [Freelancer](https://milad.nekofar.com) (2007-05 — Present)

  Finally, I decide to switch to fulltime, most of the time as a freelancer and sometimes as a contractor in the field of Web development, mostly backend and PHP. 
In recent past years, I learned other technologies and started to work on application development for mobile, first Android, and then iOS either.
    - Working as a Freelancer is always gave me new opotionities for learning new technologies
    - As a freelancer, I am able to deal with a wide range of tasks in website development, website design, database design, back-end, and front-end development.
    - Utilized existing web technologies including WordPress, Laravel and Drupal for small businesses websites.

- ***Senior Software Developer***, [MyFlashLabs](https://myflashlabs.com) (2019-11 — Present)

  Develop and maintain Adobe AIR Native Extensions for use with iOS and Android mobile platforms. Maintain softwares backend based on WordPress REST API.
    - Develop and maintain more than fifty AIR Native Extensions.
    - Create, develop and maintain all Objective-C and Java libraries for Extensions
    - Create and maintain gradle plugins to maintain release workflow automatically.

- ***Lead Software Developer***, [Abasmanesh Research Group](https://abasmanesh.com:) (2014-11 — 2018-11)

  It was a good experience for me to have more communication with the end users in this job. I work mostly from remote on the website and their mobile applications projects as an independent contractor.
    - Transfer customer history and thousands of users' information from legacy software to WooCommerce.
    - Develop and maintain more than fifty WordPress plugins.
    - Manage, maintain and secured servers and applications for client various needs.

- ***Senior Softwar Developer***, [Bugloos](http://www.bugloos.nl) (2014-10 — 2014-11)

  It was for short period of time, I just worked as a freelancer on couple of their projects. They asked me for a full-time position, but at the time, I was reluctant to do so.
    - Collaborate on develop and maintain the front-end and back-end of a custom built web app by PHP frameworks.

- ***Senior Software Developer***, [Papata Game Studio](http://papatalab.ir) (2013-12 — 2014-06)

  It was a good experience. I did work with some of young and motivated peoples who had a dream to create their own game development studio. I mostly cooperate in development of apps and games and also their online backends.
    - Collaborate on the development of two high-quality mobile games, alongside a team of motivated youth developers.

- ***Senior Software Developer***, [Farayaz](https://farayaz.com) (2010-05 — 2014-03)

  It was my first experience to work directly for a company. I was working as a contractor. 
It took years, but finally, I realize I'm not that kind of person who can work in fixed work schedules. 
My job was analysis projects, programming on web development projects, maintaining servers and training of new recruits in the last years.
    - Develop and maintain hundreds of websites based on custom cms.

- ***Owner / Managing Director***, [Movable Host](https://movablehost.net) (2005-12 — 2013-10)

  Provide and manage dedicated servers, virtual servers and hosted services. Setup and secure dedicated and virtual servers.

- ***Medior Software Developer***, [Freelancer](https://milad.nekofar.com) (2004-01 — 2007-05)

  It's been years past since I started coding. I've started with web development when I was younger as a hobby and then as a part-time freelance job.
    - Develop tons of web sites using PHP frameworks, mustly CakePHP.
    - This experience has not only helped me to understand the whole process of development but also taught me how to achieve great productivity.

- ***Junior Software Developer***, [Freelancer](https://milad.nekofar.com) (2002-01 — 2004-01)

  I started programming with Perl and PHP. Those years were the weblogs hype, and must of the time I was working on the design and develop wide types of blog templates. Persianblog, Blogger, Blogspot, Movable Type, WordPress.




## EDUCATION

- ***Diploma***, [Harati High School](https://en.wikipedia.org/wiki/Harati_High_School) (2000-01 — 2004-01)

  I have started learning to work with computers before high school through workshops which I always was the youngest participants.
 My connections with university students and observing the low level of my country's higher education in the field of IT at that time made me decide to leave the academic education system and continue my path through self-studying.





## WRITING

- ***Translation of articles related to the field of free software*** (Salam Dnya Magazine, 2016-01)

  Participate in the translation of a series of articles related to the field of free and open source software from English to Persian language.

- ***A series of articles in the field of software development*** (Hive Web Magazine, 2015-01)

  Writing weekly about technologies and software development especially mobile development in Persian



## SERVICE

- ***Community Organizer***, [Hamfekr](https://hamfekr.net/) (2014-12 — 2018-01)

  It is a weekly event and an opportunity for entrepreneurs, entrepreneurs, designers and investors who were networking, exchanging opinions and learning.
    - Organize and formation of Hamfekr meetings in Esfahan for years.
    - Organize hundreds of weekly meetings with thousands of participants from across the province and the country.

- ***Workshop Facilitator***, [Hamnet](http://hamnetevent.ir) (2015-09)

  Hemnet is a three-stage entrepreneurship event, based on the local economic and entrepreneurial conditions in each region.
    - Help teams for work on their Business Model Canvas and Technical issues.

- ***Event Organizer***, [Startup Spark](http://startupspark.ir) (2015-07 — 2015-08)

  Startup Spark is a startup gathering. Includes seminar on startups issues, tips on new ways of entrepreneurship. Face-to-face interview with one of the leading entrepreneurs and networkers.
    - Organize and formation of Startup Spark meetings in Esfahan.

- ***Event Organizer***, Startup Weekend Isfahan (2013-11)

  Startup Weekend is a 54-hour weekend event, during which groups of developers, business managers, startup enthusiasts, marketing experts, graphic artists and more pitch ideas for new startup companies, form teams around those ideas, and work to develop a working prototype, demo, or presentation by Sunday evening.
    - Participation in holding and coordinating the first startup weekend in Isfahan.




## SPEAKING

- ***Freelance work, requirements, goal setting, planning***, Autocom (2018)

  In a workshop on the sidelines of the Isfahan International Computer and Office Automation Exhibition, organized by Ponisha, I spoke about freelance and starting to work as a freelancer.

  - Investigate the advantages of freelancing compared to long-term employment.



## INTERESTS

  - ***Electronics***

    I have been interested in electronics since I was a teenager, but I was not very active in this field. Recently, despite microcontroller boards accessibility like Arduino and Raspberry Pi, and discussions like the Internet of Things, I became very interested in this area.

  - ***3D printing***

    Unfortunately, I do not have a 3D printer yet, but it is one of the hobbies I am researching these days, and maybe even if I have the opportunity to make a DIY printer.

  - ***Cryptocurrency***

    I have been interested in cryptocurrencies for several years, I was mostly a Hodler, but recently I did some work in the field of payment and I became more serious. Recently I worked with Solidity but not serious activity.


<div align="center">
 <span>
 <img src="https://github.com/ShivamMenda/Resonate/assets/74780977/ca9e88d2-f4ca-4d8c-8a8a-289286b91e54" alt="Resonate logo" width="150" height="auto" />
<img src="assets/images/aossie_logo.png" alt="Resonate logo" width="150" height="auto" />
 </span>

# :microphone: Resonate - An Open Source Social Voice Platform
</div>
<div align="center"> 
<span>
 <a href="https://appwrite.io" target="_blank"><img src="https://github.com/appwrite/website/blob/main/static/images/logos/appwrite.svg" alt="Appwrite Logo" width="200"></a> 
 <img src="https://github.com/ShivamMenda/Resonate/assets/74780977/38823d33-edfb-4d90-9c4b-823cbe33c0a5" alt="Livekit Logo" width="200"></a>
</span>
</div>
<br>
<br>


<div align="center">
  
[![License:GPL-3.0](https://img.shields.io/badge/License-GPL-yellow.svg)](https://opensource.org/license/gpl-3-0/)
![GitHub Org's stars](https://img.shields.io/github/stars/AOSSIE-Org/Resonate?style=social)

</div>


With the rising popularity of social voice platforms such as Clubhouse and Twitter Spaces, it is high time for an Open Source alternative. A platform like this would not only enhance credibility within the open-source community but also attract more users and foster growth. An engagement platform that is Open Source has the potential to drive significant traction and help establish a strong presence.

## :rocket: Features
1. Real-time Audio Communication by joining rooms and talking to people.
2. Ability to create rooms and moderate speakers and events.
3. Pair chatting to enable users to find random partners to talk to in the app.
4. Real-time messaging(Coming Soon) 

## :computer: Technologies Used

1.  **Flutter** - Mobile application
2.  **Appwrite** - Authentication, Database, Storage and Cloud functions.
3.  **LiveKit** - Web Real-Time Communication 

## :link: Repository Links
1. [Resonate Flutter App](https://github.com/AOSSIE-Org/Resonate)
2. [Resonate Backend](https://github.com/AOSSIE-Org/Resonate-Backend)

## :movie_camera: App Screenshots
<div align="center">
 
| Login Screen | Home Screen | Create Room Screen |
| :---         |     :---      |          :--- |
| <img src="https://github.com/ShivamMenda/Resonate/assets/74780977/7c996c0a-1201-44e4-86bb-832ded1aae15" width="260" height="auto" />  | <img src="https://user-images.githubusercontent.com/41890434/246064681-16cfa072-af71-4e1f-97b8-2c429a875483.png" width="250" height="auto" />    | <img src="https://user-images.githubusercontent.com/41890434/246064943-82e83ead-dcf3-45fa-b3ba-c0a60455946a.png" width="250" height="auto" />    |

| Room Screen | Profile Screen | Pairchat Screen |
| :---         |     :---      |          :--- |
|  <img src="https://user-images.githubusercontent.com/41890434/246065343-352bdfb5-3cb4-44ad-9050-6460c3be18ad.png" width="250" height="auto" /> | <img src="https://user-images.githubusercontent.com/41890434/246064895-1b8cd5a8-b427-4514-91b8-d783ff4a0604.png" width="250" height="auto" />   |  <img src="https://github.com/ShivamMenda/Resonate/assets/74780977/8d7c5da5-0b2f-4d8f-8f12-d1059b0e4a01" width="250" height="auto"/>    |
</div>

## :raised_hands: Contributing
:star: Don't forget to star this repository if you find it useful! :star:

Thank you for considering contributing to this project! Contributions are highly appreciated and welcomed. To ensure a smooth collaboration, Refer to the [Contribution Guidelines](https://github.com/AOSSIE-Org/Resonate/blob/master/CONTRIBUTING.md).

We appreciate your contributions and look forward to working with you to make this project even better!

By following these guidelines, we can maintain a productive and collaborative open-source environment. Thank you for your support!

## :v: Maintainers

-   [Jaideep Prasad](https://github.com/jddeep)
-   [Chandan S Gowda](https://github.com/chandansgowda)

## :mailbox: Communication Channels

If you have any questions, need clarifications, or want to discuss ideas, feel free to reach out through the following channels:

-   [Discord Server](https://discord.com/invite/6mFZ2S846n)
-   [Email](mailto:aossie.oss@gmail.com)

<!-- License -->
## :round_pushpin: License

Distributed under the [GNU General Public License](https://opensource.org/license/gpl-3-0/). See [LICENSE](https://github.com/AOSSIE-Org/Resonate/blob/master/LICENSE) for more information.

## 💪 Thanks To All Contributors

Thanks a lot for spending your time helping Resonate grow. Keep rocking 🥂

<a href="https://github.com/AOSSIE-Org/Resonate/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=AOSSIE-Org/Resonate" alt="Contributors"/>
</a>
<br>
 


# Ecommerce REST API

- Hey I am building a rest api for my ecommerce website, which will be used by the frontend to fetch data.

- I have just started with this project and I am still learning the basics of rest api.

- Hoping to learn more about rest api and get a better understanding of it.


## One-click token issuance app

Canisters:

* token canister
* token registry canister


# Lil Nouns Pics

[![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/lilnouns/lilnouns-pics?include_prereleases)](https://github.com/lilnouns/lilnouns-pics/releases)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/lilnouns/lilnouns-pics/build.yml)](https://github.com/lilnouns/lilnouns-pics/actions/workflows/build.yml)
[![GitHub](https://img.shields.io/github/license/lilnouns/lilnouns-pics)](https://github.com/lilnouns/lilnouns-pics/blob/master/LICENSE)
[![Twitter Follow](https://img.shields.io/badge/follow-%40nekofar-1DA1F2?logo=twitter&style=flat)](https://twitter.com/nekofar)
[![Donate](https://img.shields.io/badge/donate-nekofar.crypto-a2b9bc?logo=ko-fi&logoColor=white)](https://ud.me/nekofar.crypto)


Select and download a Lil Nouns picture in various sizes and formats.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


# Ecommerce REST API

- Hey I am building a rest api for my ecommerce website, which will be used by the frontend to fetch data.

- I have just started with this project and I am still learning the basics of rest api.

- Hoping to learn more about rest api and get a better understanding of it.


## Inspiration
Are you tired of your old NFTs but not really into selling them? What about modifying them with our tool?  

## What it does
We made a protocol to modify existing NFTs with the help of neural networks using different filters (adding animation and movements, changing style, background, and many others)

## How we built it
We developed the smart contract that uses the create2 mechanism that provides the technology to allow one NFT to own another. As well we trained a neural network to perform animation transfer of motion from source NFT to another NFT. Later other types of neural networks transformation types can be added and applied

## Challenges we ran into
It was quite challenging to run a virtual machine with GPU to perform neural network inference. As well we faced some difficulties with the frontend part (deployment and interaction with a smart contract) 

## Accomplishments that we're proud of
We succeeded in training a neural network to generate good-quality gifs and created some funny NFTs. 

## What we learned
How to work with Polygon
How to mint NFT tokens
How to create proxy-contract
How to train and deploy neural networks
How to run GPU virtual machine
How to use Flask

## What's next for DO[NFT] - Dynamic Ownable NFT Collection
We will try to release our project in mainnet Polygon and start to attract NFT creators

![photo_2021-10-24 12 26 43](https://user-images.githubusercontent.com/3356474/138594816-e400bd00-391c-4426-ae52-551afbce3700.jpeg)
![photo_2021-10-24 12 26 41](https://user-images.githubusercontent.com/3356474/138594817-b59610f3-17dc-46f2-83eb-b585e90adad1.jpeg)
![photo_2021-10-24 12 26 40](https://user-images.githubusercontent.com/3356474/138594818-1be084bd-dc9f-454f-bc33-43f4ff0a838c.jpeg)


![output-4 gif](https://user-images.githubusercontent.com/3356474/138591977-1e03c2ef-ab06-44b4-bb3e-5e6f1962a257.gif)
![Roma_1](https://user-images.githubusercontent.com/3356474/138591966-765b3b9b-c3d1-4d06-b7b9-e656ba07b35d.gif)
![output-3](https://user-images.githubusercontent.com/3356474/138592039-fffd04fb-a8db-4e94-ac81-e3252ae7c5ed.gif)

Kudos to the team:
![photo_2021-10-24 12 17 47](https://user-images.githubusercontent.com/3356474/138591971-cfa26571-773f-478f-9a4c-f818a6ae6f15.jpeg)
