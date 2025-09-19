// fields.js
import { ObjectId } from "mongodb";

/**
 * PyObjectId equivalent for JavaScript
 * Validates and converts strings to ObjectId
 */
export class PyObjectId {
  /**
   * Validate and convert a value to ObjectId
   * @param {string|ObjectId} value
   * @returns {ObjectId}
   */
  static validate(value) {
    if (ObjectId.isValid(value)) {
      return typeof value === "string" ? new ObjectId(value) : value;
    }
    throw new Error("Invalid ObjectId");
  }

  /**
   * Serialize ObjectId to string
   * @param {ObjectId} objId
   * @returns {string}
   */
  static serialize(objId) {
    return objId.toString();
  }
}
