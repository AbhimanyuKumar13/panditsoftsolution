import { v2 as cloudinary } from "cloudinary";
import asyncRoute from "../utils/asyncRoute.js";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const isValidImage = ({ mimetype, buffer }) => {
  if (!allowedMimeTypes.has(mimetype) || !buffer) return false;
  if (mimetype === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimetype === "image/png") {
    return buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    );
  }
  return (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  );
};

const uploadImage = (file) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "pandit-soft-solution/project-screenshots",
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
          unique_filename: true,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result?.secure_url || !result.public_id) {
            return reject(new Error("Cloudinary returned an incomplete upload result."));
          }
          return resolve({ url: result.secure_url, publicId: result.public_id });
        },
      )
      .end(file.buffer);
  });

export const uploadProjectScreenshots = asyncRoute(async (req, res) => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(503).json({
      error: "Image uploads are unavailable. Configure the Cloudinary server credentials.",
    });
  }

  const files = req.files || [];
  if (!files.length || files.some((file) => !isValidImage(file))) {
    return res.status(400).json({
      error: "Upload JPG, PNG, or WebP image files only.",
    });
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });

  const results = await Promise.allSettled(files.map(uploadImage));
  const uploaded = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);
  const failed = results.find((result) => result.status === "rejected");

  if (failed) {
    await Promise.allSettled(
      uploaded.map(({ publicId }) =>
        cloudinary.uploader.destroy(publicId, { resource_type: "image" }),
      ),
    );
    throw failed.reason;
  }

  return res.status(201).json({
    success: true,
    images: uploaded.map(({ url }) => url),
  });
});
