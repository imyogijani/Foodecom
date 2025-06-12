import React from "react";

const UserSubscriptions = () => {
  const subscriptions = [
    {
      id: 1,
      name: "Alice Smith",
      email: "alice.smith@example.com",
      plan: "Premium",
      startDate: "2023-01-15",
      endDate: "2024-01-15",
      status: "Active",
    },
    {
      id: 2,
      name: "Bob Johnson",
      email: "bob.j@example.com",
      plan: "Standard",
      startDate: "2023-03-01",
      endDate: "2024-03-01",
      status: "Active",
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie.b@example.com",
      plan: "Basic",
      startDate: "2023-05-20",
      endDate: "2024-05-20",
      status: "Pending",
    },
    {
      id: 4,
      name: "Diana Prince",
      email: "diana.p@example.com",
      plan: "Premium",
      startDate: "2022-11-10",
      endDate: "2023-11-10",
      status: "Expired",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">User Subscriptions</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Subscription Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white table-auto">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Plan</th>
                <th className="py-2 px-4 border-b text-left">Start Date</th>
                <th className="py-2 px-4 border-b text-left">End Date</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{sub.name}</td>
                  <td className="py-2 px-4 border-b">{sub.email}</td>
                  <td className="py-2 px-4 border-b">{sub.plan}</td>
                  <td className="py-2 px-4 border-b">{sub.startDate}</td>
                  <td className="py-2 px-4 border-b">{sub.endDate}</td>
                  <td className="py-2 px-4 border-b">{sub.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserSubscriptions;
