FROM node:22

RUN npm install -g pnpm

WORKDIR /server

COPY package.json ./

RUN pnpm install

COPY . .

COPY .env .env

ENV PORT=3000

EXPOSE 3000

CMD ["pnpm", "start:dev"]