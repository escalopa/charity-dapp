// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14;

import '@openzeppelin/contracts/utils/Context.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

/**
  @title Charity Organization Contract
  @dev This contract is for testing purposes only, it has nothing to do with the main project.
*/

/* solhint-disable comprehensive-interface */
/* solhint-disable reason-string */
/* solhint-disable quotes */
contract Charity is ReentrancyGuard, ERC20 {
  using SafeMath for uint256;

  uint256 public endDate;
  address payable public receiver;
  address public pairTokenAddress;
  bool public released = false;

  address[] public senders;
  mapping(address => uint256) public receivedFunds;

  event RecivedFunds(address from, uint256 amount);

  modifier beforeEndDate() {
    require(
      endDate > block.timestamp,
      'CH: donation end date has already passed'
    );
    _;
  }

  modifier afterEndDate() {
    require(endDate <= block.timestamp, 'CH: Donation end date has not passed');
    _;
  }

  constructor(
    uint256 _endDate,
    address _receiver,
    address _pairTokenAddress
  ) ERC20('Charity Donation', 'CD') {
    endDate = block.timestamp + _endDate;
    receiver = payable(_receiver);
    pairTokenAddress = _pairTokenAddress;
  }

  function donate(uint256 amount) external payable beforeEndDate nonReentrant {
    IERC20 pairToken = IERC20(pairTokenAddress);
    require(
      pairToken.balanceOf(_msgSender()) >= amount,
      'CH: Sender does not have enough stacked tokens to donate'
    );

    uint256 newAmount = amount.mul(99).div(100); // 1% donate fee
    pairToken.transferFrom(_msgSender(), address(this), amount);
    _mint(_msgSender(), newAmount);
  }

  function withdrawDonations(uint256 amount)
    external
    beforeEndDate
    nonReentrant
  {
    require(
      balanceOf(_msgSender()) >= amount,
      'CH: amount to withdraw is more than current donated fund'
    );

    _burn(_msgSender(), amount);
    IERC20(pairTokenAddress).transfer(_msgSender(), amount);
  }

  function releaseFunds() external afterEndDate nonReentrant {
    require(!released, 'CH: funds already released');
    released = true;
    IERC20(pairTokenAddress).transfer(receiver, totalSupply());
  }
}
