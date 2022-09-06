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
$ npx hardhat  verify --network fantomtest 0xF1fDaC2702bF7C7a11Bba80798Ead3F89c113632  --constructor-args ./scripts/arguments-reserve.js

## Deployed Addresses
ContractRegistryV1 deployed to 0x371C080a236f7C4A5EC1F21a6869D84A8aeEd184
Domain deployed to 0x3A92Ad8A7aAe4dde1027FE70b60708715DF4211f
EVMReverseResolverV1 deployed to 0x2091Fd6B703bC948B2caAA467448C0F2C49Bf3e2
LeasingAgentV1 deployed to 0x6DBa8e01644B2f2Fd5768652D44B936eee75B3b5
PublicResolverV1 deployed to 0x2e884b7Bba3D737AD9a993F5BBff18406832cD35
RainbowTableV1 deployed to 0x00218bBE553c2BDB177AfF9622704F64aE52169E
ResolverRegistryV1 deployed to 0xFecc65EEa5CAd2d994b71f7145ae205B7D3E4bf5
ReverseResolverRegistryV1 deployed to 0xC569D541B8c908DEC24bd02baDA74078C6A58ec1
Poseidon Contract Deployed to 0xe6EA8Cc5b35e28E669264c967b4d4Ef524B27B06

NamespaceV1 deployed to 0xF1fDaC2702bF7C7a11Bba80798Ead3F89c113632
ConstraintsVerifier deployed to 0x2116B4FfD4048208a7e1b094582f8e32e090a888
PricingOracleV1 deployed to 0x92FEfEf8583A72b9f05DDA072e0bCC738a76E92E

## Verified contract
https://testnet.ftmscan.com/address/0x3A92Ad8A7aAe4dde1027FE70b60708715DF4211f#code
https://testnet.ftmscan.com/address/0x2091Fd6B703bC948B2caAA467448C0F2C49Bf3e2#code
https://testnet.ftmscan.com/address/0x6DBa8e01644B2f2Fd5768652D44B936eee75B3b5#code
https://testnet.ftmscan.com/address/0x2e884b7Bba3D737AD9a993F5BBff18406832cD35#code
https://testnet.ftmscan.com/address/0x00218bBE553c2BDB177AfF9622704F64aE52169E#code
https://testnet.ftmscan.com/address/0xFecc65EEa5CAd2d994b71f7145ae205B7D3E4bf5#code
https://testnet.ftmscan.com/address/0xC569D541B8c908DEC24bd02baDA74078C6A58ec1#code
https://testnet.ftmscan.com/address/0x92FEfEf8583A72b9f05DDA072e0bCC738a76E92E#code
https://testnet.ftmscan.com/address/0xf1fdac2702bf7c7a11bba80798ead3f89c113632#code
