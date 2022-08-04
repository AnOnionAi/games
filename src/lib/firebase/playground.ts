import type {
	ChessGame,
	GameInvitation,
	GameRoom
} from '$lib/types/playground_interfaces';
//import { Firebase } from '$lib/firebase/init';

//import { user } from '$lib/stores/user';
import { get } from 'svelte/store';

import {
	serverTimestamp,
	increment,
	collection,
	query,
	doc,
	setDoc,
	where,
	getDocs,
	limit
} from 'firebase/firestore';

const newGameRoom = async (
	gameType: string,
	players: string[]
): Promise<GameRoom> => {
	let game: ChessGame;

	if (gameType === 'chess') {
		game = {
			win: {
				reason: '',
				winner: ''
			},
			fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
			state: {
				black_king_castle_is_possible: true,
				black_king_is_checked: false,
				black_king_on_board: false,
				black_queen_castle_is_possible: true,
				board: {
					array_0: [-3, -5, -4, -2, -1, -4, -5, -3],
					array_1: [-6, -6, -6, -6, -6, -6, -6, -6],
					array_2: [0, 0, 0, 0, 0, 0, 0, 0],
					array_3: [0, 0, 0, 0, 0, 0, 0, 0],
					array_4: [0, 0, 0, 0, 0, 0, 0, 0],
					array_5: [0, 0, 0, 0, 0, 0, 0, 0],
					array_6: [6, 6, 6, 6, 6, 6, 6, 6],
					array_7: [3, 5, 4, 2, 1, 4, 5, 3]
				},
				current_player: 'White',
				white_king_castle_is_possible: true,
				white_king_is_checked: false,
				white_king_on_board: false,
				white_queen_castle_is_possible: true
			}
		};
	}

	const _firebase = Firebase.getInstance();
	const db = _firebase.getFirestore();

	const usersRef = collection(db, 'users');
	const q = query(usersRef, where('email', 'in', players));
	const usersSnapshot = await getDocs(q);

	const photos: string[] = ['', ''];
	usersSnapshot.forEach((userSnapshot) => {
		const user = userSnapshot.data();
		if (players[0] === user.email) {
			photos[0] = user.photoURL;
		} else {
			photos[1] = user.photoURL;
		}
	});

	const idx = Math.round(Math.random());
	console.log('IDX', idx);
	const _players = {
		challenger: {
			email: players[0],
			isFirstPlayer: idx === 0,
			photoURL: photos[0]
		},
		opponent: {
			email: players[1],
			isFirstPlayer: idx === 1,
			photoURL: photos[1]
		}
	};

	const _playersName = [players[0], players[1]];

	return {
		game,
		winner: false,
		active: true,
		chatRoom: await createChatRoom(players[0], players[1], 'person-game'),
		id: '',
		lastMove: serverTimestamp(),
		round: 1,
		type: gameType,
		viewers: 0,
		players: _players,
		draw: false,
		playersName: _playersName,
		drawRequest: {
			request: false,
			from: ''
		}
	};
};
const newInvitation = async (
	to: string,
	gameType: string
): Promise<GameInvitation> => {
	const $user = get(user);
	const _firebase = Firebase.getInstance();
	const db = _firebase.getFirestore();

	const usersRef = collection(db, 'users');
	const q = query(usersRef, where('email', '==', to), limit(1));
	const usersSnapshot = await getDocs(q);

	if (usersSnapshot.empty || !usersSnapshot.docs[0].exists) {
		throw Error('user not found');
	} else {
		const invitationRef = collection(db, 'invitations');

		return {
			id: invitationRef.id,
			from: $user.email,
			game: gameType,
			timestamp: serverTimestamp(),
			accepted: false,
			to,
			gameId: ''
		};
	}
};

export const createGameRoom = async (invitation: GameInvitation) => {
	const _firebase = Firebase.getInstance();
	const db = _firebase.getFirestore();
	const gameRoom: GameRoom = await newGameRoom(invitation.game, [
		invitation.from,
		invitation.to
	]);
	await acceptInvitation(invitation.id);
	const gameRoomRef = doc(db, 'games');
	gameRoom.id = gameRoomRef.id;
	await setDoc(gameRoomRef, gameRoom);
};

export const createInvitation = async (to: string, gameType: string) => {
	const _firebase = Firebase.getInstance();
	const db = _firebase.getFirestore();
	const invitation: GameInvitation = await newInvitation(to, gameType);
	const invitationRef = doc(db, `invitations/${invitation.id}`);
	await setDoc(invitationRef, invitation);
};

export const resetGame = async (actualGame: GameRoom) => {
	const _firebase = Firebase.getInstance();
	const db = _firebase.getFirestore();
	const newGame = await newGameRoom(actualGame.type, [
		actualGame.players.challenger.email,
		actualGame.players.opponent.email
	]);
	newGame.id = actualGame.id;
	const gameRef = doc(db, `games/${actualGame.id}`);
	await setDoc(gameRef, newGame);
};

export const acceptInvitation = async (invitationId: string) => {
	const _firebase = Firebase.getInstance();
	const db = _firebase.getFirestore();

	const invitationRef = doc(db, `invitations/${invitationId}`);
	await setDoc(
		invitationRef,
		{
			accepted: true
		},
		{
			merge: true
		}
	);
};

export const updateUserRecord = async (
	recordType: string,
	winner: string,
	looser: string
) => {
	const _firebase = Firebase.getInstance();
	const db = _firebase.getFirestore();

	const usersRef = collection(db, 'users');

	const winnerQuery = query(usersRef, where('email', '==', winner), limit(1));
	const winnerSnapshot = await getDocs(winnerQuery);
	const winnerRef = winnerSnapshot.docs[0].ref;

	const looserQuery = query(usersRef, where('email', '==', looser), limit(1));
	const looserSnapshot = await getDocs(looserQuery);
	const looserRef = looserSnapshot.docs[0].ref;

	if (recordType === 'draw') {
		await setDoc(
			winnerRef,
			{ gameRecord: { draws: increment(1) } },
			{ merge: true }
		);
		await setDoc(
			looserRef,
			{ gameRecord: { draws: increment(1) } },
			{ merge: true }
		);
	} else {
		console.log('RECORDTYPE NO ES DRAW');
		await setDoc(
			winnerRef,
			{ gameRecord: { wins: increment(1) } },
			{ merge: true }
		);
		await setDoc(
			looserRef,
			{ gameRecord: { losses: increment(1) } },
			{ merge: true }
		);
	}
};
