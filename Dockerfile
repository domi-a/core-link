FROM node:alpine
RUN mkdir -p /src/app
WORKDIR /src/app

COPY . /src/app/
RUN npm install

ARG DOCKER_ENV
ENV NODE_ENV=${DOCKER_ENV}
EXPOSE 3000

CMD ["npm","run","stageStart"]