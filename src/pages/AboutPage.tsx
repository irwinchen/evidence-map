import React from 'react';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">About</h1>
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Systems Thinking</h2>
          <p className="text-gray-700">
            Systems thinking is an approach to understanding how different components interact and
            influence each other within a complex whole. It helps us identify patterns,
            relationships, and feedback loops that shape system behavior.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How the Map is Made</h2>
          <p className="text-gray-700">
            Our evidence map is created through a collaborative process of gathering, analyzing, and
            visualizing relationships between different elements in complex systems. Contributors
            submit evidence that helps establish connections and identify patterns.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Wicked Problem Task Force</h2>
          <p className="text-gray-700">
            The Wicked Problem Task Force is dedicated to addressing complex, interconnected
            challenges that resist simple solutions. We bring together diverse perspectives and
            expertise to better understand and address these systemic issues.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
