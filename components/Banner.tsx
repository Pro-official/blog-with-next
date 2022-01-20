const Banner = () => {
  return (
    <div
      style={{ backgroundColor: "#0a2540" }}
      className="flex justify-between items-center mt-2 border-y border-black py-10 lg:py-0"
    >
      <div className="px-10 space-y-5 text-white">
        <h1 className="text-6xl mx-w-xl font-serif">
          <span className="underline underline-offset-4 decoration-cyan-300 decoration-4">
            Medium
          </span>{" "}
          is a place to create, enjoy and share memes.
        </h1>
        <h2>
          It's easy and free to post your meme on any topic and connect with
          millions of viewers.
        </h2>
      </div>
      <img
        className="hidden md:inline-flex h-32 lg:h-full"
        src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
        alt=""
      />
    </div>
  );
};

export default Banner;
