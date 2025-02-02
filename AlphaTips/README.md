# AlphaTips
This repository is a compilation of all the web3 security alpha tips. (in random order)


1)DeFi alpha tips by jp courses 
https://twitter.com/JP_Courses/status/1650523289918353409?s=20

2)lending and borrowning (audit) alpha tip 
Always check for these when you are auditing a Lending/Borrowing protocol:

1. Liquidation before the failure of the borrower to fulfil their obligation to repay the loan
2. Borrower Can't Be Liquidated
3. Debt Closed Without Repayment
4. Borrower Permanently Unable To Repay Loan


3)DeFi alpha tips for understanding flash loans vs flash swaps by jp courses
https://twitter.com/JP_Courses/status/1651033149705420803?s=20

4) Defi alpha tips for understanding impermanent loss vs slippage by jp courses
https://twitter.com/JP_Courses/status/1651013060167884800?s=20

5) Defi hacks on a dashboard by defilama https://defillama.com/hacks

6)Out of the box pov for auditing 
https://github.com/OpenCoreCH/smart-contract-auditing-heuristics

7) useful commands 
   *SLITHER* - 
   The most useful slither commands:
1) slither .
2) slither triage (creates slither.db.json file which 
     contain tests)
3) slither file.sol --print call-graph (Export the call- 
     graph of the contracts to a dot file)
4) slither-check-upgradeability


8)Alpha mindset:
The most under-discussed yet critical concept in bounty hunting and competitive auditing is bug density. 
Every line or chunk of code has some invisible "danger" value, which is the probability of a mistake being injected. As a hunter, time and attention are your only resource constraints. It follows that to maximize success you need to spend those resources on the highest-value sections. 
So what are the red hotspots on my heatmap?
1. fundamentally complex code
2. undertested/hard-to-test code
3. novel ideas or implementations
4. heuristics triggered - gas/delegatecall/callbacks/eth-weth duality etc.
Mastering the bug density heatmap is the single most profitable thing you can do in bounties.
5. functions created at contract deployment but never/hardly used e.g. emergencyWithdraw()

9)Bugs aren't interesting. They are the result of a very specific mutation in a particular codebase which in all likelihood will not repeat in that exact way.

10)The interesting part happens when you're able to aggregate and abstract them into classes, with common properties. At this point, we can start discussing meaningful concepts like bug introduction theory, first-order side effects, and common exploitation paths.

11)By studying classes we can apply the wisdom of the past to new codebases and become more adept hunters.

12)#1 Randomization of knowledge
If you study from the same sources and read the same reports as everyone, you'll likely end up with the same findings.
In bounty hunting and competitive auditing, you're mainly looking for RARE bugs. The ones that remained after the last 10 hunters were done with their prey. So to find them, you'll travel the road not taken. Dig into the less-readable stuff.
 Go beyond known theory and experiment in a sandbox. Pick a random 0-star GH project and tear it apart. Congrats, now there's something that makes you better than the rest of the pack.


Few mandatory checks you need to do, when auditing a Smart contract: ✅
👇

1. Verify that the sensitive operations of contract do not depend on the block data (i.e. block hash, timestamp).
2. Verify that the self-destruct functionality is used only if necessary.
3. Verify that the result of low-level function calls (e.g. send, delegatecall, call) from another contracts is checked.
4. Verify that the contract relies on the data provided by right sender and contract does not rely on tx.origin value.
