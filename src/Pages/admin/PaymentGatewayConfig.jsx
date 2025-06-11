import React from "react";

const PaymentGatewayConfig = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Payment Gateway Integration Setup
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Razorpay Configuration</h2>
        <form className="mb-8">
          <div className="mb-4">
            <label
              htmlFor="razorpayKeyId"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Razorpay Key ID:
            </label>
            <input
              type="text"
              id="razorpayKeyId"
              name="razorpayKeyId"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Razorpay Key ID"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="razorpaySecret"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Razorpay Key Secret:
            </label>
            <input
              type="text"
              id="razorpaySecret"
              name="razorpaySecret"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Razorpay Key Secret"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Razorpay Settings
            </button>
          </div>
        </form>

        <h2 className="text-xl font-semibold mb-4">Split Payment Settings</h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="splitPaymentEnabled"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              <input
                type="checkbox"
                id="splitPaymentEnabled"
                name="splitPaymentEnabled"
                className="mr-2 leading-tight"
              />
              Enable Split Payments
            </label>
          </div>
          <div className="mb-4">
            <label
              htmlFor="defaultSplitRatio"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Default Split Ratio (e.g., 80 for 80% to seller):
            </label>
            <input
              type="number"
              id="defaultSplitRatio"
              name="defaultSplitRatio"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter percentage for seller"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Split Payment Settings
            </button>
          </div>
        </form>

        <h2 className="text-xl font-semibold mb-4">Existing Configurations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white table-auto">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Gateway</th>
                <th className="py-2 px-4 border-b text-left">Key ID</th>
                <th className="py-2 px-4 border-b text-left">Split Enabled</th>
                <th className="py-2 px-4 border-b text-left">Split Ratio</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample Data - Replace with actual data from state/props */}
              <tr className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">Razorpay</td>
                <td className="py-2 px-4 border-b">rzp_test_xxxxxxxxxxxxxx</td>
                <td className="py-2 px-4 border-b">Yes</td>
                <td className="py-2 px-4 border-b">80%</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewayConfig;
