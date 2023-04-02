import { FC } from "react";
import { BarLoader } from "react-spinners";

const Loading: FC = () => {
  return (
    <div className="flex fixed z-50 flex-wrap justify-center items-center w-screen h-screen text-lg text-center bg-rose-600 sm:text-2xl md:text-5xl">
      <div>
        Loading...
        <BarLoader
          color="#fcafa5"
          loading={true}
          width="50vw"
          height="25px"
          className="top-4"
        />
      </div>
    </div>
  );
};

export default Loading;
