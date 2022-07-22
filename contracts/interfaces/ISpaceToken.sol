// SPDX-License-Identifier: MIT

/*
    Created by DeNet
*/

pragma solidity ^0.8.14;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface ISpaceToken is IERC20 {
  function mint(address account, uint256 amount) external;
}
