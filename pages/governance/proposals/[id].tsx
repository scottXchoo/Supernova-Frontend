import BackButton from "components/proposal/BackButton";
import Description from "components/proposal/Description";
import Header from "components/proposal/Header";
import Overview from "components/proposal/Overview";
import VotingDetail from "components/proposal/VotingDetail";
import { useRouter } from "next/router";

export default function ProposalDetail() {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <section
      data-section-id="3"
      data-share="custom-215530"
      data-category="features"
      data-component-id="4d2f33a1_03_awz"
      data-custom-component-id="215530"
      className="bg-black relative overflow-hidden bg1 py-4 lg:py-16 md:py-8"
    >
      <img
        className="absolute left-0 bottom-0 lg:h-auto md:h-1/2 h-1/2"
        src="https://static.shuffle.dev/uploads/files/aa/aa3e9a0b09b50e73b38bc67159f4f554912935d1/gradient.png"
        alt=""
        data-config-id="image1"
      />
      <div className="relative container mx-auto px-4">
        <div className="flex items-center justify-center -mx-4 flex-wrap">
          {id && (
            <div className="mx-auto w-full lg:px-0 md:px-8 px-4 max-w-6xl">
              <BackButton />
              <Header id={id} />
              <div className="md:rounded-b-xl rounded-b-lg bg-white md:px-8 px-5 py-5 mx-auto flex flex-wrap w-full lg:py-8 md:py-6">
                <Overview id={id} />
                <VotingDetail id={id} />
                <Description id={id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
