import Button from "./Button";

const ContactForm = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "60307e8d-0a4e-43c8-97b7-1656e44cb795");

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
    <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="mb-1 block">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="John Doe"
          required
          className="w-full rounded-md border border-gray-800 bg-black p-2 text-white placeholder-gray-600 focus:outline-none focus:ring focus:ring-purple-700"
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
          required
          className="w-full rounded-md border border-gray-800 bg-black p-2 text-white placeholder-gray-600 focus:outline-none focus:ring focus:ring-purple-700"
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
          required
          className="w-full rounded-md border border-gray-800 bg-black p-2 text-white placeholder-gray-600 focus:outline-none focus:ring focus:ring-purple-700"
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
          required
          rows={3}
          placeholder="Hi, I am reaching out today because..."
          className="w-full rounded-md border border-gray-800 bg-black p-2 text-white placeholder-gray-600 focus:outline-none focus:ring focus:ring-purple-700"
        />
      </div>
      <button
        type="submit"
        className="px-4.5 font-base cursor-pointer rounded-xl border border-purple-400 bg-gradient-to-b from-[#551dd9] to-[#7d58cd] py-2.5 text-sm transition duration-700 hover:border-purple-300 hover:from-[#6322f9] hover:to-[#9b6dfd] hover:text-gray-200"
      >
        Send Message
      </button>
    </form>
  );
};
export default ContactForm;
