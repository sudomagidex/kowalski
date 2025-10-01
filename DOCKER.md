# Docker Guide for Kowalski

## 📦 Docker Setup

### Build Image

```bash
docker build -t kowalski:latest .
```

### Run Container

```bash
docker run -d \
  --name kowalski \
  -p 3000:3000 \
  -v $(pwd)/sessions:/app/sessions \
  -e API_KEY=your-key \
  kowalski:latest
```

## 🐳 Docker Compose

### Start Services

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Configuration

Edit `.env` file or set environment variables in `docker-compose.yml`.

## 📊 Health Check

```bash
curl http://localhost:3000/health
```

## 🔧 Troubleshooting

### Check logs

```bash
docker logs kowalski -f
```

### Enter container

```bash
docker exec -it kowalski sh
```

### Rebuild

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🚀 Production Deployment

### With Docker Compose

```bash
# Use production env
cp .env.production .env

# Start in detached mode
docker-compose up -d

# Monitor
docker-compose logs -f
```

### Best Practices

1. Use multi-stage builds ✅
2. Run as non-root user
3. Use .dockerignore
4. Minimize layers
5. Health checks ✅
6. Volume for sessions ✅

## 📝 Environment Variables

Required in production:

- `API_KEY`: Strong, random key
- `NODE_ENV=production`
- `LOG_LEVEL=info`

## 🔒 Security

- Keep sessions volume secure
- Use secrets management
- Regular image updates
- Scan for vulnerabilities
