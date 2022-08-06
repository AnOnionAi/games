import * as anchor from "@project-serum/anchor";
import { AnchorError, Program } from "@project-serum/anchor";
import { expect } from "chai";
import { TicTacToe } from "../target/types/tic_tac_toe";

describe("tic-tac-toe", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.TicTacToe as Program<TicTacToe>;

  async function play(program: Program<TicTacToe>, game, player, tile, expectedTurn, expectedGameState, expectedBoard) {
    await program.methods
      .play(tile)
      .accounts({
        player: player.publicKey,
        game
      })
      .signers(player instanceof (anchor.Wallet as any) ? [] : [player])
      .rpc()

    const gameState = await program.account.game.fetch(game);
    expect(gameState.turn).to.equal(expectedTurn);
    expect(gameState.state).to.eql(expectedGameState);
    expect(gameState.board)
      .to
      .eql(expectedBoard);
  }

  it("Start Game", async () => {
    const gameKeypair = anchor.web3.Keypair.generate()
    const playerOne = (program.provider as anchor.Provider).wallet
    const playerTwo = anchor.web3.Keypair.generate()

    const tx = await program.methods
      .setupGame(playerTwo.publicKey)
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
      })
      .signers([gameKeypair])
      .rpc();
    console.log("Your transaction signature", tx);

    let gameState = await program.account.game.fetch(gameKeypair.publicKey)
    expect(gameState.turn).to.equal(1)
    expect(gameState.players).to.eql([playerOne.publicKey, playerTwo.publicKey])
    expect(gameState.state).to.eql({ active: {} })
    expect(gameState.board).to.eql([[null, null, null], [null, null, null], [null, null, null]])
  });

  it("player one turn", async () => {
    const gameKeypair = anchor.web3.Keypair.generate();
    const playerOne = (program.provider as anchor.Provider).wallet
    const playerTwo = anchor.web3.Keypair.generate();

    await program.methods
      .setupGame(playerTwo.publicKey)
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
      })
      .signers([gameKeypair])
      .rpc();

    await play(
      program,
      gameKeypair.publicKey,
      playerOne,
      { row: 0, column: 0 },
      2,
      { active: {} },
      [
        [{ x: {} }, null, null],
        [null, null, null],
        [null, null, null]
      ]
    );
  })

  it("If tiles are out of range", async () => {
    const gameKeypair = anchor.web3.Keypair.generate();
    const playerOne = (program.provider as anchor.Provider).wallet
    const playerTwo = anchor.web3.Keypair.generate();

    await program.methods
      .setupGame(playerTwo.publicKey)
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
      })
      .signers([gameKeypair])
      .rpc();
    try {
      await play(
        program,
        gameKeypair.publicKey,
        playerOne,
        { row: 1, column: 5 },
        2,
        { active: {} },
        [
          [{ x: {} }, null, null],
          [null, null, null],
          [null, null, null]
        ]
      );
      } catch (_err) {
      expect(_err).to.be.instanceOf(AnchorError);
      const err: AnchorError = _err;
      expect(err.error.errorCode.number).to.equal(6003);
      expect(err.error.errorMessage).to.equal('Tile out of bound');
    }

  })


});
