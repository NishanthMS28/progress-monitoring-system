require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Progress = require('../models/Progress');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...\n');
    await User.deleteMany({});
    await Project.deleteMany({});
    await Progress.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Owner account - use environment variables or defaults
    const ownerEmail = process.env.OWNER_EMAIL || 'owner@factory.com';
    const ownerPassword = process.env.OWNER_PASSWORD || 'Owner@123';
    
    const owner = await User.create({
      name: 'System Owner',
      email: ownerEmail,
      password: ownerPassword,
      role: 'owner'
    });
    console.log(`✅ Owner created: ${owner.email}\n`);

    const projects = [
      { name: 'Automotive Assembly Line A', description: 'Main automotive parts assembly', totalUnits: 1000, startDate: new Date(Date.now() - 10 * 86400000), endDate: new Date(Date.now() + 20 * 86400000) },
      { name: 'Electronics Manufacturing Unit B', description: 'Circuit board production', totalUnits: 800, startDate: new Date(Date.now() - 5 * 86400000), endDate: new Date(Date.now() + 25 * 86400000) },
      { name: 'Metal Fabrication Project C', description: 'Industrial metal components', totalUnits: 1200, startDate: new Date(Date.now() - 15 * 86400000), endDate: new Date(Date.now() + 15 * 86400000) }
    ];

    // Customer 1 - use environment variables for real customer, or defaults
    const realCustomerEmail = process.env.REAL_CUSTOMER_EMAIL || 'customer1@company.com';
    const realCustomerPassword = process.env.REAL_CUSTOMER_PASSWORD || 'Customer@123';
    
    const customers = [
      { name: 'Customer 1', email: realCustomerEmail, password: realCustomerPassword },
      { name: 'Tech Industries Ltd', email: 'customer2@company.com', password: 'Customer@123' },
      { name: 'Global Manufacturing Co', email: 'customer3@company.com', password: 'Customer@123' }
    ];

    for (let i = 0; i < projects.length; i++) {
      const project = await Project.create({ ...projects[i], customer: null });
      project.generateSchedule();
      await project.save();

      const customer = await User.create({ ...customers[i], role: 'customer', projectId: project._id });
      project.customer = customer._id;
      await project.save();

      // Don't create sample progress entries - start fresh with real data from model
      console.log(`✅ Seeded project "${project.name}" with customer ${customer.email}`);
    }

    console.log('\n📝 Accounts Created:');
    console.log(`   Owner: ${ownerEmail} / ${ownerPassword}`);
    console.log(`   Customer 1: ${realCustomerEmail} / ${realCustomerPassword}`);
    console.log('   Customer 2: customer2@company.com / Customer@123');
    console.log('   Customer 3: customer3@company.com / Customer@123');
    console.log('\n💡 Tip: Set OWNER_EMAIL, OWNER_PASSWORD, REAL_CUSTOMER_EMAIL, and REAL_CUSTOMER_PASSWORD in .env to use your own accounts');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

(async () => {
  await connectDB();
  await seedDatabase();
  await mongoose.connection.close();
  console.log('\n👋 Database connection closed');
  process.exit(0);
})();

