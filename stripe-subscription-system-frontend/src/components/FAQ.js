import React, { useState } from 'react';

const faqs = [
  {
    question: 'How can I upgrade my subscription?',
    answer:
      'You can upgrade your subscription anytime from the Dashboard by clicking on the Upgrade button. The changes will take effect immediately.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards, including Visa, Mastercard, American Express.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes, you can cancel anytime from the Billing section. After canceling, you will retain access until the end of your billing cycle.',
  },
  {
    question: 'Will I receive invoices for my payments?',
    answer:
      'Yes, all invoices are available in the Billing History section of your account.',
  },
  {
    question: 'How do I reset my password?',
    answer:
      'Go to the Login page and click "Forgot Password". You will receive a reset link in your email.',
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-600">
        Frequently Asked Questions ❓
      </h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-xl p-4 cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{faq.question}</h2>
              <span className="text-2xl text-blue-500">
                {openIndex === index ? '−' : '+'}
              </span>
            </div>

            {openIndex === index && (
              <p className="mt-3 text-gray-700">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;