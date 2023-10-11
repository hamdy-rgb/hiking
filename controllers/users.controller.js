const formidable = require("formidable-serverless");
const { v4: uuidv4 } = require("uuid");
const fs = require("node:fs");
const path = require("node:path");
const { sendEmail } = require("../utils/email");
const User = require("../models/user.model");
const { generateUniqueNumber } = require("../utils/utils");
const { hashPassword, generatePassword } = require("../utils/password");
const {
  createDirectory,
  uploadFile,
  deleteFile,
  updateFile,
} = require("../utils/files");

const createUser = async (request, response) => {
  try {
    const form = new formidable.IncomingForm();

    const fieldsPromise = new Promise((resolve, reject) => {
      form.parse(request, (error, fields, files) => {
        if (error) {
          reject(error);
        } else {
          resolve({ fields, files });
        }
      });
    });

    const { fields, files } = await fieldsPromise;

    const { email, firstName, lastName } = fields;

    // Check if the email already exists
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return response
        .status(409)
        .json({ error: "Email address is already in use." });
    }

    // Generate uid and password and displayName
    const displayName = `${firstName} ${lastName}`;
    const password = generatePassword();
    const uid = uuidv4();

    // Create directory
    const directoryName = generateUniqueNumber(uid);
    const directoryPath = await createDirectory(directoryName, "users");

    // Process userPhoto
    let userPhotoUrl = null;
    if (files && files.userPhoto) {
      userPhotoUrl = await uploadFile(files.userPhoto, directoryPath);
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user document
    const user = new User({
      uid,
      email,
      displayName,
      password: hashedPassword,
      firstName,
      lastName,
      photoUrl: userPhotoUrl,
      registrationNumber: `BS-${generateUniqueNumber(uid)}`,
      createdAt: new Date().toISOString(),
    });

    // Save the user to the database
    await user.save();

    // send email to inform the user
    const content = fs.readFileSync(
      path.join(__dirname, "../html-template/send-email-password.html"),
      "utf-8",
    );

    const urlLogo = process.env.LOGO_URL;
    const siteUrl = process.env.SITE_URL;

    const newContent = content // replace the email and password in the html template
      .replace("{{email}}", email)
      .replace("{{password}}", password)
      .replace("{{logoUrl}}", urlLogo)
      .replace("{{siteUrl}}", siteUrl);

    // Send the email with the password
    sendEmail({
      recipient: email,
      subject: "Vos informations de connexion",
      htmlBody: newContent,
    });

    return response.json({
      message: "User created successfully",
    });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const updateUser = async (request, response) => {
  try {
    const { id: userId } = request.params;
    // Get the user document
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return response.status(404).json({ error: "User not found." });
    }

    // Get the form data
    const form = new formidable.IncomingForm();

    const fieldsPromise = new Promise((resolve, reject) => {
      form.parse(request, (error, fields, files) => {
        if (error) {
          reject(error);
        } else {
          resolve({ fields, files });
        }
      });
    });

    const { fields, files } = await fieldsPromise;
    const { email, firstName, lastName } = fields;

    // Check if the email is already in use by another user
    const existingEmailUser = await User.findOne({
      email,
      _id: { $ne: userId },
    });
    if (existingEmailUser) {
      return response
        .status(409)
        .json({ error: "Email address is already in use." });
    }

    // Process userPhoto if it exists
    let userPhotoUrl = user.photoUrl;
    if (files.userPhoto !== undefined) {
      if (userPhotoUrl === null) {
        userPhotoUrl = await uploadFile(
          files.userPhoto,
          `users_files/${user.registrationNumber}`,
        );
      } else if (userPhotoUrl.length > 5) {
        userPhotoUrl = updateFile(files.userPhoto, userPhotoUrl);
      }
    } else if (
      userPhotoUrl.length > 10 &&
      files.userPhoto === undefined &&
      "userPhoto" in fields
    ) {
      if (fields.userPhoto.length === 0) {
        await deleteFile(userPhotoUrl);
        userPhotoUrl = null;
      }
    }

    user.photoUrl = userPhotoUrl;
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.displayName = `${firstName} ${lastName}`;
    user.updatedAt = new Date().toISOString();
    // Save the user document
    await user.save();

    return response.json({
      message: "User updated successfully",
    });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const deleteUser = async (request, response) => {
  try {
    const { id } = request.params;

    const user = await User.findOne({ _id: id });

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    // delete photo and attachments
    const { photoUrl } = user;
    if (photoUrl !== null) {
      await deleteFile(photoUrl);
    }

    await user.deleteOne();

    return response.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const getUserById = async (request, response) => {
  try {
    const userId = request.params.id; // Assuming the user ID is passed as a route parameter

    // Query the database to find the user by ID
    const user = await User.findById(userId).select(
      "firstName lastName email photoUrl",
    );

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    return response.status(200).json(user);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const getUsers = async (request, response) => {
  try {
    const users = await User.find({}).select(
      "displayName email  photoUrl createdAt",
    );

    return response.status(200).json({
      users,
      totalCount: users.length,
    });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getUsers,
};
