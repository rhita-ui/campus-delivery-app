import mongoose, { Schema } from "mongoose";
import { storeItemSchema } from "./storeItem.model.js";

const storeSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: false,
      default: "",
    },
    image: {
      type: String,
      required: false,
      default: "",
    },
    items: { type: [storeItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Store || mongoose.model("Store", storeSchema);
