import { map } from 'rxjs/operators';

import { doc } from 'firebase/firestore';

//import { Firebase } from '$lib/firebase/init';
import type { GameRoom } from '$lib/types/playground_interfaces';
import { docData } from './rxfire/document';
import type { State } from '$lib/types/chess';

const transformToChessState = (room: GameRoom) => {
	if (!room.game) return;
	const state = room.game.state;
	const newBoard: number[][] = [];
	for (const [key, value] of Object.entries(state.board)) {
		newBoard[key[key.length - 1]] = value;
	}
	const newState: State = {
		...state,
		board: newBoard
	};
	return { ...room, game: { ...room.game, state: newState } };
};

export const roomStatus = (roomId: string) => {
	const _firebase = Firebase.getInstance();
	const db = _firebase.getFirestore();

	const roomRef = doc(db, `games/${roomId}`);

	return docData(roomRef).pipe(
		map((room: GameRoom) => transformToChessState(room))
	);
};
