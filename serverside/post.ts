import {
  CloudFunctionContext,
  CloudFunctionHttpEvent,
  ShareModel,
} from "./types";
import AWS from "aws-sdk";
import { randomBytes } from "crypto";
import path from "path";

AWS.config.update({ region: "ru-central1" });

const endpoint = new AWS.Endpoint("storage.yandexcloud.net");

const s3 = new AWS.S3({ endpoint: endpoint });

module.exports.handler = async function (
  event: CloudFunctionHttpEvent,
  context: CloudFunctionContext
) {
  try {
    const body: ShareModel = JSON.parse(event.body);

    body.requested = new Date();

    body.secret = randomBytes(32).toString("hex");

    body.id = randomBytes(body.secure ? 16 : 2).toString("hex");

    await s3
      .upload({
        Bucket: "csh.haqa.ru",
        Key: `${path.join("Private/", body.id)}.json`,
        ContentType: "application/json",
        Body: JSON.stringify(body),
      })
      .promise();

    return { statusCode: 200, body: body };
  } catch {
    return {
      statusCode: 500,
    };
  }
};
