FROM node:22

RUN npm install -g pnpm nodemon ts-node

WORKDIR /server
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
COPY .env .env

ENV PORT=5000
EXPOSE 5000

CMD ["nodemon", "-L", "--watch", "src", "--ext", "ts", "--exec", "ts-node src/server.ts"]
