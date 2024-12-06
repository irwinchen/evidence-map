import React from 'react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';

const SubmitPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Submit Evidence</h1>

      <SignedOut>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700 mb-4">Please sign in to submit evidence to the system.</p>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <form className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the title of your evidence"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Evidence Type
            </label>
            <select
              id="type"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select type</option>
              <option value="research">Research Paper</option>
              <option value="case-study">Case Study</option>
              <option value="data">Data Set</option>
              <option value="report">Report</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your evidence..."
            />
          </div>

          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
              Source / Citation
            </label>
            <input
              type="text"
              id="source"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the source or citation"
            />
          </div>

          <div>
            <label htmlFor="relationships" className="block text-sm font-medium text-gray-700 mb-1">
              System Relationships
            </label>
            <textarea
              id="relationships"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the relationships this evidence demonstrates..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Evidence
            </button>
          </div>
        </form>
      </SignedIn>
    </div>
  );
};

export default SubmitPage;
