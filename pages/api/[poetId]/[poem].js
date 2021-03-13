import MongoClient, { ObjectID } from 'mongodb';

const handler = async (req, res) => {

	if (req.method === "GET") {

		const { poetId, poem } = req.query;
		console.log("poem tite: ", poem);

		let client;

		try {
				client = await MongoClient.connect(
					'mongodb+srv://<db-name>:<password>@cluster0.qvis4.mongodb.net/apostrophe-poetry?retryWrites=true&w=majority'
				);

			const db = client.db();
			// const poets = db.collection("poets");

			const pid = new ObjectID(poetId);
			const query = { poems: { title: "tower" }};

			const receivedPoem = await db.collection("poets").findOne({ _id: pid});
		
			const foundPoem = receivedPoem.poems.find(poemItem => 
				poemItem.title === poem
			);

			res.status(201).json({
				poem: foundPoem
			});
	

		} catch (error) {
			res.status(400).json({
				message: "Something went wrong"
			});
		}

		

		await client.close();
	}
}

export default handler;



