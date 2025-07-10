import { useMemo } from "react";
import {
  BarChart,
  Bar,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Transaction = {
  _id: string;
  amount: number;
  date: string;
  category: string;
};

type Budget = {
  _id: string;
  amount: number;
  category: string;
  month: string;
  year: string;
};

function CategoryChart({
  category,
  budgets,
  transactions,
}: {
  category: string;
  budgets: Budget[];
  transactions: Transaction[];
}) {
  const chartData = useMemo(() => {
    const spending: Record<string, number> = {};

    transactions.forEach((t) => {
      if (t.category !== category) return;
      const month = (new Date(t.date).getMonth() + 1).toString();
      const year = new Date(t.date).getFullYear().toString();
      const key = `${month}-${year}`;
      spending[key] = (spending[key] || 0) + t.amount;
    });

    return budgets.map((b) => {
      const key = `${b.month}-${b.year}`;
      const spent = spending[key] || 0;

      return {
        name: `${new Date(0, Number(b.month) - 1).toLocaleString("default", {
          month: "short",
        })} ${b.year}`,
        budget: b.amount,
        spent,
      };
    });
  }, [budgets, transactions, category]);


  const chartWidth = Math.max(chartData.length * 100, 300);

  return (
    <div className="mt-4 bg-white border m-2 rounded-md p-4  overflow-x-auto">
      <h3 className="text-lg font-semibold mb-2 text-center">{category}</h3>
      
      <div className="min-w-fit flex justify-center">
        <BarChart
          width={chartWidth}
          height={300}
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          barSize={50}
          barCategoryGap={50}
        >
          <XAxis dataKey="name" textAnchor="end" angle={-10} interval={0} height={60} />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="budget" fill="#82ca9d" />
          <Bar dataKey="spent" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
}

export { CategoryChart };
