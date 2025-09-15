const Users = require("../model/Users");
const Session = require("../model/Session");
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
    if (!MINT_MONK_TOKEN || !ownerPubkey) return 0;
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
    return Number(bal.value.uiAmount || 0);
  } catch (e) {
    return 0;
  }
};

const getUserSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id, { name: 1, email: 1, image: 1, wallet: 1 }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const sessions = await Session.find({ userId: id }).lean();
    const completed = sessions.filter((s) => s.status === "completed").length;
    const rewardsTotal = sessions.reduce((acc, s) => acc + (s.rewards || 0), 0);

    const balance = await getTokenBalance(user.wallet);

    return res.json({
      name: user.name || user.email,
      email: user.email,
      image: user.image || null,
      wallet: user.wallet || null,
      tokenBalance: balance,
      sessionsCompleted: completed,
      totalRewards: rewardsTotal,
    });
  } catch (err) {
    console.error("getUserSummary error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getUserSummary };
