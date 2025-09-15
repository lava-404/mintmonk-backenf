// backend/controllers/googleAuth.js
require('dotenv').config();
const { Connection, PublicKey, Keypair, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { getOrCreateAssociatedTokenAccount, transferChecked, getMint, TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } = require('@solana/spl-token');
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
let MINT_DECIMALS = null;
let MINT_PROGRAM_ID = null;

// Optional mint authority for auto-mint on devnet
let mintAuthority = null;
try {
  if (process.env.MINT_AUTHORITY_SECRET_KEY) {
    const arr = JSON.parse(process.env.MINT_AUTHORITY_SECRET_KEY);
    if (Array.isArray(arr) && arr.length === 64) {
      mintAuthority = Keypair.fromSecretKey(Uint8Array.from(arr));
      console.log("✅ Mint authority loaded");
    }
  }
} catch (_) {}
async function detectMintProgramId() {
  if (MINT_PROGRAM_ID) return MINT_PROGRAM_ID;
  const info = await connection.getAccountInfo(MINT_MONK_TOKEN);
  if (!info) throw new Error("Mint account not found on devnet");
  MINT_PROGRAM_ID = info.owner;
  return MINT_PROGRAM_ID;
}
async function ensureAta(payer, owner, programId) {
  const ata = await getAssociatedTokenAddress(
    MINT_MONK_TOKEN,
    owner,
    false,
    programId,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const info = await connection.getAccountInfo(ata);
  if (!info) {
    const ix = createAssociatedTokenAccountInstruction(
      payer.publicKey,
      ata,
      owner,
      MINT_MONK_TOKEN,
      programId,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    const tx = new Transaction().add(ix);
    await sendAndConfirmTransaction(connection, tx, [payer]);
  }
  return { address: ata };
}
async function ensureMintDecimals() {
  if (MINT_DECIMALS !== null) return MINT_DECIMALS;
  const programId = await detectMintProgramId();
  const mintInfo = await getMint(connection, MINT_MONK_TOKEN, undefined, programId);
  MINT_DECIMALS = mintInfo.decimals;
  return MINT_DECIMALS;
}

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

      const programId = await detectMintProgramId();
      const recipientAta = await ensureAta(treasuryWallet, newWallet.publicKey, programId);

      const treasuryAta = await ensureAta(treasuryWallet, treasuryWallet.publicKey, programId);

      const decimals = await ensureMintDecimals();
      const amount = BigInt(100) * BigInt(10) ** BigInt(decimals);

      // Ensure treasury has at least 100 tokens; if not and mintAuthority present, mint supply
      const bal = await connection.getTokenAccountBalance(treasuryAta.address).catch(() => null);
      const ui = bal?.value?.uiAmount || 0;
      if (ui < 100 && mintAuthority) {
        await require('@solana/spl-token').mintTo(
          connection,
          treasuryWallet, // payer
          MINT_MONK_TOKEN,
          treasuryAta.address,
          mintAuthority,
          amount,
          [],
          undefined,
          programId
        );
      }

      const txSig = await transferChecked(
        connection,
        treasuryWallet,
        treasuryAta.address,
        MINT_MONK_TOKEN,
        recipientAta.address,
        treasuryWallet,
        amount,
        decimals,
        undefined,
        undefined,
        programId
      );

      console.log(`🎉 Sent 100 MintMonk tokens to ${walletAddress}, tx: ${txSig}`);
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
