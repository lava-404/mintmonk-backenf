// backend/controllers/googleAuth.js
require('dotenv').config();
const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { getOrCreateAssociatedTokenAccount, transferChecked } = require('@solana/spl-token');
const Users = require('../model/Users');

// --- Solana Setup ---
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// --- Load treasury wallet safely ---
let treasuryWallet;
try {
  const keyArray = JSON.parse(process.env.TREASURY_SECRET_KEY);
  if (!Array.isArray(keyArray) || keyArray.length !== 64) {
    throw new Error("TREASURY_SECRET_KEY must be an array of 64 numbers");
  }
  treasuryWallet = Keypair.fromSecretKey(Uint8Array.from(keyArray));
  console.log("✅ Treasury wallet loaded");
} catch (err) {
  console.error("❌ Failed to load treasury wallet:", err.message);
  process.exit(1);
}

// --- MintMonk Token ---
const MINT_MONK_TOKEN = new PublicKey(process.env.MINT_MONK_TOKEN);

// --- Google Sign-In Handler ---
// --- Google Sign-In Handler ---
const googleSignIn = async (req, res) => {
  const { email, name, image } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    let user = await Users.findOne({ email });

    // If new user, create wallet and mint tokens
    if (!user) {
      const newWallet = Keypair.generate();
      const walletAddress = newWallet.publicKey.toString();

      user = await Users.create({
        email,
        name,
        image,
        wallet: walletAddress,
        secret: Array.from(newWallet.secretKey), // store securely
      });

      console.log("✅ New user created:", email, walletAddress);

      const recipientAta = await getOrCreateAssociatedTokenAccount(
        connection,
        treasuryWallet,
        MINT_MONK_TOKEN,
        newWallet.publicKey
      );

      const treasuryAta = await getOrCreateAssociatedTokenAccount(
        connection,
        treasuryWallet,
        MINT_MONK_TOKEN,
        treasuryWallet.publicKey
      );

      const decimals = 9;
      const amount = BigInt(50) * BigInt(10) ** BigInt(decimals);

      const txSig = await transferChecked(
        connection,
        treasuryWallet,
        treasuryAta.address,
        MINT_MONK_TOKEN,
        recipientAta.address,
        treasuryWallet.publicKey,
        amount,
        decimals
      );

      console.log(`🎉 Sent 50 MintMonk tokens to ${walletAddress}, tx: ${txSig}`);
    }

    // ✅ Ensure fresh user document (so we always have _id)
    user = await Users.findOne({ email });

    // ✅ Return MongoDB _id so frontend can store it
    return res.status(200).json({ 
      message: "SIGNED in WELCOME", 
      wallet: user.wallet,
      userId: user._id.toString()   // 👈 make sure it's string-safe
    });
  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(500).json({ error: err.message });
  }
};


module.exports = { googleSignIn };
