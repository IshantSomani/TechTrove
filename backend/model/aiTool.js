const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  url: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        // return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
        return /^(https?:\/\/)/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
    required: true
  },
  hitCount: { type: Number, default: 0, },
  addedBy: { type: String, required: true, trim: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
});


const aiToolSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    tools: [toolSchema],
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

aiToolSchema.index({ category: 1, 'tools.title': 1 }, { unique: true });

aiToolSchema.pre("save", function (next) {
  this.tools.forEach((tool) => {
    tool.updatedAt = new Date();
  });
  next();
});

aiToolSchema.methods.incrementHitCount = function (toolId) {
  const tool = this.tools.id(toolId);
  if (tool) {
    tool.hitCount += 1;
    return this.save();
  }
  return Promise.reject(new Error('Tool not found'));
};

aiToolSchema.methods.toggleToolActive = function (toolId) {
  const tool = this.tools.id(toolId);
  if (tool) {
    tool.active = !tool.active;
    tool.updatedAt = new Date();
    return this.save();
  }
  return Promise.reject(new Error('Tool not found'));
};

module.exports = mongoose.model("AiTools", aiToolSchema);