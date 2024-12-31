import backgroundImage from "../../../assets/Rectangle 4.png";
interface LoginHeroProps {
  title: string;
  description: string;
}

const LoginHero = ({ title, description }: LoginHeroProps) => {
  return (
    <div
      className=" hidden md:block md:w-[60%] bg-cover bg-center h-screen"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="h-full w-[70rem] flex flex-col bg-black opacity-30 justify-start items-center text-white p-12">
        <h2 className="text-5xl font-bold mb-4 font-poppins">{title}</h2>
        <p className="text-xl text-center font-poppins">{description}</p>
      </div>
    </div>
  );
};

export default LoginHero;
