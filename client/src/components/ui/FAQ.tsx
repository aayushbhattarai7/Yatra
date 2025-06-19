import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "What's the best time to trek in Nepal?",
      answer: "The best seasons for trekking in Nepal are pre-monsoon (March to May) and post-monsoon (September to November). October and November offer the clearest skies and most stable weather conditions, perfect for viewing the Himalayas."
    },
    {
      question: "Do I need a visa to visit Nepal?",
      answer: "Yes, most travelers need a visa to enter Nepal. You can obtain a visa on arrival at Tribhuvan International Airport or at land borders. Visa fees vary depending on the length of stay: 15 days ($30), 30 days ($50), or 90 days ($125)."
    },
    {
      question: "What permits do I need for trekking?",
      answer: "For most treks, you'll need a TIMS (Trekkers' Information Management System) card and specific area permits. For example, Everest Base Camp requires a TIMS card and Sagarmatha National Park permit, while Annapurna requires a TIMS card and ACAP permit."
    },
    {
      question: "Is it safe to drink water in Nepal?",
      answer: "It's recommended to avoid tap water in Nepal. Use bottled water or purify water using water purification tablets, UV sterilizers, or filters. Many trekking routes have safe drinking water stations where you can refill bottles."
    },
    {
      question: "What are the must-visit cultural sites in Kathmandu?",
      answer: "Key cultural sites include Pashupatinath Temple (sacred Hindu temple), Boudhanath Stupa (largest Buddhist stupa), Swayambhunath (Monkey Temple), and Kathmandu Durbar Square. These are all UNESCO World Heritage sites."
    },
    {
      question: "How physically fit do I need to be for trekking?",
      answer: "Fitness requirements vary by trek. Popular routes like Everest Base Camp or Annapurna Circuit require good physical fitness and endurance. It's recommended to prepare with cardiovascular training and hiking practice before your trip."
    }
  ];

  return (
    <div className="space-y-4">
      {faqItems.map((item, index) => (
        <div 
          key={index}
          className="border border-sky-100 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="flex justify-between items-center w-full p-4 text-left hover:bg-sky-50 transition-colors duration-200"
          >
            <span className="font-medium text-gray-700">{item.question}</span>
            {openIndex === index ? (
              <ChevronUp className="w-5 h-5 text-travel-accent" />
            ) : (
              <ChevronDown className="w-5 h-5 text-travel-accent" />
            )}
          </button>
          {openIndex === index && (
            <div className="p-4 bg-sky-50/50 border-t border-sky-100">
              <p className="text-gray-600 leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;