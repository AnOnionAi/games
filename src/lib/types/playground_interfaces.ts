import type {
	DocumentReference,
	FieldValue,
	Timestamp
} from 'firebase/firestore';
import type { State } from '$lib/types/chess';

export interface PlayerRecord {
	wins: number;
	losses: number;
	draws: number;
}

export interface GameInvitation {
	id: string;
	from: string;
	to: string;
	game: string;
	gameId: string | null;
	accepted: boolean;
	timestamp: Timestamp | FieldValue | Date;
}

export interface GameRoom {
	id: string;
	game: ChessGame;
	active: boolean;
	type: string;
	chatRoom: DocumentReference;
	drawRequest: DrawRequest;
	players: Players;
	playersName: string[];
	viewers: number;
	winner: boolean;
	draw: boolean;
	lastMove: Timestamp | FieldValue | Date;
	round: number;
}

export interface ChessGame extends Game {
	state: State;
	fen: string;
}

export interface Game {
	win: Win;
}

export interface DrawRequest {
	from: string;
	request: boolean;
}

export interface Player {
	email: string;
	photoURL: string;
	isFirstPlayer: boolean;
}

export interface Players {
	challenger: Player;
	opponent: Player;
}

export interface Win {
	winner: string;
	reason: string;
}
