import mongoose from 'mongoose';



const budgetSchema = new mongoose.Schema({
    category: String,
    amount: Number,
    month: String ,
    year:String,
    userEmail: { type: String, required: true },
})

const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);
export default Budget;
