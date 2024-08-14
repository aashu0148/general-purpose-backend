import crypto from "crypto";
import jwt from "jsonwebtoken";

import configs from "./configs.js";

const createError = (res, message, code = 400, err = "") => {
  res.status(code).json({
    success: false,
    message: message || "Something gone wrong",
    error: err,
  });
};

const createResponse = (res, data, code = 200) => {
  res.status(code).json({
    success: true,
    data,
  });
};

function sleep(time = 1000) {
  return new Promise((r) => setTimeout(r, time));
}

function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const validateEmail = (email) => {
  if (!email) return false;
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

function formatSecondsToMinutesSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = parseInt(seconds % 60);

  return `${minutes}:${
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds
  }`;
}

const getFileHashSha256 = async (blob) => {
  if (!blob) return;

  const uint8Array = new Uint8Array(await blob.arrayBuffer());
  const hashBuffer = await crypto.subtle.digest("SHA-256", uint8Array);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((h) => h.toString(16).padStart(2, "0")).join("");
};

function shuffleArray(arr = []) {
  if (!Array.isArray(arr) || !arr.length) return;

  const array = [...arr];
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const getUniqueId = (idLength = 15) =>
  (
    Date.now().toString(16).slice(4) +
    parseInt(Math.random() * 99999999).toString(16)
  ).slice(0, idLength);

/**
 *
 * @param {Number} milliseconds Total milliseconds of the duration
 * @returns {String} 1h 21m 34s
 */
const getTimeDurationFormatted = (milliseconds) => {
  if (!milliseconds) return "0";

  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;

  let timeString = "";

  if (days > 0) timeString += days + "d ";
  if (days > 0 || hours > 0) timeString += hours + "h ";
  if (minutes > 0 || hours > 0) timeString += minutes + "m ";

  timeString += seconds + "s";

  return timeString.trim();
};

/**
 * Sign a JWT token.
 *
 * @param {object | string} payload - The payload to include in the token.
 * @param {object} [options] - Optional settings for token creation, such as expiresIn.
 * @returns {string} - Returns the signed token.
 */
function signJwtToken(payload, options = {}) {
  return jwt.sign(payload, configs.JWT_SECRET, options);
}

/**
 * Decode and verify a JWT token.
 *
 * @param {string} token - The token to decode and verify.
 * @returns {object|null} - Returns the decoded token if valid, or null if invalid.
 */
function decodeJwtToken(token) {
  if (!token) return token;

  try {
    return jwt.verify(token, configs.JWT_SECRET);
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export {
  sleep,
  createError,
  createResponse,
  validateEmail,
  formatSecondsToMinutesSeconds,
  getFileHashSha256,
  getRandomInteger,
  shuffleArray,
  getUniqueId,
  getTimeDurationFormatted,
  signJwtToken,
  decodeJwtToken,
};
