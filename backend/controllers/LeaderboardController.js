const Users = require("../model/Users");
require("dotenv").config();
const { Connection, PublicKey } = require("@solana/web3.js");
const { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } = require("@solana/spl-token");

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const MINT_MONK_TOKEN = process.env.MINT_MONK_TOKEN ? new PublicKey(process.env.MINT_MONK_TOKEN) : null;
let MINT_PROGRAM_ID = null;
async function detectMintProgramId() {
  if (!MINT_MONK_TOKEN) return null;
  if (MINT_PROGRAM_ID) return MINT_PROGRAM_ID;
  const info = await connection.getAccountInfo(MINT_MONK_TOKEN);
  if (!info) return null;
  MINT_PROGRAM_ID = info.owner;
  return MINT_PROGRAM_ID;
}

const getTokenBalance = async (ownerPubkey) => {
  try {
    if (!MINT_MONK_TOKEN) return 0;
    const programId = await detectMintProgramId();
    const ata = await getAssociatedTokenAddress(
      MINT_MONK_TOKEN,
      new PublicKey(ownerPubkey),
      false,
      programId,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    const bal = await connection.getTokenAccountBalance(ata).catch(() => null);
    if (!bal || !bal.value) return 0;
    const ui = bal.value.uiAmount;
    return Number(ui || 0);
  } catch (e) {
    return 0;
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const users = await Users.find({}, { name: 1, email: 1, wallet: 1 }).lean();
    if (!users || users.length === 0) return res.json([]);

    const withBalances = await Promise.all(
      users.map(async (u) => ({
        _id: u._id,
        name: u.name || u.email || "Unknown",
        email: u.email,
        wallet: u.wallet,
        balance: u.wallet ? await getTokenBalance(u.wallet) : 0,
      }))
    );

    withBalances.sort((a, b) => b.balance - a.balance);

    return res.json(withBalances);
  } catch (err) {
    console.error("getLeaderboard error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getLeaderboard };
