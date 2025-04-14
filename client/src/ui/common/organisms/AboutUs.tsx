
import { Users, Map, Shield, Award, Mountain, Compass, Heart } from 'lucide-react';
import { authLabel } from '@/localization/auth';
import { useLang } from '@/hooks/useLang';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ALL_GUIDE_COUNT, GET_ALL_PLACE_COUNT, GET_ALL_TRAVEL_COUNT, GET_ALL_USER_COUNT } from '@/mutation/queries';
import { useEffect } from 'react';

function About() {
    const {lang} = useLang();
    
    const {data:userCount} = useQuery(GET_ALL_USER_COUNT)
    const {data:guideCount} = useQuery(GET_ALL_GUIDE_COUNT)
    const {data:travelCount} = useQuery(GET_ALL_TRAVEL_COUNT)
    const {data:placeCount} = useQuery(GET_ALL_PLACE_COUNT)
    useEffect(()=>{

    },[])
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b)',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            {authLabel.aboutHeroHeading[lang]}
          </h1>
          <p className="text-xl">
            {authLabel.aboutHeroSubtitle[lang]}
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {authLabel.aboutMissionHeading[lang]}
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            {authLabel.aboutMissionText[lang]}
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            {authLabel.aboutWhyChooseHeading[lang]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {authLabel.featureVerifiedGuidesTitle[lang]}
              </h3>
              <p className="text-gray-600">
                {authLabel.featureVerifiedGuidesText[lang]}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <Map className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {authLabel.featureLocalExpertiseTitle[lang]}
              </h3>
              <p className="text-gray-600">
                {authLabel.featureLocalExpertiseText[lang]}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {authLabel.featurePersonalizedServiceTitle[lang]}
              </h3>
              <p className="text-gray-600">
                {authLabel.featurePersonalizedServiceText[lang]}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <Award className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {authLabel.featureQualityAssuredTitle[lang]}
              </h3>
              <p className="text-gray-600">
                {authLabel.featureQualityAssuredText[lang]}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            {authLabel.aboutOurServices[lang]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Mountain className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {authLabel.serviceTrekkingToursTitle[lang]}
              </h3>
              <p className="text-gray-600">
                {authLabel.serviceTrekkingToursText[lang]}
              </p>
            </div>
            <div className="text-center">
              <Compass className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {authLabel.serviceAdventureToursTitle[lang]}
              </h3>
              <p className="text-gray-600">
                {authLabel.serviceAdventureToursText[lang]}
              </p>
            </div>
            <div className="text-center">
              <Heart className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {authLabel.serviceCulturalExperiencesTitle[lang]}
              </h3>
              <p className="text-gray-600">
                {authLabel.serviceCulturalExperiencesText[lang]}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-green-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{guideCount?.getAllGuideCount}+</div>
              <div className="text-lg">
                {authLabel.statVerifiedGuides[lang]}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{userCount?.getAllUserCount}+</div>
              <div className="text-lg">
                {authLabel.statHappyTravelers[lang]}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{placeCount?.getAllPlaceCount}+</div>
              <div className="text-lg">
                {authLabel.statUniqueRoutes[lang]}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{travelCount?.getAllTravelCount}+</div>
              <div className="text-lg">
                {authLabel.verifiedTravels[lang]}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            {authLabel.aboutTestimonialsHeading[lang]}
          </h2>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {authLabel.aboutCTAHeading[lang]}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {authLabel.aboutCTAText[lang]}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={()=> navigate("/guide")} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors">
              {authLabel.aboutCTAButtonBook[lang]}
            </button>
            <button onClick={()=> navigate("/places")}  className="bg-gray-800 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-900 transition-colors">
              {authLabel.aboutCTAButtonExplore[lang]}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
