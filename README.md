# Coldplay Ticket Booking

This project replicates the ticket booking process used by BookMyShow for Coldplay tickets, allowing users to enter a queue and select seats in a simulated environment.

## Features

- **Queue Management**: Users can enter a queue and will be dequeued based on their position.
- **Seat Selection**: The first user in the queue is given a limited time to select their seats.
- **Real-time Updates**: Uses WebSockets for real-time queue updates.
- **Redis**: Implements Redis for efficient queue management and fast data retrieval.

## Tech Stack

- **Frontend**: React, Next.js
- **Backend**: Node.js, Express.js
- **Database**: Redis
- **Real-time Communication**: WebSocket

## Getting Started

### Prerequisites

- Node.js
- Redis
- npm (or yarn)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ColdplayTicketBooking.git
   cd ColdplayTicketBooking
