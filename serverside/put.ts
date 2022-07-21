import {
  CloudFunctionContext,
  CloudFunctionHttpEvent,
  ShareModel,
} from "./types";
import AWS from "aws-sdk";
import path from "path";

AWS.config.update({ region: "ru-central1" });

const endpoint = new AWS.Endpoint("storage.yandexcloud.net");

const s3 = new AWS.S3({ endpoint: endpoint });

module.exports.handler = async function (
  event: CloudFunctionHttpEvent,
  context: CloudFunctionContext
) {
  try {
    const id = event.pathParams["file"];

    const data = await s3
      .getObject({
        Bucket: "csh.haqa.ru",
        Key: `${path.join("Private/", id)}.json`,
      })
      .promise();

    if (!data.Body) return;

    const body1: ShareModel = JSON.parse(data.Body.toString());
    const body2: ShareModel = JSON.parse(event.body);

    if (body1.secret !== body2.secret) return;

    body1.requested = new Date();

    await s3
      .upload({
        Bucket: "csh.haqa.ru",
        Key: `${path.join("Private/", id)}.json`,
        ContentType: "application/json",
        Body: JSON.stringify(body2),
      })
      .promise();

    return {
      statusCode: 200,
    };
  } catch (e: any) {
    if (e.name === "InvalidKeyPath") {
      return {
        statusCode: 404,
      };
    }
    return {
      statusCode: 500,
    };
  }
};
