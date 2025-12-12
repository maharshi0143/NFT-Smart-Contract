# NFT Collection Smart Contract

This project implements a secure, ERC-721 compatible NFT smart contract with `Ownable` and `Pausable` features. It includes a comprehensive test suite and is fully containerized for easy evaluation.

## Features

* **ERC-721 Standard:** Full compatibility with NFT marketplaces.
* **Max Supply:** strictly enforced limit on the number of tokens.
* **Access Control:** Only the owner can mint or pause the contract.
* **Gas Optimized:** Uses OpenZeppelin libraries for efficient execution.
* **Metadata:** flexible URI support for IPFS or centralized storage.

## Project Structure

* `contracts/NftCollection.sol`: The Solidity smart contract.
* `test/NftCollection.test.js`: Automated test suite (Deployment, Minting, Transfers, Edge Cases).
* `Dockerfile`: Configuration for the isolated testing environment.

## How to Run (Docker)

The easiest way to verify the contract and run tests is via Docker. This requires no local dependencies other than Docker Desktop.

1.  **Build the Image:**
    ```bash
    docker build -t nft-project .
    ```

2.  **Run the Tests:**
    ```bash
    docker run nft-project
    ```

You should see 8 passing tests and a Gas Usage report.

## How to Run (Local)

If you have Node.js installed, you can also run it locally:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Compile:**
    ```bash
    npx hardhat compile
    ```

3.  **Test:**
    ```bash
    npx hardhat test
    ```