import { Response } from "express";

export async function response200(res: Response, msg: string, data: Array<object>) {
  return res.status(200).json({
    status: "success",
    data: data,
  });
}

export async function response201(res: Response, msg: string, data: object) {
	return res.status(201).json({
		status: "success",
		message: msg,
		data: data,
	});
}

export async function response400(res: Response, msg: string) {
  return res.status(400).json({
    status: "fail",
    message: msg,
  });
}

export async function response404(res: Response, msg: string) {
	return res.status(404).json({
		status: "fail",
		message: msg,
	});
}

export async function response413(res: Response, msg: string) {
	return res.status(413).json({
    status: "fail",
    message: msg,
  });
}
