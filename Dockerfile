FROM node:20-alpine

WORKDIR /app

# Install postgres client (for pg_isready)
RUN apk add --no-cache postgresql-client

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN npx prisma generate

EXPOSE 5000

CMD ["node", "src/server.js"]