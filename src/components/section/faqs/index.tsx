import { LandingFaqCollapsibleSection } from "@/components/landing/LandingFaqCollapsible";

// Assuming LandingFaqCollapsibleSection is a component, you need to import it like this

const faqItems = [
  {
    question: "What is an AI song generator?",
    answer:
      "An AI song generator is an artificial intelligence-powered software tool that creates music from text, melodies, or other inputs. These innovative tools allow users to quickly and efficiently generate songs in various styles and genres, revolutionizing the music creation process for both professionals and hobbyists.",
  },
  {
    question: "How does an AI song generator work?",
    answer:
      "AI song generators use machine learning algorithms trained on vast databases of music. They analyze patterns in melody, harmony, rhythm, and structure to create new compositions. Users typically input parameters like genre, mood, or lyrics, and the AI generates a unique piece of music based on these inputs, often in a matter of minutes.",
  },
  {
    question: "What types of music can I create with an AI song generator?",
    answer:
      "AI song generators are incredibly versatile. They can handle a wide range of music types and styles, from classical symphonies to electronic dance tracks, pop songs to jazz improvisations. Many also offer specialized templates for specific genres or purposes, such as creating background music for videos, podcast intros, or even romantic ballads.",
  },
  {
    question: "Do I need musical skills to use an AI song generator?",
    answer:
      "No, you don't need any technical music-making skills to use most AI song generators. These tools are designed to be user-friendly and intuitive, making the song creation process accessible to users of all skill levels. Whether you're a seasoned musician or a complete novice, you can create music with AI assistance.",
  },
  {
    question: "How fast can an AI song generator create a song?",
    answer:
      "The speed of AI song generation can vary depending on the complexity and length of the desired song, as well as the specific AI tool used. However, most AI song generators can produce a complete track in a matter of minutes, significantly reducing the time typically associated with traditional music production.",
  },
  {
    question: "Can I use your AI song generator for commercial purposes??",
    answer:
      "Yes, songs created with our AI song generator can be used for commercial purposes. Whether you're using it for your podcast intro, background music for videos, or creating jingles for advertisements, AI Song Generator is equipped to meet your needs while complying with copyright regulations.",
  },
  {
    question:
      "How does an AI song generator ensure the uniqueness of each song?",
    answer:
      "AI song generators typically use advanced algorithms to create unique compositions based on the specific inputs provided. While they draw from learned patterns, the combination of user inputs and randomization in the AI's decision-making process results in original pieces. However, the level of uniqueness can vary between different AI tools.",
  },
  {
    question: "Are AI song generators free to use?",
    answer:
      "Yes, AI song generators offer free plans that allow users to explore basic features and create a limited number of songs without cost. However, for more advanced features, higher quality outputs, or commercial usage rights, there are usually paid plans available. Pricing structures vary widely between different AI song generation platforms.",
  },
  {
    question: "Do I need musical skills to use AI song generator?",
    answer:
      "No, you don't need any technical music-making skills to use AI song generators. These tools are designed to be user-friendly and intuitive, making the song creation process accessible to users of all skill levels. Whether you're a seasoned musician or a complete novice, you can create music with AI assistance.",
  },
];

export default function FAQS() {
  return (
    <LandingFaqCollapsibleSection
      withBackgroundGlow
      backgroundGlowVariant="primary"
      title="FAQ"
      description="Looking to learn more about our product? Here are some of the most common questions."
      faqItems={faqItems}
    />
  );
}
