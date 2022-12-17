FROM node:14.9
 
WORKDIR /app
 
COPY package*.json ./
 
RUN npm install
 
COPY . .
 
EXPOSE 3000
 
ENV CHOKIDAR_USEPOLLING=true

CMD npm start --host 0.0.0.0 --port 3000 --disableHostCheck true