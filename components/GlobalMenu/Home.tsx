import Link from "next/link";

const Home = () => {
  return (
    <div className="lg:flex items-center ">
      <Link
        href={"/stake"}
        className="inline-block text-xl text-white font-medium font-heading"
      >
        <img className="h-7 lg:mt-0 mt-1" src={"/Supernova-logo.png"} alt="" />
      </Link>
    </div>
  );
};

export default Home;
