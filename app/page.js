import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
                Transform Your Business With Expert AI Coaching
              </h1>
              <p className="text-xl mb-10">
                Experience personalized business coaching sessions with our advanced AI coaches. Get expert guidance and strategies tailored to your specific business needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/livestream" className="btn-primary text-center">
                  Try Live AI Coach
                </Link>
                <Link href="/meeting" className="btn-secondary text-center">
                  Book Regular Session
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">How Our AI Coaching Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalized Assessment</h3>
                <p className="text-gray-600">Our AI analyzes your business needs and creates a tailored coaching plan for maximum impact.</p>
              </div>
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Interactive Sessions</h3>
                <p className="text-gray-600">Engage in real-time conversations with our AI coach through high-quality video streaming.</p>
              </div>
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Actionable Strategies</h3>
                <p className="text-gray-600">Get concrete action items and strategies to implement immediately in your business.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="card">
                <p className="italic text-gray-600 mb-4">"The AI coaching sessions transformed our marketing strategy. We've seen a 40% increase in engagement and 25% boost in sales."</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-gray-500">CMO, Tech Innovations</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="card">
                <p className="italic text-gray-600 mb-4">"Having access to business expertise 24/7 through the AI coaching platform has been a game-changer for our startup."</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Michael Chen</h4>
                    <p className="text-sm text-gray-500">Founder, GrowFast</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="card">
                <p className="italic text-gray-600 mb-4">"The personalized guidance helped me navigate a complex business pivot with confidence and strategic clarity."</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Jessica Rodriguez</h4>
                    <p className="text-sm text-gray-500">CEO, Retail Solutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call To Action */}
        <section className="py-16 bg-primary-700 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Start your AI coaching journey today and unlock your business's full potential with expert guidance.
            </p>
            <Link href="/livestream" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
              Try Live AI Coach Now
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
