// SPDX-License-Identifier: MIT

/*
    Created by DeNet
*/

pragma solidity ^0.8.14;

import './interfaces/ISpaceToken.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract SpaceToken is ERC20, Ownable, ISpaceToken {
  // solhint-disable-next-line no-empty-blocks
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

  function mint(address account, uint256 amount) external override onlyOwner {
    _mint(account, amount);
  }
}
