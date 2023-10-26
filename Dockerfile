FROM node:19.9.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

# RUN npx prisma generate
RUN npx prisma generate

# Start application
CMD [ "npm", "run", "dev" ]

EXPOSE 4444