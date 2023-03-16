import Overview from "components/assets/Overview/Overview";
import Header from "components/assets/table/Header";
import Table from "components/assets/table/Table";
import OgTag from "components/common/OgTag";

export default function Assets() {
  return (
    <>
      <OgTag title="Assets" description="" />
      <section className="relative lg:pt-24 md:pt-16 pt-10 bg-black overflow-hidden flex flex-col flex-grow">
        <div className="md:flex hidden absolute top-0 right-0 w-full">
          <img
            className="w-full object-cover"
            src="https://static.shuffle.dev/uploads/files/57/5730a5ae134971d53040802f2cf0497fbfee5006/asset-bg.png"
            alt=""
          />
        </div>
        <div className="md:hidden flex absolute top-0 right-0 w-full">
          <img
            className="w-full object-cover"
            src="https://static.shuffle.dev/uploads/files/57/5730a5ae134971d53040802f2cf0497fbfee5006/asset-mobile-bg.jpg"
            alt=""
          />
        </div>
        <Overview />
        <div className="flex flex-wrap relative w-full bg-white lg:py-16 py-4 h-full flex-grow">
          <div className="lg:max-w-6xl container lg:px-24 w-full flex flex-col justify-start items-start md:max-w-3xl max-w-screen-lg mx-auto px-4 md:px-0">
            <Header />
            <Table />
          </div>
        </div>
      </section>
    </>
  );
}
