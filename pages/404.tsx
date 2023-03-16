import Link from "next/link";

export default function Custom404() {
  const comment = "Sorry, we can't find the page...";
  return (
    <section className="h-screen bg-black bg-no-repeat bg-cover bg-[url('https://static.shuffle.dev/uploads/files/57/5730a5ae134971d53040802f2cf0497fbfee5006/sm-bg-comp.jpg')]">
      <div className="flex h-full items-center">
        <div className="container mx-auto px-4">
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2">
            <div className="bg-black bg-opacity-60 rounded-full items-center justify-center mx-auto grid md:h-96 md:w-96 w-72 h-72 relative lg:h-128 lg:w-128">
              <img
                className="mx-auto lg:h-32 md:h-24 h-20 absolute left-1/2 top-1/3 transform -translate-y-1/3 -translate-x-1/2"
                src="https://static.shuffle.dev/uploads/files/57/5730a5ae134971d53040802f2cf0497fbfee5006/404-graphic.png"
                alt=""
              />
              <div className="absolute left-1/2 top-3/4 transform -translate-y-3/4 -translate-x-1/2 w-96 md:-mt-5 -mt-4 lg:-mt-8 grid justify-center">
                <h3 className="text-yellow-500 text-center font-semibold lg:text-4xl md:text-2xl text-xl mb-1">
                  Error
                </h3>
                <p className="text-yellow-500 text-center lg:text-xl md:text-base text-xs lg:mb-6 md:mb-4 mb-3">
                  {comment}
                </p>
                <Link href="/stake">
                  <a className="inline-flex w-auto mx-auto items-center justify-center lg:py-4 lg:px-6 md:py-3 md:px-4 py-2 px-3 md:text-sm text-xs rounded-full transform duration-200 bg-yellow-500 text-black hover:bg-opacity-85">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="md:mr-3 mr-2 md:h-6 h-2"
                      width="16"
                      height="9"
                      viewBox="0 0 16 9"
                      fill="none"
                    >
                      <path
                        d="M12.01 3.16553H0V5.24886H12.01V8.37386L16 4.20719L12.01 0.0405273V3.16553Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <span>Back to home</span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
