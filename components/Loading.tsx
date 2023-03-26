import { FC } from "react";
import { BarLoader } from "react-spinners";

const Loading: FC = () => {
  return (
    <div className="flex fixed z-50 flex-wrap justify-center items-center w-screen h-screen text-lg text-center bg-pink-200 sm:text-2xl md:text-5xl">
      <div>
        Loading...
        <br />
        <BarLoader color="#ff66ff" loading={true} width="50vw" height="5vw" />
      </div>
    </div>
  );
};

export default Loading;
