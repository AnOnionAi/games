import {
	collection,
	orderBy,
	query,
	doc,
	where,
	getDoc
} from 'firebase/firestore';
import { map } from 'rxjs/operators';

// import { Firebase } from '$lib/firebase/init';
import { get } from 'svelte/store';
import { collectionData } from './rxfire/collection';
import { session } from '$app/stores';

export const chatGame = async (gameId: string) => {
	const firebase = Firebase.getInstance();
	const db = firebase.getFirestore();

	const gameRef = doc(db, `games/${gameId}`);
	const gameSnapshot = await getDoc(gameRef);

	const chatRef = gameSnapshot.data().chatRoom;

	const chatQuery = chatRef.collection('chats').orderBy('time', 'desc');

	return collectionData(chatQuery);
};
