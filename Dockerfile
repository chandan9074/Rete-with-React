# Stage 1: Build the React toppan_admin with Vite
FROM node:22 AS build

WORKDIR /auto_x_ui

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

ARG BUILD_ENV

RUN yarn build:${BUILD_ENV}

# Stage 2: Serve the React toppan_admin with serve
FROM node:22 AS serve

WORKDIR /auto_x_ui

RUN yarn global add serve

COPY --from=build /auto_x_ui/dist /auto_x_ui/dist

EXPOSE 8071

CMD ["serve", "-s", "dist", "-l", "8071"]