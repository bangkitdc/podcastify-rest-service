FROM node:lts-alpine3.17

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./

# RUN npx prisma generate
CMD [ "npx", "run", "prisma:generate" ]

EXPOSE 4444

CMD [ "npm", "run", "dev" ]