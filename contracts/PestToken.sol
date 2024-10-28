// SPDX-License-Identifier: MIT
// PESTOKEN.Sol
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract PestToken is ERC20, ERC20Burnable, ERC20Capped {
    uint256 public blockReward;
    address public owner;

    constructor(uint256 cap, uint reward) 
        ERC20("PestToken", "PTK") 
        ERC20Capped(cap * (10 ** decimals())) 
    {   
        owner = msg.sender;
        uint256 send = 10000000 * (10 ** decimals());
        _mint(owner, send);
        blockReward = reward * (10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 value) internal virtual override(ERC20, ERC20Capped) {
        super._update(from, to, value);
        if (from == address(0)) {
            uint256 maxSupply = cap();
            uint256 supply = totalSupply();
            if (supply > maxSupply) {
                revert ERC20ExceededCap(supply, maxSupply);
            }
        }
    }

    function _mintMinerReward() internal{
        _mint(block.coinbase, blockReward);
    }

    function setBlockReward(uint256 reward) public onlyOwner() {
        blockReward = reward * (10 ** decimals());
    }

    modifier onlyOwner {
        require(owner == owner, "Only the owner can call the fucntion");
        _;
    }
}