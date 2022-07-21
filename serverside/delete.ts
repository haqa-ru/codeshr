import {
  CloudFunctionHttpEvent,
  CloudFunctionContext,
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

    await s3
      .deleteObject({
        Bucket: "csh.haqa.ru",
        Key: `${path.join("Private/", id)}.json`,
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
