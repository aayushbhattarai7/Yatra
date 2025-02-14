import { useState, useEffect } from "react";
import backgroundImage1 from "../../../assets/pexels-andreimike-1271619.jpg";
import backgroundImage2 from "../../../assets/pexels-creative-vix-9754.jpg";
import backgroundImage3 from "../../../assets/pexels-hikaique-775201.jpg";

interface LoginHeroProps {
  title: string;
  description: string;
}

const LoginHero = ({ title, description }: LoginHeroProps) => {
  const images = [backgroundImage1, backgroundImage2, backgroundImage3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div
      className="hidden md:block md:w-[100%] bg-cover bg-center h-screen"
      style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
    >
      <div className="h-full w-[70rem] flex flex-col justify-start items-center text-white p-12">
        <h2 className="text-5xl font-bold mb-4 font-poppins">{title}</h2>
        <p className="text-xl text-center font-poppins">{description}</p>
      </div>
    </div>
  );
};

export default LoginHero;
