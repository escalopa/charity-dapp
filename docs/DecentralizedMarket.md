# Solidity API

## DecentralizedMarketplace

_DMarket is built for
   1. Mint App (token)
   2. Push new version of for each app
   3. Set app attributes (AppType, NetworkType, CategoryType)_

### appIds

```solidity
struct Counters.Counter appIds
```

### apps

```solidity
mapping(uint256 => struct IDecentralizedMarketplace.App) apps
```

Maps from appId(minted token id) to App sturct that contains all app data

### onlyAppOwners

```solidity
modifier onlyAppOwners(uint256 appId)
```

A modifier to check whether the caller is the app owner or approved by the owner

| Name | Type | Description |
| ---- | ---- | ----------- |
| appId | uint256 | The minted app id (created when app is minted) |

### constructor

```solidity
constructor() public
```

### mintApp

```solidity
function mintApp(string appName) external
```

_See {IDecentralizedMarketplace-mintApp}

Emits {AppCreated}_

### setAppType

```solidity
function setAppType(uint256 appId, enum IDecentralizedMarketplace.AppType _appType) external virtual
```

_See {IDecentralizedMarketplace-setAppType}_

### setNetworkType

```solidity
function setNetworkType(uint256 appId, enum IDecentralizedMarketplace.NetworkType _networkType) external virtual
```

_See {IDecentralizedMarketplace-setNetworkType}_

### setCategoryType

```solidity
function setCategoryType(uint256 appId, enum IDecentralizedMarketplace.CategoryType _categoryType) external virtual
```

_See {IDecentralizedMarketplace-setCategoryType}_

### getApp

```solidity
function getApp(uint256 appId) external view returns (string name, uint8, uint8, uint8)
```

_See {IDecentralizedMarketplace-getApp}_

### getVersions

```solidity
function getVersions(uint256 appId) external view returns (bytes32[], bytes32[])
```

_See {IDecentralizedMarketplace-getVersions}_

### pushNewVersion

```solidity
function pushNewVersion(uint256 appId, bytes32 newRootHash, bytes32 newMetadataHash) public
```

_See {IDecentralizedMarketplace-pushNewVersion}

Emits {NewVersion}_

