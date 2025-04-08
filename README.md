# Business Coaching Platform

A professional business coaching platform with AI video coaching and live video sessions.

## Features

- **AI Video Coaching**: Interactive video sessions with an AI coach
- **Live Video Meetings**: Real-time video conferencing for coaching sessions
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: JWT-based authentication
- **Video Streaming**: D-ID API for AI video generation
- **Testing**: Jest and React Testing Library

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/farshadghavami/business-coaching.git
   cd business-coaching
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

4. Update the environment variables in `.env.local` with your actual values.

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is deployed on Vercel. To deploy your own instance:

1. Fork this repository
2. Create a new project on [Vercel](https://vercel.com)
3. Connect your GitHub repository
4. Add the required environment variables
5. Deploy

## License

This project is licensed under the MIT License - see the LICENSE file for details.
