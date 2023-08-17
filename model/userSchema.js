import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    enable: {
      type: Boolean,
      default: false,
      required: true,
    },
    subscriptionStart: {
      type: String,
    },
    subscriptionEnd: {
      type: String,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('Users', userSchema);
