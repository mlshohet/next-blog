import { getSession} from 'next-auth/client';
import { connectToDatabase } from '../../../lib/db'; 

import { ObjectId } from 'mongodb';

async function handler (req, res) {

	if (req.method !== 'PATCH') {
		res.status(400).json({ message: "Invalid request!" });
		return;
	}
	console.log("In handler");

	const session = await getSession({ req: req });
	console.log("In connect try block");

	if (!session) {
		res.status(401).json({ message: "Unauthorized!" });
		return;
	}

	const { userId, imageUrl } = req.body;
	const uid = ObjectId(userId);

	console.log("Request: ", req.body);

	let client;
	
	try {

		console.log("In connect try block");
		client = await connectToDatabase();
	} catch (error) {
		res.status(400).json({ message: "Could not connect", error });
		client.close();
		return;
	};
	console.log("After connect try block");

	const collection = client.db().collection('poets');
	console.log("After collection");

	try {
		console.log("In find try block");
		const item = await collection.findOne({ _id: uid}); 
	} catch (error) {
		client.close();
		res.status(401).json({ message: "Could not find profile!", error});
		return;
	}
	console.log("After find try block");

	let result;
	try	{
		result = await collection.updateOne(
			{ _id: uid },
			{ $set: { imageUrl, imageUrl } }
		);
	} catch (error) {
		res.status(400).json({ message: "Could not update document!", error });
		client.close();
		return;
	}

	res.status(200).json({
		message: "Upload successful!",
		userId
	});

	await client.close();
}

export default handler;










