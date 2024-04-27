const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const bucketName = process.env.BUCKET_NAME;
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});

const s3GeneratorUrl = async (array) => {
  let newArray = [];

  for (const user of array) {
    if (user?.avatar_url) {
      const getObjectParams = {
        Bucket: bucketName,
        Key: user.avatar_url,
      };

      const getCommand = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, getCommand);

      newArray = [
        ...newArray,
        {
          ...user,
          avatar_url: url,
        },
      ];
    } else {
      newArray = [...newArray, user];
    }
  }

  return newArray;
};

const s3CreateOneUrl = async (object) => {
  if (object?.avatar_url) {
    const getObjectParams = {
      Bucket: bucketName,
      Key: object.avatar_url,
    };

    const getCommand = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, getCommand);

    return {
      ...object,
      avatar_url: url,
    };
  }

  return object;
};

module.exports = {
  s3GeneratorUrl,
  s3CreateOneUrl,
};
