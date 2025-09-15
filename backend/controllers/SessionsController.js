const mongoose = require("mongoose");
const Session = require("../model/Session.js");
const Users = require("../model/Users.js");
require('dotenv').config();
const { Connection, PublicKey, Keypair, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { getOrCreateAssociatedTokenAccount, transferChecked, getMint, TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, mintTo } = require('@solana/spl-token');

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
let treasuryWallet;
try {
  const keyArray = JSON.parse(process.env.TREASURY_SECRET_KEY);
  treasuryWallet = Keypair.fromSecretKey(Uint8Array.from(keyArray));
} catch (e) {
  console.error('TREASURY_SECRET_KEY missing/invalid', e.message);
}
const MINT_MONK_TOKEN = process.env.MINT_MONK_TOKEN ? new PublicKey(process.env.MINT_MONK_TOKEN) : null;
let MINT_DECIMALS = null;
let MINT_PROGRAM_ID = null;
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
  MINT_PROGRAM_ID = info.owner; // could be TOKEN_PROGRAM_ID or TOKEN_2022_PROGRAM_ID
  return MINT_PROGRAM_ID;
}
async function ensureMintDecimals() {
  if (!MINT_MONK_TOKEN) throw new Error("Token config missing");
  if (MINT_DECIMALS !== null) return MINT_DECIMALS;
  const programId = await detectMintProgramId();
  const mintInfo = await getMint(connection, MINT_MONK_TOKEN, undefined, programId);
  MINT_DECIMALS = mintInfo.decimals;
  return MINT_DECIMALS;
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
  console.log("ensureAta", {
    owner: owner.toBase58(),
    ata: ata.toBase58(),
    exists: !!info,
    programId: programId.toBase58(),
  });
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
    const sig = await sendAndConfirmTransaction(connection, tx, [payer]);
    console.log("ATA_CREATED", { ata: ata.toBase58(), sig });
  }
  return { address: ata };
}
async function getUiBalanceOrZero(pubkey) {
  try {
    const bal = await connection.getTokenAccountBalance(pubkey);
    return bal.value.uiAmount || 0;
  } catch (_) {
    return 0;
  }
}

// Store a new session
const StoreSession = async (req, res) => {
  try {
    const { userId, task, duration, stake, breaks, boost } = req.body;

    if (!userId || !task || !duration) {
      return res.status(400).json({ error: "Missing required fields" }); 
    }

    const plannedDuration = Number(duration) * 60;
    if (isNaN(plannedDuration) || plannedDuration <= 0) {
      return res.status(400).json({ error: "Invalid duration" });
    }

    const stakeNum = Number(stake) || 0;
    const newSession = await Session.create({
      userId: new mongoose.Types.ObjectId(userId),
      topic: task,
      plannedDuration,
      stake: stakeNum,
      breaks: breaks || "No Breaks",
      boost: boost || "None",
      status: "in progress",
      focusedTime: 0,
    });

    if (stakeNum > 0) {
      if (!MINT_MONK_TOKEN || !treasuryWallet) {
        return res.status(500).json({ error: "Token config missing" });
      }

      const user = await Users.findById(userId).select('+secret');
      if (!user || !user.secret || !Array.isArray(user.secret)) {
        return res.status(400).json({ error: "User wallet not found" });
      }
      const userKeypair = Keypair.fromSecretKey(Uint8Array.from(user.secret));

      const programId = await detectMintProgramId();

      // Ensure user's ATA exists
      const userAta = await ensureAta(treasuryWallet, userKeypair.publicKey, programId);

      // Auto-airdrop 100 MM if user has 0 balance and mintAuthority is set
      let userBalance = await getUiBalanceOrZero(userAta.address);
      if (userBalance === 0 && mintAuthority) {
        const decimals = await ensureMintDecimals();
        const grant = BigInt(100) * BigInt(10) ** BigInt(decimals);
        await mintTo(
          connection,
          treasuryWallet,
          MINT_MONK_TOKEN,
          userAta.address,
          mintAuthority,
          grant,
          [],
          undefined,
          programId
        );
        userBalance = await getUiBalanceOrZero(userAta.address);
      }

      const treasuryAta = await ensureAta(treasuryWallet, treasuryWallet.publicKey, programId);
      const decimals = await ensureMintDecimals();
      const amount = BigInt(stakeNum) * BigInt(10) ** BigInt(decimals);

      if (userBalance < stakeNum) {
        return res.status(400).json({ error: "Insufficient token balance for stake" });
      }

      await transferChecked(
        connection,
        treasuryWallet,
        userAta.address,
        MINT_MONK_TOKEN,
        treasuryAta.address,
        userKeypair,
        amount,
        decimals,
        undefined,
        undefined,
        programId
      );
    }

    return res.status(201).json({
      message: "Session created successfully",
      sessionId: newSession._id,
    });
  } catch (err) {
    console.error("❌ StoreSession error:", err);
    console.log("Treasury Public Key:", treasuryWallet ? treasuryWallet.publicKey.toBase58() : "undefined");
    return res.status(500).json({ error: err.message });
  }
};

