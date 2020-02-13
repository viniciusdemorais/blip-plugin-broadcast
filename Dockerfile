FROM node:10-alpine as buildContainer

COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build:prod

FROM nginx:alpine
COPY --from=buildContainer /app/dist /app
COPY --from=buildContainer /app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80