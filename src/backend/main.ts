import "dotenv/config";
import app from "./presentation/app.js";
import { AppDataSource } from "./infrastructure/typeorm.config.js";

const port = process.env.BACKEND_PORT || 3001;

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
