import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="font-sans max-w-3xl mx-auto px-6 py-8 bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms of Service</h1>
      <p className="text-lg text-gray-600 mb-4">Welcome to <span className="font-semibold text-gray-800">OpenTag</span>!</p>
      <p className="text-lg text-gray-600 mb-6">
        We value your privacy and are committed to protecting your personal data. Here are our key principles:
      </p>
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-6">
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>We do not sell your data to third parties.</li>
          <li>We do not use tracking cookies.</li>
          <li>Your data is used solely to improve your experience with our service.</li>
          <li>All the data is stored in Firebase, Mumbai region.</li>
        </ul>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">What is not guaranteed</h2>
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-6">
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <span className="font-medium">Uptime:</span> I am a single person and cannot guarantee the project to be snappy all the time.
          </li>
          <li>
            <span className="font-medium">Security:</span> I am not a security expert, but rest assured your data is safe with me.
          </li>
        </ul>
      </div>
      <p className="text-lg text-gray-600 mb-6">
        By using our service, you agree to these terms.
      </p>
      <p className="text-lg text-gray-600 mb-6">
        If you find any issue with copyright, such as the OpenTag logo or any content, please let me know immediately so I can address it.
      </p>
      <p className="text-lg text-gray-600">
        If you have any questions, please contact me at{' '}
        <a
          href="mailto:banerjeesuvan@gmail.com"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          banerjeesuvan@gmail.com
        </a>.
      </p>
    </div>
  );
};

export default TermsOfService;
