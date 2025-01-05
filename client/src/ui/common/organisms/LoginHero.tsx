interface LoginHeroProps {
  title: string;
  description: string;
  imageUrl: string;
}

const LoginHero = ({ title, description, imageUrl }: LoginHeroProps) => {
  return (
    <div
      className="hidden md:block md:w-[60%] bg-cover bg-center"
      style={{ backgroundImage: `url("${imageUrl}")` }}
    >
      <div className="h-full w-full bg-black bg-opacity-30 flex flex-col justify-center items-center text-white p-12">
        <h2 className="text-5xl font-bold mb-4">{title}</h2>
        <p className="text-xl text-center">{description}</p>
      </div>
    </div>
  );
};

export default LoginHero;
