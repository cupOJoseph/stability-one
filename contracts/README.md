# Stability One – Contracts

Features:
- ERC-20 Standard token, Stablecoin
- Owner can set Minter and other roles.
- Minter role can mint new stablecoins when they are backed by centralized collateral off-chain.  
- New transfer type, `delaySafeTransfer()` that can be reversed by the sender.
- New stablecoins can be minted permissionlessly by depositing USDC at any time by anyone, with a timelock and size cap.
- Owner can set Manager role.
- Manager role can withdraw deposited USDC or other tokens.
- Manager can add a new stablecoin type to be added as a deposit, with a time delay.
- The Owner can add the Pauser role.
- The Pauser role and pause transfers of the entire contract, or add a particular address to the blockList and prevent them from transfering.