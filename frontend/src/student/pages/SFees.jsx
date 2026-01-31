import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext/AuthContext";

const SFees = () => {
  const [feesData, setFeesData] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, axios } = useAuth();

  const getFeesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get("/student/fees", {
        headers: {
          token
        },
      });

      console.log("Fees Response:", response.data.fees[0]);

      if (response.data.success) {
        setFeesData(response.data.fees[0]);
        setPaymentHistory(response.data.fees[0].paymentHistory || []);
        console.log("Fees history:", response.data.fees[0].paymentHistory || []);
      } else {
        setError(response.data.message || "Failed to fetch fees data");
      }
    } catch (error) {
      console.error("Error fetching fees data:", error);
      setError(error.response?.data?.message || "Error fetching fees data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeesData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-gray-600 font-semibold text-sm">Loading fees information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Fees</h1>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            ⚠️ {error}
          </div>
        </div>
      </div>
    );
  }

  if (!feesData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Fees</h1>
          <div className="text-center text-gray-500 py-8">No fees data found</div>
        </div>
      </div>
    );
  }

  const totalFees = feesData.totalFees || 0;
  const paidAmount = feesData.paidAmount || 0;
  const pendingAmount = totalFees - paidAmount;

  const getStatusColor = () => {
    if (paidAmount === totalFees) return "Paid";
    if (paidAmount === 0) return "Pending";
    return "Partial";
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Partial":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-3xl font-bold text-gray-900">Fees & Payments</h1>
          <p className="text-gray-600 text-sm mt-2">Manage your school fees and payment history</p>
        </div>

        {/* Fee Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-600 text-sm mb-2 font-medium">Total Fees</p>
            <h3 className="text-3xl font-bold text-gray-900">₹{totalFees.toLocaleString()}</h3>
          </div>
          
          <div className="bg-green-50 rounded-xl shadow-sm border border-green-200 p-6">
            <p className="text-gray-600 text-sm mb-2 font-medium">Paid Amount</p>
            <h3 className="text-3xl font-bold text-green-600">₹{paidAmount.toLocaleString()}</h3>
          </div>
          
          <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-6">
            <p className="text-gray-600 text-sm mb-2 font-medium">Pending Amount</p>
            <h3 className="text-3xl font-bold text-red-600">₹{pendingAmount.toLocaleString()}</h3>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm mb-1 font-medium">Payment Status</p>
              <h3 className="text-2xl font-bold text-gray-900">{getStatusColor()}</h3>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeColor(getStatusColor())}`}>
              {getStatusColor()}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600 font-medium">Payment Progress</span>
              <span className="text-xs text-gray-600 font-medium">
                {totalFees > 0 ? Math.round((paidAmount / totalFees) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                style={{ width: `${totalFees > 0 ? (paidAmount / totalFees) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Payment History</h2>
          </div>
          
          {paymentHistory && paymentHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mode</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paymentHistory.map((payment, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {new Date(payment.paymentDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₹{payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="capitalize bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {payment.mode}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono text-xs">
                        {payment.transactionId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {payment.note || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No payment history available
            </div>
          )}
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Fee Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600 text-sm font-medium mb-1">Due Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(feesData.dueDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600 text-sm font-medium mb-1">Last Updated</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(feesData.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SFees;