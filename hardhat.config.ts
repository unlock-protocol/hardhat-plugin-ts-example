import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "@unlock-protocol/hardhat-plugin";
const { constants } = require("ethers");

task('lock:info', "Prints some info about a lock")
  .addParam('lockAddress', "The lock address")
  .setAction(async ({ lockAddress }, { ethers, unlock }) => {
    
    if (!lockAddress) {
      throw new Error('LOCK BALANCE > Missing lock address.')
    }

    // get lock instance
    const lock = await unlock.getLockContract(lockAddress)

    // fetch potential ERC20 token address
    const tokenAddress = await lock.tokenAddress()
    const maxNumberOfKeys = ethers.BigNumber.from(await lock.maxNumberOfKeys())
    const expirationDuration = ethers.BigNumber.from(await lock.expirationDuration())
    
    console.log(
      `LOCK \n`,
      ` - name: '${await lock.name()}' \n`,
      ` - address: ${lock.address} \n`,
      ` - price: ${ethers.utils.formatEther(ethers.BigNumber.from(await lock.keyPrice())) } ETH \n`,
      ` - duration: ${expirationDuration.eq(constants.MaxUint256) ? 'permanent' : expirationDuration.toNumber() / 60 / 60 /24} days \n`,
      ` - keys: ${await lock.totalSupply()} / ${maxNumberOfKeys.eq(constants.MaxUint256) ? '∞' : maxNumberOfKeys.toString() } \n`,
      ` - currency: ${tokenAddress === ethers.constants.AddressZero ? 'ETH' : tokenAddress } \n`,
      ` - balance: ${ethers.utils.formatUnits(await ethers.provider.getBalance(lock.address), 18)} \n`,
      ` - symbol: ${await lock.symbol()} \n`,
      ` - version: ${await lock.publicLockVersion()}`
    )

  })

const config: HardhatUserConfig = {
  solidity: "0.8.9",
};

export default config;
