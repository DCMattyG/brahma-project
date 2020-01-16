# base image
FROM node:8.10.0

# install chrome for protractor tests
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
# RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
# RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
WORKDIR /brahma/server

# add `/app/node_modules/.bin` to $PATH
# ENV PATH /brahma/node_modules/.bin:$PATH

# install and cache app dependencies
COPY /server/package.json /brahma/server/package.json
COPY /server/package-lock.json /brahma/server/package-lock.json
RUN npm install
# RUN npm install -g @angular/cli@7.3.9

# add app
COPY . /brahma

# start app
CMD npm start

EXPOSE 80
