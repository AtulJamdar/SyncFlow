import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Client from './models/Client.js';
import Team from './models/Team.js';
import Project from './models/Project.js';
import Invoice from './models/Invoice.js';

dotenv.config();

const seedDB = async() => {
    try {
        await mongoose.connect("mongodb+srv://atuljamdar4:aQK1aAuGo1aJvoI5@cluster0.tdcww.mongodb.net/AiWorkflow");
        console.log('MongoDB connected for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Client.deleteMany({});
        await Team.deleteMany({});
        await Project.deleteMany({});
        await Invoice.deleteMany({});
        console.log('Cleared existing data.');

        // --- Create Users ---
        const users = await User.create([
            { name: 'Admin User', email: 'admin@gmail.com', password: 'Password123', role: 'admin', specialization: 'System Architect' },
            { name: 'Manager User', email: 'manager@gmail.com', password: 'Password123', role: 'manager', specialization: 'Project Manager' },
            { name: 'Accountant User', email: 'accountant@gmail.com', password: 'Password123', role: 'accountant', specialization: 'Finance' },
            { name: 'user1', email: 'user1@gmail.com', password: 'Password123', role: 'user', specialization: 'Frontend Developer' },
            { name: 'user2', email: 'user2@gmail.com', password: 'Password123', role: 'user', specialization: 'Backend Developer' },
        ]);
        const [admin, manager, accountant, user1, user2] = users;
        console.log('Users created.');

        // --- Create Clients ---
        const clients = await Client.create([
            { name: 'Shubham', email: 'shubham@gmail.com', company: 'Innovate Corp', createdBy: admin._id },
            { name: 'Soham', email: 'soham@gmail.com', company: 'Quantum Solutions', createdBy: admin._id },
        ]);
        const [client1, client2] = clients;
        console.log('Clients created.');

        // --- Create Teams ---
        const teams = await Team.create([
            { name: 'Alpha Team', leader: manager._id, members: [user1, user2] },
            { name: 'Beta Team', leader: manager._id, members: [user1] },
        ]);
        const [alphaTeam, betaTeam] = teams;
        console.log('Teams created.');

        // --- Create Projects ---
        const projects = await Project.create([
            { title: 'AI Platform Development', description: 'Build a new AI-driven analytics platform.', deadline: new Date('2025-12-31'), status: 'in-progress', client: client1._id, assignedTeams: [alphaTeam._id] },
            { title: 'Mobile App Redesign', description: 'Complete redesign of the flagship mobile app.', deadline: new Date('2025-11-30'), status: 'not-started', client: client2._id, assignedTeams: [betaTeam._id] },
        ]);
        const [project1, project2] = projects;
        console.log('Projects created.');

        // --- Create Invoices ---
        await Invoice.create([
            { invoiceNumber: 'INV-001', project: project1._id, client: client1._id, amount: 25000, status: 'unpaid', dueDate: new Date('2025-10-15') },
            { invoiceNumber: 'INV-002', project: project2._id, client: client2._id, amount: 15000, status: 'paid', dueDate: new Date('2025-09-30') },
        ]);
        console.log('Invoices created.');

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

seedDB();