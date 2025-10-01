import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import GiftList from './components/GiftList';
import RSVPForm from './components/RSVPForm';
import MessageBoard from './components/MessageBoard';
import Footer from './components/Footer';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'rsvp', 'gifts', 'messages'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={handleNavigate} activeSection={activeSection} />

      <main>
        <div id="home">
          <Hero />
        </div>
        <RSVPForm />
        <GiftList />
        <MessageBoard />
      </main>

      <Footer />
    </div>
  );
}

export default App;
