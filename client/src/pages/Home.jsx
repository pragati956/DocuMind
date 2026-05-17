import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
const Home = () => {
  return (
    <main className="bg-[#050816] text-white overflow-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
};
export default Home;