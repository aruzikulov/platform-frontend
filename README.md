# platform-frontend

[![CircleCI](https://circleci.com/gh/Neufund/platform-frontend.svg?style=svg)](https://circleci.com/gh/Neufund/platform-frontend)
[![codecov](https://codecov.io/gh/Neufund/platform-frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/Neufund/platform-frontend)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Project dependencies Status](https://david-dm.org/Neufund/platform-frontend/status.svg)](https://david-dm.org/Neufund/platform-frontend)
[![Project devDependencies Status](https://david-dm.org/Neufund/platform-frontend/dev-status.svg)](https://david-dm.org/Neufund/platform-frontend?type=dev)

## Running project

### Prerequisites

- running ethereum node on port `8545`. To start local instance just run `yarn ganache`
- running `signature_auth_api` on port `5000`

```sh
yarn
yarn ganache   # in separate window. You need to upload neufund contracts. Keep on reading.
yarn start
```

#### Using external backend

Set NF_REMOTE_BACKEND_PROXY_ROOT variable in your .env file and run `yarn start:remote` to connect
to remote backend.

#### Running production build locally

```sh
yarn build:prod # build production bundle

sh ./scripts/prod-like-srv.sh # run the server
```

#### Uploading contracts

To upload modified version of Neufund Smartcontract that allows for easier blockchain development
you need to checkout
[`kk/frontend-platform-fixtures`](https://github.com/Neufund/platform-contracts/pull/55) branch and
run `yarn fixture`.

Typechain (it generates typed wrappers on smartcontracts) runs automatically after doing `yarn` to
trigger it manually do: `yarn generate:contracts`.

## Running tests

```
yarn test # checks formatting, runs linter and tests
```

### Fix all autofixable errors and run tests

```
yarn test:fix
```

### Production build

```
yarn build:prod
```

### Extracting translations from the app

```
yarn intl:extract
```

[Read more](./docs/working-with-intl.md)

### Update contract artifacts submodule

If you need to push the contract artifacts to the newest version yourself, then run.

```
yarn update-contract-artifacts
```

then commit the submodules change. It is important to commit before you run yarn, since the yarn
prepare script will revert uncommited changes to git submodules, and repin them to the local
version.

```
yarn
```

If somebody else committed a new version of the submodules, just run yarn, and everything will be
updated

### Docs

- [Component Development Guidelines](./docs/component-development-guidelines.md)
- [React Guidelines](./docs/react-guidelines.md)
- [Testing production build](./docs/testing-prod-build.md)
- [Working with Intl](./docs/working-with-intl.md)
- [Feature flags](./docs/feature-flags.md)
