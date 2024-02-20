import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      // email should be unique
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      // by default, the user is not an admin
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

//// .pre is a mongoose method that will run the middleware before we save the user to the database)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  // generate salt
  const salt = await bcrypt.genSalt(10)
  // hash the password
  this.password = bcrypt.hashSync(this.password, salt)
})

//// Custom method that will take entered password and compare it with hashed password in database, when we create it in userSchema we can then apply it on user object
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model("User", userSchema)

export default User
