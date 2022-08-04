import { map } from 'rxjs/operators';
import { get } from 'svelte/store';

import { collection, orderBy, query, doc, where } from 'firebase/firestore';

// import { user } from '$lib/stores/user';
import type { GameRoom } from '$lib/types/playground_interfaces';
// import type { User } from '$lib/types/user_interfaces';
import { collectionData } from './rxfire/collection';
import { docData } from './rxfire/document';
// import { Firebase } from '$lib/firebase/init';
import type { State } from '$lib/types/chess';

const transformToChessState = (gameRooms: GameRoom[]) => {
	return gameRooms.map((room: GameRoom) => {
		const state = room.game.state;
		const newBoard: number[][] = [];
		for (const [key, value] of Object.entries(state.board)) {
			newBoard[key[key.length - 1]] = value;
		}
		const newState: State = {
			...state,
			board: newBoard
		};

		return { ...room, state: newState };
	});
};

export const gamesStatus = () => {
	const _user = get(user);
	const _firebase = Firebase.getInstance();
	const db = _firebase.getFirestore();

	console.log(_firebase.getAuth().currentUser);

	console.log('email', _user?.email);

	const gamesRef = collection(db, 'games');
	const q = query(
		gamesRef,
		where('playersName', 'array-contains', _user?.email ?? ''),
		where('active', '==', true),
		orderBy('lastMove', 'desc')
	);

	return collectionData(q).pipe(
		map((value: GameRoom[]) => transformToChessState(value))
	);
};

export const playerRecord = () => {
	const _user = get(user);
	const _firebase = Firebase.getInstance();
	const db = _firebase.getFirestore();

	const userRef = doc(db, `users/${_user.id}`);

	return docData(userRef).pipe(map((user: User) => user.gameRecord));
};
