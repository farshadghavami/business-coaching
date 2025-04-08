import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LiveAvatar from '../components/LiveAvatar';

export default function LivestreamPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center mb-8">Live AI Coaching Session</h1>
          <LiveAvatar />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}