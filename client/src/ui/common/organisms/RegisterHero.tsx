import { useState, useEffect } from "react";
import backgroundImage1 from "../../../assets/pexels-andreimike-1271619.jpg";
import backgroundImage2 from "../../../assets/pexels-creative-vix-9754.jpg";
import backgroundImage3 from "../../../assets/pexels-hikaique-775201.jpg";

interface LoginHeroProps {
  title: string;
  description: string;
}

const RegisterHero = ({ title, description }: LoginHeroProps) => {
  const images = [backgroundImage1, backgroundImage2, backgroundImage3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentImageIndex(nextImageIndex);
        setNextImageIndex((nextIndex) => (nextIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 1000); 
    }, 10000);

    return () => clearInterval(interval);
  }, [nextImageIndex, images.length]);

  return (
    <div className="relative hidden md:block md:w-[60%] h-screen overflow-hidden">
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
        style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
      ></div>

      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
          isTransitioning ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: `url(${images[nextImageIndex]})` }}
      ></div>

      <div className="absolute inset-0 flex flex-col justify-start items-center text-white p-12 z-10">
        <h2 className="text-5xl font-bold mb-4 font-poppins">{title}</h2>
        <p className="text-xl text-center font-poppins">{description}</p>
      </div>
    </div>
  );
};

export default RegisterHero;
