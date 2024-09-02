import nodemail from "nodemailer";
import { google } from "googleapis";
import path from "path";
import ejs from "ejs";
import jwt from "jsonwebtoken";
import env from "dotenv";
// import schoolModel from "../model/schoolModel";
import bitcoinModel from "../model/userModel";
env.config();

const GOOGLE_ID = process.env.GOOGLE_ID!;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET!;
const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL!;
const GOOGLE_REFRESH = process.env.GOOGLE_REFRESH!;

const oAuth = new google.auth.OAuth2(
	GOOGLE_ID,
	GOOGLE_SECRET,
	GOOGLE_REDIRECT_URL
);

oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH });

const url: string = process.env.APP_URL_DEPLOY!;

export const verifiedEmail = async (user: any) => {
	try {
		const accessToken: any = (await oAuth.getAccessToken()).token;

		const transporter = nodemail.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: "abbeyrufai234@gmail.com",
				clientSecret: GOOGLE_SECRET,
				clientId: GOOGLE_ID,
				refreshToken: GOOGLE_REFRESH,
				accessToken,
			},
		});

		const token = jwt.sign(
			{
				id: user?._id,
				email: user?.email,
			},
			"secretCode",
			{
				expiresIn: "5m",
			}
		);

		const timer = setTimeout(async () => {
			const getBitcionUser: any = await bitcoinModel.findById(
				user._id
			);

			if (!getBitcionUser?.verify) {
				await bitcoinModel.findByIdAndDelete(getBitcionUser?._id);
			}
			clearTimeout(timer);
		}, 5 * 60 * 1000);

		let frontEndURL: string = `${url}/${token}/sign-in`;
		let devURL: string = `${url}/auth/api/verify-user/${token}`;

		const myPath = path.join(__dirname, "../views/index.ejs");
		const html = await ejs.renderFile(myPath, {
			link: devURL,
			tokenCode: user?.token,
			userName: user?.userName,
		});

		const mailerOption = {
			from: "CryptoKing❤️",
			to: user.email,
			subject: "Account Verification",
			html,
		};

		await transporter
			.sendMail(mailerOption)
			.then((res: any) => {
				console.log("Sent");
				return res;
			})
			.catch((err: any) => {
				console.error(err);
				return err;
			});
	} catch (error) {
		console.error(error);
	}
};
