import { Request, Response } from "express";
import crypto from "crypto";
import * as tf from "@tensorflow/tfjs-node";
import { savePredict, getPredict } from "../Databases/Firestore";

import { response200, response201, response400, response413 } from "../Helpers/Response";

export async function predict(req: Request, res: Response) {
	try {
		// load model from global variable
		const model = req.app.get("model");
		const image = req.file as Express.Multer.File;

		// check if image size is more than 1MB
		if (image.size > 1000000) {
      return response413(res, "Payload content length greater than maximum allowed: 1000000");
    }

		// image processing so it can be used by the model
		const tensor = tf.node
			.decodeImage(image.buffer)
			.resizeNearestNeighbor([224, 224])
			.expandDims()
			.toFloat();

		const prediction = model.predict(tensor);
		const score = await prediction.data();
		const confidenceScore = Math.max(...score) * 100;
		const classResult = confidenceScore > 99 ? "Cancer" : "Non-cancer";

		// mapping the result into object
		const result = {
			id: crypto.randomUUID(),
			result: classResult,
			suggestion:
				classResult === "Cancer"
					? "Kamu sedang tidak baik-baik saja, segera periksakan ke dokter ya :("
					: "Kamu baik-baik saja, tetap jaga kesehatan ya :)",
			createdAt: new Date().toISOString(),
		};

		// save prediction to firestore
		await savePredict(result.id, result);

		return response201(res, "Model is predicted successfully", result);
	} catch (err) {
		return response400(res, "Terjadi kesalahan dalam melakukan prediksi");
	}
}

export async function history(req: Request, res: Response) {
	try {
		const data = await getPredict();
		return response200(res, "Riwayat prediksi berhasil diambil", data);
	} catch (err) {
		return response400(res, "Terjadi kesalahan dalam mengambil riwayat prediksi");
	}
}
