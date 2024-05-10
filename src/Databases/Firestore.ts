import { Firestore } from "@google-cloud/firestore";

const db = new Firestore();
const predictCollection = db.collection("predictions");

export const savePredict = async (id: string, data: object) => {
  return predictCollection.doc(id).set(data);
};

export const getPredict = async () => {
	const snapshot = await predictCollection.get();

	const predictions = snapshot.docs.map((doc) => {
		return {
			id: doc.id,
			history: doc.data(),
		};
	});

	return predictions;
};
