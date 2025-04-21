// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract USOneDollar is ERC20, ERC20Burnable, ERC20Pausable, AccessControl, ERC20Permit {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    mapping(address => bool) public blocklist; // Addresses that are blocked from transferring

    constructor(address defaultAdmin, address pauser, address minter)
        ERC20("US One Dollar", "USOD")
        ERC20Permit("US One Dollar")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(MINTER_ROLE, minter);
    }

    function _transfer(address from, address to, uint256 amount) internal override {
        if (blocklist[to]) {
            revert("USOD: Address is blocked from transferring.");
        }
        super._transfer(from, to, amount);
    }

    //===== Administrative functions ===== //

    //Pauser role can pause the contracts, which will halt all transfers.
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    //Minter role can mint new stablecoins
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function blockListAdd(address account) public onlyRole(PAUSER_ROLE) {
        _blacklist[account] = true;
    }

    function blockListRemove(address account) public onlyRole(PAUSER_ROLE) {
        _blacklist[account] = false;
    }

    function updateRole(bytes32 role, address account, bool grant) public onlyRole(DEFAULT_ADMIN_ROLE) {
        if (grant) {
            _grantRole(role, account);
        } else {
            _revokeRole(role, account);
        }
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}
