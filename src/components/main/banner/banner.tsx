import { Canvas } from './canvas';

export const Banner = () => {
  return (
    <div className="pt-14 md:pt-20 md:pb-[clamp(15rem,70vh,25rem)] pb-72 text-center relative overflow-hidden">
      <Canvas />
      <div className="dark:font-medium container font-semibold font-unifont uppercase md:text-6xl text-2xl">
        <p>TECHNOLOGY IS BEST WHEN IT</p>
        <p> BRINGS PEOPLE TOGETHER</p>
      </div>
    </div>
  );
};