// Fetch all user sessions
const getUserSessions = async (req, res) => {
  try {
    const { userId } = req.params;

    const sessions = await Session.find({ userId }).lean();

    const formatted = sessions.map((s) => {
      // Format planned duration
      const formattedDuration =
        s.plannedDuration >= 3600
          ? `${Math.floor(s.plannedDuration / 3600)} hr ${Math.floor(
              (s.plannedDuration % 3600) / 60
            )} min`
          : `${Math.floor(s.plannedDuration / 60)} min`;

      // Time focused column
      let timeFocused = "-";
      if (s.status === "completed" || s.status === "aborted") {
        const totalSec = s.focusedTime || 0;
        if (totalSec >= 3600) {
          timeFocused = `${Math.floor(totalSec / 3600)} hr ${Math.floor(
            (totalSec % 3600) / 60
          )} min`;
        } else {
          const mins = Math.floor(totalSec / 60);
          const secs = totalSec % 60;
          timeFocused = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
        }
      }

      return {
        _id: s._id,
        topic: s.topic,
        duration: formattedDuration,
        stake: `${s.stake} coins`,
        rewards: `${s.rewards || 0} coins`,
        status: s.status.charAt(0).toUpperCase() + s.status.slice(1),
        timeFocused, // 👈 send to frontend
      };
    });

    return res.json(formatted);
  } catch (err) {
    console.error("getUserSessions error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Update a session (status, focusedTime, rewards)
const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, focusedTime, rewards } = req.body;

    const existing = await Session.findById(id);
    if (!existing) return res.status(404).json({ error: "Session not found" });

    const updates = {};
    if (status) updates.status = status; // expect "completed" | "aborted" | "in progress"
    if (typeof focusedTime === "number") updates.focusedTime = focusedTime;

    let computedRewards = typeof rewards === "number" ? rewards : undefined;
    if (computedRewards === undefined && status === "completed") {
      computedRewards = Number(existing.stake || 0) * 2; // default rule
    }
    if (typeof computedRewards === "number") updates.rewards = computedRewards;

    // If completed, pay user: transfer from treasury to user
    if (status === "completed" && (computedRewards || 0) > 0) {
      if (!MINT_MONK_TOKEN || !treasuryWallet) {
        return res.status(500).json({ error: "Token config missing" });
      }
      const user = await Users.findById(existing.userId).select('+secret');
      if (!user || !user.secret) {
        return res.status(400).json({ error: "User wallet not found" });
      }
      const userKeypair = Keypair.fromSecretKey(Uint8Array.from(user.secret));

      // Create/get user's associated token account for rewards
      const programId = await detectMintProgramId();
      let userAta;
      try {
        userAta = await ensureAta(treasuryWallet, userKeypair.publicKey, programId);
      } catch (e) {
        console.error("REWARD_USER_ATA_ERROR", e);
        return res.status(500).json({ error: "Failed to create/get user ATA (rewards)", details: String(e?.message || e) });
      }

      // Create/get treasury's associated token account
      let treasuryAta;
      try {
        treasuryAta = await ensureAta(treasuryWallet, treasuryWallet.publicKey, programId);
      } catch (e) {
        console.error("REWARD_TREASURY_ATA_ERROR", e);
        return res.status(500).json({ error: "Failed to create/get treasury ATA (rewards)", details: String(e?.message || e) });
      }

      const decimals = await ensureMintDecimals();
      const amount = BigInt(computedRewards) * BigInt(10) ** BigInt(decimals);

      // Check if treasury has enough balance before transferring rewards
      const treasuryUi = await getUiBalanceOrZero(treasuryAta.address);
      if (treasuryUi < computedRewards) {
        if (mintAuthority) {
          const decimals = await ensureMintDecimals();
          const need = BigInt(computedRewards) * BigInt(10) ** BigInt(decimals);
          await mintTo(
            connection,
            treasuryWallet,
            MINT_MONK_TOKEN,
            treasuryAta.address,
            mintAuthority,
            need,
            [],
            undefined,
            programId
          );
        } else {
          return res.status(400).json({ error: "Insufficient treasury balance for rewards and no mint authority configured" });
        }
      }

      // Transfer from treasury → user (treasury pays since it's the reward)
      try {
        await transferChecked(
          connection,
          treasuryWallet,          // payer of transaction (treasury pays)
          treasuryAta.address,     // source ATA (treasury)
          MINT_MONK_TOKEN,         // mint
          userAta.address,         // destination ATA (user)
          treasuryWallet,          // owner of source (treasury) as signer
          amount,
          decimals,
          undefined,
          undefined,
          programId
        );
      } catch (e) {
        console.error("REWARD_TRANSFER_ERROR", e);
        return res.status(500).json({ error: "Failed to transfer rewards", details: String(e?.message || e) });
      }
    }

    const updated = await Session.findByIdAndUpdate(id, updates, { new: true });

    return res.json({ success: true, session: updated });
  } catch (err) {
    console.error("updateSession error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { StoreSession, getUserSessions, updateSession };
