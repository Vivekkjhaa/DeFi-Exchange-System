# DeFi-Exchange-System

A decentralized finance (DeFi) exchange prototype built as a full-stack application leveraging blockchain technology. This project demonstrates core cryptocurrency transaction capabilities within a transparent, secure, and decentralized framework.

## 🌟 Features

* **Secure Wallet Connection:** Seamless integration with MetaMask for secure user authentication and wallet connectivity.
* **Basic Cryptocurrency Transfers:** Allows users to initiate and execute basic transfers of Ether (ETH) or a single ERC-20 token (if implemented) to other blockchain addresses.
* **Immutable Transaction Logging:** All transaction details are immutably recorded on an Ethereum-compatible blockchain via a deployed smart contract.
* **Comprehensive Transaction History:** Users can view a detailed history of all past transactions directly from the blockchain on a dedicated page.
* **Interactive Emoji Feature:** A unique visual enhancement where each transaction displayed in the history includes an interactive emoji, dynamically selected based on a keyword provided by the sender during the transaction.
* **User-Friendly Interface:** An intuitive web interface built with React, featuring dedicated landing, transaction, and history pages.

## 🚀 Technologies Used

* **Solidity:** For developing the immutable and secure smart contracts.
* **Ethereum Blockchain:** The underlying decentralized network for transaction processing and data storage (e.g., Goerli, Sepolia, or Hardhat Network for development).
* **React.js:** For building the dynamic and responsive front-end user interface.
* **Web3.js / Ethers.js:** JavaScript libraries for connecting the front-end to the blockchain and interacting with smart contracts.
* **MetaMask:** A browser extension wallet used for user authentication and transaction signing.
* **Hardhat:** Ethereum development environment for compiling, deploying, and testing smart contracts locally.
* **Node.js & npm:** Runtime environment and package manager for the React application and development tools.

## 🛠️ Getting Started

Follow these instructions to set up and run the project locally on your machine.

### Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js & npm:** [Download Node.js](https://nodejs.org/) (npm is included with Node.js)
* **MetaMask:** Install the [MetaMask browser extension](https://metamask.io/download/) and set up your wallet. Configure it to connect to your chosen Ethereum testnet (e.g., Sepolia or Goerli) or a local Hardhat network.
* **Git:** [Download Git](https://git-scm.com/downloads)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YourUsername/DeFi-Exchange-System.git](https://github.com/YourUsername/DeFi-Exchange-System.git)
    cd DeFi-Exchange-System
    ```
2.  **Install Smart Contract Dependencies:**
    Navigate into the smart contract directory (assuming it's named `smart-contract` or `hardhat-project`).
    ```bash
    cd smart-contract # or your actual smart contract directory name
    npm install
    ```
3.  **Install Front-end Dependencies:**
    Navigate into the front-end application directory (assuming it's named `client` or `frontend`).
    ```bash
    cd ../client # or your actual frontend directory name
    npm install
    ```

### Running the Application

1.  **Start the Local Blockchain (if using Hardhat Network):**
    If you're testing locally, start the Hardhat network in a separate terminal:
    ```bash
    cd smart-contract # or your smart contract directory
    npx hardhat node
    ```
    This will provide you with local accounts and a network URL.

2.  **Deploy the Smart Contract:**
    In another terminal, deploy your smart contract to your chosen network (local Hardhat or a public testnet). Ensure your `hardhat.config.js` is correctly configured for your deployment target.
    ```bash
    cd smart-contract # or your smart contract directory
    npx hardhat run scripts/deploy.js --network localhost # or --network sepolia, etc.
    ```
    Note down the deployed contract address. You'll need to update this in your front-end configuration.

3.  **Configure Front-end with Contract Address:**
    Open your front-end project's configuration file (e.g., `client/src/config.js` or `client/src/constants.js`) and update the smart contract address with the one obtained from the deployment step. You may also need to update the ABI (Application Binary Interface) if it's stored separately.

4.  **Start the Front-end Application:**
    ```bash
    cd client # or your frontend directory
    npm start
    ```
    This will open the application in your browser (usually `http://localhost:3000`).

## 💡 Usage

1.  **Connect Wallet:** On the landing page, click the "Connect Wallet" button and approve the connection via MetaMask.
2.  **View Balance:** Your connected wallet's balance will be displayed.
3.  **Make a Transaction:** Navigate to the "Transaction" page, enter the recipient address, amount, and an optional message/keyword. Confirm the transaction via MetaMask.
4.  **View History:** Go to the "History" page to see your recorded transactions, each with its unique interactive emoji.

## 🧪 Testing

The project includes unit and integration tests for the smart contract.

To run smart contract tests:
```bash
cd smart-contract # or your smart contract directory
npx hardhat test
