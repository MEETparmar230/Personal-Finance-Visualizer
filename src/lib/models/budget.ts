import mongoose from 'mongoose';



const budgetSchema = new mongoose.Schema({
    category: String,
    amount: Number,
    month: String ,
    year:String,
})

const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);
export default Budget;
