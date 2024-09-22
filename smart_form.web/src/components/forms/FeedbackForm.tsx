"use client"

import { FormEvent, useState } from 'react';

type ErrorFields = 'fullname' | 'email' | 'subject' | 'message';

const FeedbackForm = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [extendedSubject, setExtendedSubject] = useState(''); // in the case subject is other
  const [message, setMessage] = useState('');

  //   Form validation state
  const [, setErrors] = useState({});

  //   Setting button text on form submission
  const [, setButtonText] = useState('Send');

  // Setting success or failure messages states
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [, setShowFailureMessage] = useState(false);

  // Validation check method
  const handleValidation = () => {
    const tempErrors: Record<ErrorFields, boolean> = {
      fullname: false,
      email: false,
      subject: false,
      message: false,
    };

    let isValid = true;

    if (fullname.length <= 0) {
      tempErrors.fullname = true;
      isValid = false;
    }
    if (email.length <= 0) {
      tempErrors.email = true;
      isValid = false;
    }
    if (subject.length <= 0) {
      tempErrors.subject = true;
      isValid = false;
    }
    if (subject === 'Other' && extendedSubject.length <= 0) {
      tempErrors.subject = true;
      isValid = false;
    }
    if (message.length <= 0) {
      tempErrors.message = true;
      isValid = false;
    }

    setErrors({ ...tempErrors });
    return isValid;
  };

  //   Handling form submit

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const isValidForm = handleValidation();

    if (isValidForm) {
      setButtonText('Sending');
      const res = await fetch('/api/sendgrid', {
        body: JSON.stringify({
          email,
          fullname,
          subject: subject === 'Other' ? extendedSubject : subject,
          message,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      const { error } = await res.json();
      if (error) {
        setShowSuccessMessage(false);
        setShowFailureMessage(true);
        setButtonText('Send');
        return;
      }
      setShowSuccessMessage(true);
      setShowFailureMessage(false);
      setButtonText('Send');
    }
  };

  return (
    <div className="rounded-lg shadow-xl flex flex-col px-0.5 py-0.5 md:px-1 md:py-1 my-8 md:my-0 bg-[#1a1a1a]">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg shadow-xl flex flex-col px-8 py-8 border-green-400 border"
      >
        <h1 className="text-xl lg:text-3xl text-white">
          Send a message
        </h1>

        <label
          htmlFor="fullname"
          className="text-white mt-8 text-xl"
        >
          Name
        </label>
        <input
          type="text"
          value={fullname}
          onChange={(e) => {
            setFullname(e.target.value);
          }}
          name="fullname"
          className="bg-transparent border-b py-2 focus:outline-none  text-white"
        />

        <label htmlFor="email" className="text-white mt-8 text-xl">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className="bg-transparent border-b py-2 focus:outline-none text-white"
        />

        <label htmlFor="subject" className="text-white mt-8 mb-4 text-xl">
          Subject
        </label>
        <div className="relative w-full lg:max-w-sm">
          <select
            onChange={(e) => setSubject(e.target.value)}
            className="w-full py-2 pl-4 text-white bg-[#202020] border rounded-md shadow-sm outline-none appearance-none"
          >
            <option>Feedback</option>
            <option>Idea</option>
            <option>Bug report</option>
            <option>Other</option>
          </select>
        </div>
        {subject === 'Other' ? (
          <input
            type="text"
            name="subject"
            value={extendedSubject}
            onChange={(e) => {
              setExtendedSubject(e.target.value);
            }}
            className="bg-transparent border-b mt-4 py-2 focus:outline-none text-white"
          />
        ) : null}

        <label htmlFor="message" className="text-white mt-8 text-xl">
          Message
        </label>
        <textarea
          name="message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          className="bg-transparent border-b py-2 focus:outline-none text-white"
        ></textarea>

        <div className="flex flex-row items-center justify-start">
          <button
            type="submit"
            className="btn px-10 mt-8 py-2 bg-[#202020] text-white rounded-md text-lg flex flex-row items-center border border-blue-400 hover:text-green-400"
          >
            Submit
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="ml-2"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.00967 5.12761H11.0097C12.1142 5.12761 13.468 5.89682 14.0335 6.8457L16.5089 11H21.0097C21.562 11 22.0097 11.4477 22.0097 12C22.0097 12.5523 21.562 13 21.0097 13H16.4138L13.9383 17.1543C13.3729 18.1032 12.0191 18.8724 10.9145 18.8724H8.91454L12.4138 13H5.42485L3.99036 15.4529H1.99036L4.00967 12L4.00967 11.967L2.00967 8.54712H4.00967L5.44417 11H12.5089L9.00967 5.12761Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <div className="pt-4 text-white">
          <p>{showSuccessMessage && 'Your message is send successfully!'}</p>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
