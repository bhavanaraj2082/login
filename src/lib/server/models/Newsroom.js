import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Newsroom schema with image as binary data (Buffer)
const newsroomSchema = new Schema(
  {
    title: {
      type: String,
    },
    previewText: {
      type: String,
    },
    image: {
      type: String, // Store image data as binary (Buffer)
    },
    newsLink: {
      type: String,
    }
  },
  {
    timestamps: true,
    collection: 'newsroom',
  }
);

const Newsroom =mongoose.models.Newsroom || mongoose.model('Newsroom', newsroomSchema);

export default Newsroom;
