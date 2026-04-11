import mongoose from "mongoose";

const graphSchema = new mongoose.Schema({
    from :String,
    to: String,
    weight: Number,
});

const Graph = mongoose.model("Graph",graphSchema);

export default Graph;
