import React from 'react';
import Link from 'next/link';
import { Shield, Database, Info, AlertTriangle, Heart, Mail } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="font-sans max-w-4xl mx-auto px-6 py-12 bg-white dark:bg-black">
      <h1 className="text-4xl font-bold text-stone-800 dark:text-stone-100 mb-8">Terms of Service</h1>
      
      <div className="mb-10">
        <p className="text-lg text-stone-600 dark:text-stone-300 mb-4">Welcome to <span className="font-semibold text-stone-800 dark:text-stone-100">OpenTag</span>!</p>
        <p className="text-lg text-stone-600 dark:text-stone-300 mb-6">
          Last updated: April 24, 2025
        </p>
        <p className="text-md text-stone-600 dark:text-stone-300 mb-6">
          These Terms of Service govern your access to and use of OpenTag's services. By using our service, you agree to be bound by these terms.
        </p>
      </div>

      {/* Privacy Section */}
      <section className="mb-10">
        <div className="flex items-center mb-4">
          <Shield className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-100">Privacy & Data Protection</h2>
        </div>
        <div className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-6 mb-6">
          <p className="mb-4 text-stone-600 dark:text-stone-300">
            We value your privacy and are committed to protecting your personal data. Here are our key principles:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-stone-700 dark:text-stone-300">
            <li>
              <strong>No Data Selling:</strong> We do not sell your data to third parties under any circumstances.
            </li>
            <li>
              <strong>No Tracking:</strong> We do not use tracking cookies or any invasive tracking technologies.
            </li>
            <li>
              <strong>Purpose-Limited Use:</strong> Your data is used solely to improve your experience with our service and to provide the functionality you expect.
            </li>
            <li>
              <strong>Data Storage:</strong> All data is stored in Firebase, Mumbai region, with appropriate security measures in place.
            </li>
            <li>
              <strong>Data Minimization:</strong> We only collect information that is necessary to provide our services.
            </li>
            <li>
              <strong>Medical Data:</strong> Your medical information is stored securely and is accessible only through your authorized tag or account.
            </li>
          </ul>
        </div>

        <div className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-6">
          <h3 className="text-xl font-medium text-stone-800 dark:text-stone-100 mb-4">Your Data Rights</h3>
          <p className="mb-4 text-stone-600 dark:text-stone-300">
            You have several rights regarding your personal data:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-stone-700 dark:text-stone-300">
            <li>
              <strong>Access:</strong> You can access your personal data at any time through your account.
            </li>
            <li>
              <strong>Correction:</strong> You can update and correct your information as needed.
            </li>
            <li>
              <strong>Deletion:</strong> You can request complete deletion of your account and associated data.
            </li>
            <li>
              <strong>Portability:</strong> You can download your data in common formats for your personal use.
            </li>
          </ul>
        </div>
      </section>

      {/* Service Information */}
      <section className="mb-10">
        <div className="flex items-center mb-4">
          <Info className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-100">Service Information</h2>
        </div>
        
        <div className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-medium text-stone-800 dark:text-stone-100 mb-4">Available Services</h3>
          <p className="mb-4 text-stone-600 dark:text-stone-300">
            OpenTag provides two primary types of medical identification tags:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-stone-700 dark:text-stone-300">
            <li>
              <strong>Online Tag:</strong> The information is stored in our secure cloud database. This allows for unlimited storage, frequent updates, and is ideal for users with chronic conditions or complex medical histories.
            </li>
            <li>
              <strong>Serverless Tag:</strong> The information is stored directly in the QR code, but has limited storage capacity and is suitable for basic medical information.
            </li>
          </ul>
        </div>

        <div className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-6">
          <h3 className="text-xl font-medium text-stone-800 dark:text-stone-100 mb-4">What is not guaranteed</h3>
          <ul className="list-disc pl-6 space-y-3 text-stone-700 dark:text-stone-300">
            <li>
              <span className="font-medium">Uptime:</span> OpenTag is maintained by a small team, and we cannot guarantee 100% uptime or service availability at all times. We strive for the best service quality but may occasionally experience downtime for maintenance or due to technical issues.
            </li>
            <li>
              <span className="font-medium">Medical Emergencies:</span> OpenTag is not a substitute for professional medical care. In emergencies, please contact emergency services immediately.
            </li>
            <li>
              <span className="font-medium">Data Accuracy:</span> The accuracy of medical information displayed depends on what you provide. We cannot verify the accuracy of user-provided medical information.
            </li>
          </ul>
        </div>
      </section>

      {/* User Responsibilities */}
      <section className="mb-10">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 mr-2 text-amber-600 dark:text-amber-400" />
          <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-100">User Responsibilities</h2>
        </div>
        
        <div className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-6">
          <p className="mb-4 text-stone-600 dark:text-stone-300">
            As a user of OpenTag, you are responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-stone-700 dark:text-stone-300">
            <li>Providing accurate and up-to-date medical information</li>
            <li>Keeping your account credentials secure</li>
            <li>Using the service in accordance with applicable laws</li>
            <li>Not using OpenTag for any unlawful purposes</li>
            <li>Regularly reviewing and updating your medical information</li>
          </ul>
        </div>
      </section>

      {/* Copyright and Intellectual Property */}
      <section className="mb-10">
        <div className="flex items-center mb-4">
          <Database className="h-6 w-6 mr-2 text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-100">Copyright and Intellectual Property</h2>
        </div>
        
        <div className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-6">
          <p className="mb-4 text-stone-600 dark:text-stone-300">
        OpenTag is a small personal project. I do not claim copyright ownership over the name "OpenTag" or any associated logos.
          </p>
          <p className="mb-4 text-stone-600 dark:text-stone-300">
        The code for this project is open source and available under the MIT License. You are free to use, modify, and distribute it.
          </p>
          <p className="text-stone-600 dark:text-stone-300">
        If you believe this project infringes on your intellectual property rights, please contact me at the email address listed below, and I will promptly address your concerns.
          </p>
        </div>
      </section>

      {/* Changes to Terms */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-100 mb-4">Changes to These Terms</h2>
        <div className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-6">
          <p className="text-stone-600 dark:text-stone-300">
            We may update our Terms of Service from time to time. We will notify you of any changes by posting the new Terms on this page and updating the "Last updated" date. You are advised to review these Terms periodically for any changes.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="mb-10">
        <div className="flex items-center mb-4">
          <Mail className="h-6 w-6 mr-2 text-green-600 dark:text-green-400" />
          <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-100">Contact Us</h2>
        </div>
        
        <div className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-6">
          <p className="text-stone-600 dark:text-stone-300 mb-4">
            If you have any questions or concerns about these Terms of Service, please contact us at:
          </p>
          <a
            href="mailto:banerjeesuvan@gmail.com"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-600 underline flex items-center"
          >
            <Mail className="h-4 w-4 mr-2" />
            banerjeesuvan@gmail.com
          </a>
        </div>
      </section>

      <div className="text-center mt-12 pt-6">
        <div className="flex justify-center items-center mt-4">
          <Heart className="h-4 w-4 text-red-500 mr-2" />
          <span className="text-sm text-stone-500 dark:text-stone-400">
            Thank you for using OpenTag to manage your medical information
          </span>
        </div>
        <div className="mt-4">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
