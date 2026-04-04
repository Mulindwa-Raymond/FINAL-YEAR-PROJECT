function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 pb-24">
      <div className="surface-panel p-10 space-y-6">
        <div>
          <p className="tag-chip border-white/20">Reach Out</p>
          <h1 className="text-4xl font-black text-white mt-3">Contact Us</h1>
        </div>
        <p className="text-white/70">
          Share your challenges and our decision intelligence team will co-design the optimal cleaning strategy.
        </p>
        <form className="space-y-6">
          <input className="form-field" type="text" placeholder="Name" />
          <input className="form-field" type="email" placeholder="Email" />
          <textarea className="form-field h-32 resize-none" placeholder="Message" />
          <button type="submit" className="primary-button w-full text-[10px] tracking-[0.3em]">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;