import { useState } from "react";
import Button from "./Button";

const ContactForm = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "YOUR_ACCESS_KEY_HERE");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    }).then((res) => res.json());

    if (res.success) {
      console.log("Success", res);
    }
  };

  return (
    <form className="flex w-full flex-col gap-4">
      <div>
        <label htmlFor="name" className="mb-1 block">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="John Doe"
          className="w-full rounded-md border border-gray-800 bg-black p-2 text-white placeholder-gray-600 focus:ring focus:ring-purple-700 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block">
          E-mail
        </label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="JohnDoe@mail.com"
          className="w-full rounded-md border border-gray-800 bg-black p-2 text-white placeholder-gray-600 focus:ring focus:ring-purple-700 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="subject" className="mb-1 block">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          placeholder="Support"
          className="w-full rounded-md border border-gray-800 bg-black p-2 text-white placeholder-gray-600 focus:ring focus:ring-purple-700 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block">
          Message
        </label>
        <textarea
          type="text"
          id="message"
          name="message"
          rows={3}
          placeholder="Hi, I am reaching out today because..."
          className="w-full rounded-md border border-gray-800 bg-black p-2 text-white placeholder-gray-600 focus:ring focus:ring-purple-700 focus:outline-none"
        />
      </div>
      <Button text="Send Message" size="sm" />
    </form>
  );
};
export default ContactForm;
