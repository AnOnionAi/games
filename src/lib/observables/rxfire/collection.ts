import type {
	DocumentData,
	Query,
	QueryDocumentSnapshot
} from 'firebase/firestore';
import type { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { fromRef } from './fromRef';
import { snapToData } from './document';

/**
 * Return a stream of document snapshots on a query. These results are in sort order.
 * @param query
 */
export function collection<T = DocumentData>(
	query: Query<T>
): Observable<QueryDocumentSnapshot<T>[]> {
	return fromRef(query, { includeMetadataChanges: true }).pipe(
		map((changes) => changes.docs)
	);
}

/**
 * Returns a stream of documents mapped to their data payload, and optionally the document ID
 * @param query
 */
export function collectionData<T = DocumentData>(
	query: Query<T>,
	options: {
		idField?: string;
	} = {}
): Observable<T[]> {
	return collection(query).pipe(
		map((arr) => {
			return arr.map((snap) => snapToData(snap, options) as T);
		})
	);
}
