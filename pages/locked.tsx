export default function CustomLocked() {
  return (
    <>
      <section className="h-screen bg-black bg-no-repeat bg-cover bg-[url('https://static.shuffle.dev/uploads/files/57/5730a5ae134971d53040802f2cf0497fbfee5006/sm-bg-comp.jpg')]">
        <div className="flex h-full items-center">
          <div className="container mx-auto px-4">
            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2">
              <div className="bg-black bg-opacity-60 rounded-full items-center justify-center mx-auto grid md:h-96 md:w-96 w-72 h-72 relative lg:h-128 lg:w-128">
                <img
                  className="mx-auto lg:h-32 md:h-24 h-20 absolute left-1/2 top-1/3 transform -translate-y-1/3 -translate-x-1/2"
                  src="https://static.shuffle.dev/uploads/files/57/5730a5ae134971d53040802f2cf0497fbfee5006/region-error.png"
                  alt=""
                />
                <div className="absolute left-1/2 top-3/4 transform -translate-y-3/4 -translate-x-1/2 w-96 md:-mt-3 -mt-2 lg:-mt-4 grid justify-center">
                  <h3 className="text-yellow-500 text-center font-semibold lg:text-4xl md:text-2xl text-xl mb-1">
                    Sorry,
                  </h3>
                  <p className="text-yellow-500 text-center lg:text-xl md:text-base text-xs lg:mb-6 md:mb-4 mb-3 leading-tight md:leading-tight">
                    the service is not currently available in your country or
                    region
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
