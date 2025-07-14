"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const OrdersAnalytics = ({ orders }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orders?.length) {
      setStats(processData(orders));
    }
    setLoading(false);
  }, [orders]);

  if (loading) return <p>Loading...</p>;
  if (!stats) return <p>No data to calculate.</p>;

  // Data transformation for charts
  const salesData = Object.keys(stats?.dailyRevenue ?? {}).map((date) => ({
    date,
    revenue: stats?.dailyRevenue?.[date],
  }));

  const productSalesData = Object.keys(stats?.productSales ?? {}).map(
    (product) => ({
      name: product,
      sales: stats?.productSales?.[product],
    })
  );

  const cityOrdersData = Object.keys(stats?.cityOrders ?? {}).map((city) => ({
    name: city,
    orders: stats?.cityOrders?.[city],
  }));

  const orderStatusData = Object.entries(stats?.orderStatus ?? {}).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#E63946"]; // Colors for pie chart

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Total Revenue & Orders */}
      <div className="bg-white shadow-lg p-6 rounded-lg flex flex-col justify-center items-center">
        <h2 className="text-lg font-semibold">Total Revenue</h2>
        <p className="text-2xl font-bold text-green-600">
          ${stats?.totalRevenue?.toFixed(2)}
        </p>
        <p className="text-gray-500">Total Orders: {stats?.totalOrders}</p>
      </div>

      {/* Total Loss from "Back" Orders */}
      <div className="bg-white shadow-lg p-6 rounded-lg flex flex-col justify-center items-center">
        <h2 className="text-lg font-semibold">Total Loss from Returns</h2>
        <p className="text-2xl font-bold text-red-600">
          -${stats?.totalLoss?.toFixed(2)}
        </p>
        <p className="text-gray-500">Back Orders: {stats?.orderStatus?.Back}</p>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white shadow-lg p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productSalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Orders by City */}
      <div className="bg-white shadow-lg p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Orders by City</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cityOrdersData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Order Status Distribution */}
      <div className="bg-white shadow-lg p-4 rounded-lg col-span-1 md:col-span-2">
        <h2 className="text-lg font-semibold mb-4">
          Order Status Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={orderStatusData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {orderStatusData?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Revenue Trends */}
      <div className="bg-white shadow-lg p-4 rounded-lg col-span-1 md:col-span-2">
        <h2 className="text-lg font-semibold mb-4">Daily Revenue Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Function to process order data
const processData = (orders) => {
  const stats = {
    totalRevenue: 0,
    totalOrders: 0,
    totalLoss: 0,
    productSales: {},
    cityOrders: {},
    orderStatus: {
      Received: 0,
      Back: 0,
      Pending: 0,
    },
    dailyRevenue: {},
  };

  orders?.forEach?.(
    ([
      _,
      product,
      quantity,
      price,
      ,
      city,
      ,
      ,
      ,
      ,
      ,
      statue,
      ,
      ,
      ,
      ,
      ,
      ,
      date,
    ]) => {
      if (statue === "Received") {
        stats.totalRevenue += quantity * price;
        stats.totalOrders += 1;
      }

      if (statue === "Back") {
        stats.totalLoss += 400;
      }

      stats.productSales[product] =
        (stats.productSales?.[product] || 0) + quantity;
      stats.cityOrders[city] = (stats.cityOrders?.[city] || 0) + 1;

      if (statue in stats.orderStatus) {
        stats.orderStatus[statue] += 1;
      }

      stats.dailyRevenue[date] =
        (stats.dailyRevenue?.[date] || 0) + quantity * price;
    }
  );

  return stats;
};

export default OrdersAnalytics;
