//SPDX-License-Identifier: MIT
// Author: @rakeshapnugoth
pragma solidity ^0.8.28;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';

contract PestSeed is ERC20Capped, ERC20Burnable {
    address payable public owner;
    uint256 public blockReward;

    constructor (uint256 cap, uint reward) ERC20('PestSeed', 'PST') ERC20Capped(cap * (10 ** decimals())){
        owner = payable(msg.sender);
        uint256 send = 10000000 * (10 ** decimals());
        _mint(owner, send);
        blockReward = reward * (10 ** decimals());
    }

    function _update(address from, address to, uint256 value) internal virtual override(ERC20Capped, ERC20) {
        super._update(from, to, value);
        if (from == address(0)) {
            uint256 maxSupply = cap();
            uint256 supply = totalSupply();
            if (supply > maxSupply) {
                revert ERC20ExceededCap(supply, maxSupply );
            }
        }
    }

    function _mintMinerReward() internal{
        _mint(block.coinbase, blockReward);
    }

    function setBlockReward(uint256 reward) public Restricted {
        blockReward = reward * (10 ** decimals());
    }

    modifier Restricted {
        require(msg.sender == owner, "Only the owner can call the fucntion");
        _;
    }
}