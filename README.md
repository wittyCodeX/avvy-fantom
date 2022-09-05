# Domain Name Service on Fantom Network

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy-all.js --network fantomtest
```
#Verify contract
Verify Domain contract:
$ npx hardhat  verify  --contract contracts/Domain.sol:Domain --network fantomtest 0x3A92Ad8A7aAe4dde1027FE70b60708715DF4211f  --constructor-args ./scripts/arguments.js
Verify LeasingAgent contract:
$ npx hardhat  verify --network fantomtest 0x6DBa8e01644B2f2Fd5768652D44B936eee75B3b5  --constructor-args ./scripts/arguments-leasing.js

Verify other reserve contracts:
$ npx hardhat  verify --network fantomtest 0xC569D541B8c908DEC24bd02baDA74078C6A58ec1  --constructor-args ./scripts/arguments-reserve.js

## Deployed Addresses
ContractRegistryV1 deployed to 0x371C080a236f7C4A5EC1F21a6869D84A8aeEd184
Domain deployed to 0x3A92Ad8A7aAe4dde1027FE70b60708715DF4211f
EVMReverseResolverV1 deployed to 0x2091Fd6B703bC948B2caAA467448C0F2C49Bf3e2
LeasingAgentV1 deployed to 0x6DBa8e01644B2f2Fd5768652D44B936eee75B3b5
PublicResolverV1 deployed to 0x2e884b7Bba3D737AD9a993F5BBff18406832cD35
RainbowTableV1 deployed to 0x00218bBE553c2BDB177AfF9622704F64aE52169E
ResolverRegistryV1 deployed to 0xFecc65EEa5CAd2d994b71f7145ae205B7D3E4bf5
ReverseResolverRegistryV1 deployed to 0xC569D541B8c908DEC24bd02baDA74078C6A58ec1


## Verified contract
https://testnet.ftmscan.com/address/0x3A92Ad8A7aAe4dde1027FE70b60708715DF4211f#code
https://testnet.ftmscan.com/address/0x2091Fd6B703bC948B2caAA467448C0F2C49Bf3e2#code
https://testnet.ftmscan.com/address/0x6DBa8e01644B2f2Fd5768652D44B936eee75B3b5#code
https://testnet.ftmscan.com/address/0x2e884b7Bba3D737AD9a993F5BBff18406832cD35#code
https://testnet.ftmscan.com/address/0x00218bBE553c2BDB177AfF9622704F64aE52169E#code
https://testnet.ftmscan.com/address/0xFecc65EEa5CAd2d994b71f7145ae205B7D3E4bf5#code
https://testnet.ftmscan.com/address/0xC569D541B8c908DEC24bd02baDA74078C6A58ec1#code