import { Briefcase, Users, Award, Shield } from 'lucide-react';
import { authLabel } from '@/localization/auth';
import { useLang } from '@/hooks/useLang';
import { useNavigate } from 'react-router-dom';
import { homeImage } from '@/config/constant/image';

function Career() {
  const { lang } = useLang();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              `url(${homeImage})`,
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            {authLabel.careerHeroHeading[lang]}
          </h1>
          <p className="text-xl">
            {authLabel.careerHeroSubtitle[lang]}
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {authLabel.careerCultureHeading[lang]}
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            {authLabel.careerCultureText[lang]}
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            {authLabel.careerWhyWorkHeading[lang]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {authLabel.careerValueIntegrityTitle[lang]}
              </h3>
              <p className="text-gray-600">
                {authLabel.careerValueIntegrityText[lang]}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {authLabel.careerTeamworkTitle[lang]}
              </h3>
              <p className="text-gray-600">
                {authLabel.careerTeamworkText[lang]}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <Award className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {authLabel.careerGrowthTitle[lang]}
              </h3>
              <p className="text-gray-600">
                {authLabel.careerGrowthText[lang]}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <Briefcase className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {authLabel.careerOpportunitiesTitle[lang]}
              </h3>
              <p className="text-gray-600">
                {authLabel.careerOpportunitiesText[lang]}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            {authLabel.careerOpenPositionsHeading[lang]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
  {
    title: authLabel.careerJobTitleBecomeGuide[lang],
    location: authLabel.careerJobLocation[lang],
    description: authLabel.careerJobDescBecomeGuide[lang],
    route: "http://localhost:3002/guide-register",
  },
  {
    title: authLabel.careerJobTitleBecomeTravels[lang],
    location: authLabel.careerJobLocation[lang],
    description: authLabel.careerJobDescBecomeTravels[lang],
    route: "http://localhost:3002/travel-register",
  },
].map((job, index) => (
  <div
    key={index}
    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
  >
    <h3 className="text-xl font-bold text-gray-800 mb-2">
      {job.title}
    </h3>
    <p className="text-gray-500 mb-4">{job.location}</p>
    <p className="text-gray-600 mb-6">{job.description}</p>
    <button
      onClick={() => window.location.href =`${job.route}`}
      className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors"
    >
      {authLabel.careerApplyButton[lang]}
    </button>
  </div>
))}

          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {authLabel.careerCTAHeading[lang]}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {authLabel.careerCTAText[lang]}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/apply")}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors"
            >
              {authLabel.careerCTAButtonApply[lang]}
            </button>
            <button
              onClick={() => navigate("/support")}
              className="bg-gray-800 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-900 transition-colors"
            >
              {authLabel.careerCTAButtonContact[lang]}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Career;
