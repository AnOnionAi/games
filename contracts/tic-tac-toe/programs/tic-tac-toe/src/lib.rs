use anchor_lang::prelude::*;
use num_derive::*;
use num_traits::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod tic_tac_toe {
    use super::*;

    pub fn setup_game(ctx: Context<SetupGame>, player_two: Pubkey) -> Result<()> {
        ctx.accounts
            .game
            .start([ctx.accounts.player_one.key(), player_two])
    }

    pub fn play(ctx: Context<Play>, tile: Tile) -> Result<()> {
        let game = &mut ctx.accounts.game;

        require_keys_eq!(game.current_player(),ctx.accounts.player.key(),GameErrors::NotPlayerTurn);
        ctx.accounts.game.play(&tile)
    }
}

#[derive(Accounts)]
pub struct SetupGame<'info> {
    #[account(init, payer = player_one,space = (Game::MAX_SIZE + 8) as usize  )]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub player_one: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Play<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    pub player: Signer<'info>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct Tile {
    row: u8,
    column: u8,
}

#[account]
pub struct Game {
    players: [Pubkey; 2],          // (32 * 2)
    turn: u8,                      //  1
    board: [[Option<Sign>; 3]; 3], //  [[2 * 3] * 3] = 18
    state: GameState,              //  32 + 1
}

impl Game {
    pub const MAX_SIZE: u64 = (32 * 2) + 1 + (9 * (1 + 1) + (32 + 1));

    pub fn start(&mut self, players: [Pubkey; 2]) -> Result<()> {
        require_eq!(self.turn, 0, GameErrors::AlreadyStarted);
        self.players = players;
        self.turn = 1;
        Ok(())
    }

    pub fn is_active(&self) -> bool {
        self.state == GameState::Active
    }

    /*
     *  0 => represent first player
     *  1 => represent second player
     */
    pub fn current_player_index(&self) -> usize {
        ((self.turn - 1) % 2) as usize
    }

    pub fn current_player(&self) -> Pubkey {
        self.players[self.current_player_index()]
    }

    pub fn play(&mut self, tile: &Tile) -> Result<()> {
        require!(self.is_active(), GameErrors::GameOver);
        // you can see variable binding from there
        // https://doc.rust-lang.org/rust-by-example/flow_control/match/binding.html
        match tile {
            tile @ Tile {
                row: 0..=2,
                column: 0..=2,
            } => match self.board[tile.row as usize][tile.column as usize] {
                // if there is some data in board cell then we will
                // throw error
                Some(_) => return Err(error!(GameErrors::TileAlreadySet)),
                None => {
                    self.board[tile.row as usize][tile.column as usize] =
                        Some(Sign::from_usize(self.current_player_index()).unwrap());
                }
            },
            _ => return Err(GameErrors::TileOutOfBounds.into()),
        }

        // self.update_state()
        if GameState::Active == self.state {
            self.turn += 1;
        }
        Ok(())
    }

    pub fn update_state(&mut self) {
        // if three of the same in row
        for i in 0..=2 {
            if self.is_winning_trio([(i, 0), (i, 1), (0, 2)]) {
                self.state = GameState::Won {
                    winner: self.current_player(),
                };
                return;
            }
        }

        // if three of the same in column
        for i in 0..=2 {
            if self.is_winning_trio([(0, i), (1, i), (2, i)]) {
                self.state = GameState::Won {
                    winner: self.current_player(),
                };
                return;
            }
        }

        // if three of the same in diagonal
        if self.is_winning_trio([(0, 0), (1, 1), (2, 2)])
            || self.is_winning_trio([(0, 2), (1, 1), (2, 0)])
        {
            self.state = GameState::Won {
                winner: self.current_player(),
            };
            return;
        }

        for i in 0..=2 {
            for j in 0..=2 {
                if self.board[i][j].is_none() {
                    return;
                }
            }
        }
        self.state = GameState::Tie;
    }

    pub fn is_winning_trio(&self, trio: [(usize, usize); 3]) -> bool {
        let [first, second, thrid] = trio;
        self.board[first.0][first.1].is_some()
            && self.board[first.0][first.1] == self.board[second.0][second.1]
            && self.board[first.0][first.1] == self.board[thrid.0][thrid.1]
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum GameState {
    Active,
    Tie,
    Won { winner: Pubkey },
}

#[derive(
    AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, FromPrimitive, ToPrimitive,
)]
pub enum Sign {
    X,
    O,
}

#[error_code]
pub enum GameErrors {
    #[msg("Game already started")]
    AlreadyStarted,

    #[msg("Game already over")]
    GameOver,
    #[msg("Tile already set")]
    TileAlreadySet,

    #[msg("Tile out of bound")]
    TileOutOfBounds,
    
    #[msg("Please wait for your turn")]
    NotPlayerTurn,
}
