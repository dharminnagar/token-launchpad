import {
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  ExtensionType,
  getAssociatedTokenAddressSync,
  getMintLen,
  LENGTH_SIZE,
  MINT_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useRef } from "react";

export function TokenLaunchpad() {
  const nameRef = useRef();
  const symbolRef = useRef();
  const imageRef = useRef();
  const initialSupplyRef = useRef();

  const { connection } = useConnection();
  const wallet = useWallet();

  async function createToken() {
    if (!wallet || !wallet.publicKey) {
      return;
    }

    const mintKeypair = Keypair.generate();

    const name = nameRef.current;
    const symbol = symbolRef.current;
    const image = imageRef.current;
    const initialSupply = initialSupplyRef.current;

    if (!name || !symbol || !image || !initialSupply) {
      return;
    }

    const metadata = {
      mint: mintKeypair.publicKey,
      name: name,
      symbol: symbol,
      uri: image,
      additionalMetadata: [],
    };

    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataLen
    );

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey!,
        newAccountPubkey: mintKeypair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeMetadataPointerInstruction(
        mintKeypair.publicKey,
        wallet.publicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        9,
        wallet.publicKey!,
        null,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        mint: mintKeypair.publicKey,
        metadata: mintKeypair.publicKey,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
        mintAuthority: wallet.publicKey!,
        updateAuthority: wallet.publicKey!,
      })
    );

    transaction.feePayer = wallet.publicKey!;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    transaction.partialSign(mintKeypair);

    await wallet.sendTransaction(transaction, connection);

    console.log(name, symbol, image, initialSupply);

    console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);
    const associatedToken = getAssociatedTokenAddressSync(
      mintKeypair.publicKey,
      wallet.publicKey!,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    console.log(associatedToken.toBase58());

    // Create Token Account
    const createAccountTransaction = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey!,
        associatedToken,
        wallet.publicKey!,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      )
    );

    await wallet.sendTransaction(createAccountTransaction, connection);

    // Mint tokens
    const mintTransaction = new Transaction().add(
      createMintToInstruction(
        mintKeypair.publicKey,
        associatedToken,
        wallet.publicKey!,
        1000000000,
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );

    await wallet.sendTransaction(mintTransaction, connection);

    console.log("Tokens minted");
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4 text-white">
        Solana Token Launchpad
      </h1>
      <Input
        type="text"
        placeholder="Name"
        onChange={(e) => (nameRef.current = e.target.value)}
      />
      <Input
        type="text"
        placeholder="Symbol"
        onChange={(e) => (symbolRef.current = e.target.value)}
      />
      <Input
        type="text"
        placeholder="Image URL"
        onChange={(e) => (imageRef.current = e.target.value)}
      />
      <Input
        type="text"
        placeholder="Initial Supply"
        onChange={(e) => (initialSupplyRef.current = e.target.value)}
      />
      <button
        className="mt-4 p-2 bg-amber-600 active:bg-amber-700 text-white rounded"
        onClick={createToken}
      >
        Create a token
      </button>
    </div>
  );
}

function Input({
  placeholder,
  type,
  className,
  onChange,
}: {
  placeholder: string;
  type: string;
  onChange?: (e: any) => void;
  className?: string;
}) {
  return (
    <input
      className={
        `bg-zinc-900 text-white border border-transparent outline-none mb-2 p-2 rounded focus:outline-none focus:border focus:border-zinc-400` +
        (className ? ` ${className}` : "")
      }
      type={type}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
}
