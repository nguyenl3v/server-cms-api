FROM node:10

WORKDIR /var/www/api

COPY . .

RUN npm install

EXPOSE 4000
ENTRYPOINT ["npm", "start"]