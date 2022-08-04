// import { collectionData } from 'rxfire/firestore';
import { get } from 'svelte/store';

// import { Firebase } from '$lib/firebase/init';
// import { user } from '$lib/stores/user';

import { collection, orderBy, query, where } from 'firebase/firestore';
import { collectionData } from './rxfire/collection';

export const invitationStatus = () => {
	const _user = get(user);
	const _firebase = Firebase.getInstance();
	const db = _firebase.getFirestore();

	const invitationsRef = collection(db, 'invitations');
	const q = query(
		invitationsRef,
		where('to', '==', _user?.email ?? ''),
		where('accepted', '==', false),
		orderBy('timestamp', 'desc')
	);

	return collectionData(q);
};
