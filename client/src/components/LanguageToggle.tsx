import { useLang } from "@/hooks/useLang";
import { LanguageEnum } from "@/types/global.types";

const LanguageToggle = () => {
  const { lang, setLang } = useLang();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(event.target.value as LanguageEnum);
  };

  return (
    <div className="border-2 border-gray-400 rounded-full px-1 py-0.5 w-fit inline-flex">
      <select
        value={lang}
        onChange={handleChange}
        className="bg-transparent outline-none cursor-pointer text-sm"
      >
        <option value={LanguageEnum.en}>English</option>
        <option value={LanguageEnum.ne}>नेपाली</option>
      </select>
    </div>
  );
};

export default LanguageToggle;
