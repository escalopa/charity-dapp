# Solidity API

## IDecentralizedMarketplace

### AppCreated

```solidity
event AppCreated(uint256 appId, address owner)
```

Emittied when a new a token is created(mintted)

### NewVersion

```solidity
event NewVersion(uint256 appId, bytes32 root, bytes32 metadata)
```

Emittied when a new version is released of a specific application

### AppType

```solidity
enum AppType {
  NONE,
  DAPP,
  EAPP
}
```

### NetworkType

```solidity
enum NetworkType {
  NONE,
  ETH,
  POLYGON
}
```

### CategoryType

```solidity
enum CategoryType {
  NONE,
  GAME,
  DeFi
}
```

### AppVersion

```solidity
struct AppVersion {
  bytes32 root;
  bytes32 metadata;
}
```

### App

```solidity
struct App {
  string name;
  struct IDecentralizedMarketplace.AppVersion[] versions;
  enum IDecentralizedMarketplace.AppType appType;
  enum IDecentralizedMarketplace.NetworkType networkType;
  enum IDecentralizedMarketplace.CategoryType categoryType;
}
```

### mintApp

```solidity
function mintApp(string appName) external
```

Create a new App(NFT token)

| Name | Type | Description |
| ---- | ---- | ----------- |
| appName | string | Name of the application that will be mintted |

### pushNewVersion

```solidity
function pushNewVersion(uint256 appId, bytes32 newRootHash, bytes32 newMetadataHash) external
```

Pushes a new version of the application to the versions list

| Name | Type | Description |
| ---- | ---- | ----------- |
| appId | uint256 | application id that |
| newRootHash | bytes32 | application sotrage hash |
| newMetadataHash | bytes32 | application metadata.json file hash |

### setAppType

```solidity
function setAppType(uint256 appId, enum IDecentralizedMarketplace.AppType _appType) external
```

Set applicatino type by AppType

_This function is NOT recallable, once called can't be called again
Will be used in the future for filtering_

| Name | Type | Description |
| ---- | ---- | ----------- |
| appId | uint256 |  |
| _appType | enum IDecentralizedMarketplace.AppType | enum index |

### setNetworkType

```solidity
function setNetworkType(uint256 appId, enum IDecentralizedMarketplace.NetworkType _networkType) external
```

Set networktype to any of the NetworkType enum elements

_This function is NOT recallable, once called can't be called again
Will be used in the future for filtering_

| Name | Type | Description |
| ---- | ---- | ----------- |
| appId | uint256 |  |
| _networkType | enum IDecentralizedMarketplace.NetworkType | enum index |

### setCategoryType

```solidity
function setCategoryType(uint256 appId, enum IDecentralizedMarketplace.CategoryType _categoryType) external
```

Set app category (UNCHANGABLE)

_This function is NOT recallable, once called can't be called again,
Will be used in the future for filtering_

| Name | Type | Description |
| ---- | ---- | ----------- |
| appId | uint256 |  |
| _categoryType | enum IDecentralizedMarketplace.CategoryType | enum index |

### getApp

```solidity
function getApp(uint256 appId) external view returns (string name, uint8 appType, uint8 networkType, uint8 categoryType)
```

Get application data by tokenId

| Name | Type | Description |
| ---- | ---- | ----------- |
| appId | uint256 | Id of minted application(tokenId) |

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | string | application name () |
| appType | uint8 | enum index of AppType enum |
| networkType | uint8 | enum index of NetworkType enum |
| categoryType | uint8 | enum index of CategoryType enum |

### getVersions

```solidity
function getVersions(uint256 appId) external view returns (bytes32[] roots, bytes32[] metadata)
```

Get all application root & metadata hashes

| Name | Type | Description |
| ---- | ---- | ----------- |
| roots | bytes32[] | A list of all root hashes pointing on the storage location |
| metadata | bytes32[] | A list of all metadata hashes which specifies the structure of the files |

