import React from 'react';

const ContributorsPage = () => {
  // Placeholder data - this would eventually come from your backend
  const contributors = [
    {
      id: 1,
      name: 'Dr. Jane Smith',
      role: 'Systems Researcher',
      contributions: 15,
      joinedDate: '2024-01',
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      role: 'Environmental Scientist',
      contributions: 23,
      joinedDate: '2023-12',
    },
    {
      id: 3,
      name: 'Dr. Sarah Johnson',
      role: 'Policy Analyst',
      contributions: 8,
      joinedDate: '2024-02',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Contributors</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-4 bg-gray-50 p-4 font-semibold">
          <div>Name</div>
          <div>Role</div>
          <div>Contributions</div>
          <div>Joined</div>
        </div>
        <div className="divide-y divide-gray-200">
          {contributors.map((contributor) => (
            <div key={contributor.id} className="grid grid-cols-4 p-4">
              <div className="font-medium">{contributor.name}</div>
              <div className="text-gray-600">{contributor.role}</div>
              <div>{contributor.contributions}</div>
              <div className="text-gray-600">{contributor.joinedDate}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContributorsPage;
