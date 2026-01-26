const express = require("express");
const router = express.Router();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");
const path = require("path");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

router.post("/presign", async (req, res) => {
  try {
    const { filename, contentType, fileSize } = req.body;

    if (!filename || !contentType) {
      return res
        .status(400)
        .json({ message: "filename and contentType are required" });
    }

    if (!ALLOWED_TYPES.includes(contentType)) {
      return res.status(400).json({
        message: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}`,
      });
    }

    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return res.status(400).json({
        message: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      });
    }

    const ext = path.extname(filename);
    const uniqueKey = `uploads/${Date.now()}-${crypto.randomUUID()}${ext}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueKey}`;

    res.json({ uploadUrl, fileUrl, key: uniqueKey });
  } catch (err) {
    console.error("Presign error:", err);
    res.status(500).json({ message: "Failed to generate upload URL" });
  }
});

module.exports = router;
