import "dotenv/config";
import app from "backend/presentation/app";

const port = process.env.BACKEND_PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
