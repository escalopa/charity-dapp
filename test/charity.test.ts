import { BigNumber, Contract } from 'ethers';
import chai, { expect } from 'chai';
import { solidity } from 'ethereum-waffle';
import hre, { ethers, network } from 'hardhat';
import { before, describe } from 'mocha';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);

let owner: SignerWithAddress,
  account1: SignerWithAddress,
  account2: SignerWithAddress;

let charity: Contract;
let spaceToken: Contract;

describe('Test Charity Contract', () => {
  const DECIMALS_18 = 1e18;
  const TOKEN_AMOUNT = (tokenAmount: number) => {
    return (DECIMALS_18 * tokenAmount).toLocaleString('fullwide', {
      useGrouping: false,
    });
  };

  const TOKEN_AMOUNT_BN = (tokenAmount: number) => {
    return BigNumber.from(TOKEN_AMOUNT(tokenAmount));
  };

  before(async () => {
    [owner, account1, account2] = await ethers.getSigners();
  });

  beforeEach(async () => {
    const SPACE_TOKEN = await ethers.getContractFactory('SpaceToken', {
      signer: owner,
    });

    spaceToken = await SPACE_TOKEN.deploy('ETHERREUM', 'ETH');
    await spaceToken.deployed();

    const CHARITY_DAPP = await ethers.getContractFactory('Charity', {
      signer: owner,
    });

    charity = await CHARITY_DAPP.deploy(
      86400, // Current time + 1 Day
      account2.address,
      spaceToken.address,
    );
    await charity.deployed();

    await spaceToken.connect(owner).mint(owner.address, TOKEN_AMOUNT(10));
    await spaceToken.connect(owner).mint(account1.address, TOKEN_AMOUNT(10));
    await spaceToken.connect(owner).mint(account2.address, TOKEN_AMOUNT(10));
  });

  describe('Run tests', () => {
    async function approve(amount: number) {
      await spaceToken
        .connect(account1)
        .approve(charity.address, TOKEN_AMOUNT(amount));
      await spaceToken
        .connect(account2)
        .approve(charity.address, TOKEN_AMOUNT(amount));
    }

    async function jumpInTime() {
      await network.provider.send('evm_increaseTime', [60 * 60 * 24 + 100]);
      await ethers.provider.send('evm_mine', []);
    }

    it('Should donate successfully', async () => {
      await approve(5);
      await charity.connect(account1).donate(TOKEN_AMOUNT(5));

      expect(await spaceToken.balanceOf(account1.address)).to.be.equal(
        TOKEN_AMOUNT(5),
      );
      expect(await spaceToken.balanceOf(charity.address)).to.be.equal(
        TOKEN_AMOUNT(5),
      );
      expect(await charity.balanceOf(account1.address)).to.be.equal(
        TOKEN_AMOUNT_BN(5).mul(99).div(100),
      );
    });

    it('Should withdraw donation successfully', async () => {
      await approve(5);
      await charity.connect(account1).donate(TOKEN_AMOUNT(5));
      await charity
        .connect(account1)
        .withdrawDonations(TOKEN_AMOUNT_BN(5).mul(99).div(100));

      expect(await spaceToken.balanceOf(account1.address)).to.be.equal(
        TOKEN_AMOUNT_BN(5).add(TOKEN_AMOUNT_BN(5).mul(99).div(100)),
      );
      expect(await spaceToken.balanceOf(charity.address)).to.be.equal(
        TOKEN_AMOUNT_BN(5).div(100),
      );
      expect(await charity.balanceOf(account1.address)).to.be.equal(0);
    });

    it('Should revert on donate since not enough stacked tokens', async () => {
      await approve(5);
      await expect(
        charity.connect(account1).donate(TOKEN_AMOUNT(15)),
      ).to.be.revertedWith(
        'CH: Sender does not have enough stacked tokens to donate',
      );
    });

    it('Should revert on withdraw since exceed amount is bigger than amount', async () => {
      await approve(5);
      await charity.connect(account1).donate(TOKEN_AMOUNT(5));
      expect(
        charity.connect(account1).withdrawDonations(TOKEN_AMOUNT_BN(5)),
      ).to.be.revertedWith(
        'CH: amount to withdraw is more than current donated fund',
      );
    });

    it('Should NOT release amount (BEFORE END_DATE)', async () => {
      await approve(5);
      await charity.connect(account1).donate(TOKEN_AMOUNT(5));
      await expect(charity.releaseFunds()).to.be.revertedWith(
        'Donation end date has not passed',
      );
    });

    it('Should release', async () => {
      await spaceToken
        .connect(owner)
        .approve(charity.address, TOKEN_AMOUNT(10));
      await spaceToken
        .connect(account1)
        .approve(charity.address, TOKEN_AMOUNT(5));
      await charity.connect(owner).donate(TOKEN_AMOUNT(10));
      await charity.connect(account1).donate(TOKEN_AMOUNT(5));

      await jumpInTime();

      const ACCOUNT_2_BALANCE = await spaceToken.balanceOf(account2.address);
      await charity.connect(account1).releaseFunds();

      expect(await spaceToken.balanceOf(owner.address)).to.be.equal(
        TOKEN_AMOUNT_BN(0),
      );
      expect(await spaceToken.balanceOf(account1.address)).to.be.equal(
        TOKEN_AMOUNT_BN(5),
      );
      expect(await spaceToken.balanceOf(account2.address)).to.be.equal(
        TOKEN_AMOUNT_BN(15).mul(99).div(100).add(ACCOUNT_2_BALANCE),
      );
      expect(await spaceToken.balanceOf(charity.address)).to.be.equal(
        TOKEN_AMOUNT_BN(15).div(100),
      );

      await expect(charity.connect(account1).releaseFunds()).to.be.revertedWith(
        'CH: funds already released',
      );
    });

    it('Should revert on donate since end time passed', async () => {
      await jumpInTime();
      await expect(
        charity.connect(account1).donate(TOKEN_AMOUNT(5)),
      ).to.be.revertedWith('CH: donation end date has already passed');
    });

    it('Should revert on withdraw since end time passed', async () => {
      await jumpInTime();
      expect(
        charity.connect(account1).withdrawDonations(TOKEN_AMOUNT_BN(5)),
      ).to.be.revertedWith('CH: donation end date has already passed');
    });
  });
});
