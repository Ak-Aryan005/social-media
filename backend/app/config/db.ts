import mongoose from "mongoose";
import config from "../config/config";
import { logger } from "../config/logger";

const database = () => {
  mongoose
    .connect(config.database.mongodbURI as string, {
      autoIndex: true,
    })
    .then(() => logger.info("MongoDB connected"))
    .catch((err) => logger.error(`MongoDB connection error: ${err}`));
};

export default database;




// const database = async () => {
//   try {
//     await mongoose.connect(config.database.mongodbURI as string, {
//       autoIndex: true,
//     });

//     logger.info("MongoDB connected");
//   } catch (err) {
//     logger.error(`MongoDB connection error: ${err}`);
//     process.exit(1);
//   }
// };

// export default database;
