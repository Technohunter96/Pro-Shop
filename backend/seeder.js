import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
  // before importing data, we want to clear the database
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users); // insertMany is a mongoose method that allows us to insert multiple documents into a collection

    const adminUser = createdUsers[0]._id; // the first user in the users array is the admin user, ID is the unique identifier for the user made automatically by MongoDB

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser }; // new object that's a copy of product, but with the new user property set to adminUser (the id of the admin user)
    });

    await Product.insertMany(sampleProducts); // insert the sampleProducts array into the database
    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  // before destroying data, we want to clear the database
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

console.log(process.argv[2]); // we passing 2 index in the terminal because the first index is node and the second index is the file name, so we want to access the third index which is the argument we pass in the terminal and that argument will be shown in the terminal when we run the command ("-hello", "-d", etc. whatever)

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
