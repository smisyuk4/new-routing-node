const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const sharp = require('sharp');
require('dotenv').config();

const bucketName = process.env.BUCKET_NAME;
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});

const s3SendFile = async (file, pathFile) => {
  try {
    // resize image
    const buffer = await sharp(file.buffer)
      .resize({
        height: 500,
        width: 500,
        fit: 'cover',
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    //const pathFile = `Avatars/500x500_${user_id}`;

    const params = {
      Bucket: bucketName,
      Key: pathFile,
      Body: buffer,
      ContentType: file.mimetype,
    };

    const putCommand = new PutObjectCommand(params);
    return await s3.send(putCommand);
  } catch (error) {}
  return error;
};

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

const s3CreateOneUrl = async (path) => {
  if (!path) {
    return null;
  }

  const getObjectParams = {
    Bucket: bucketName,
    Key: path,
  };

  const getCommand = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, getCommand);

  return url;
};

module.exports = {
  s3SendFile,
  s3GeneratorUrl,
  s3CreateOneUrl,
};
