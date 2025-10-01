import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String },
    deadline: { type: Date },
    status: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed'],
        default: 'not-started',
    },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    assignedTeams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;