
# Bozor - Production Marketplace Setup

## Prerequisites
- VPS (Ubuntu 22.04+)
- Docker & Docker Compose
- Domain name pointed to VPS IP

## Deployment Steps
1. **Clone Repository**: `git clone <repo_url> && cd bozor`
2. **Configure Environment**: 
   - `cp .env.example .env`
   - Edit `.env` with your production secrets and `API_KEY`.
3. **One-Command Deploy**:
   ```bash
   docker-compose up -d --build
   ```
4. **SSL Setup**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d bozor.uz -d www.bozor.uz
   ```

## Architecture
- **Frontend**: Next.js (React 19) + Tailwind CSS.
- **Backend**: NestJS (Node.js) + PostgreSQL.
- **Caching**: Redis for session and product metadata.
- **AI**: Gemini 2.5/3 for search grounding and recommendations.

## API Documentation
Access Swagger docs at `https://api.bozor.uz/docs`
