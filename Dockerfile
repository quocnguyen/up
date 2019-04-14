FROM node:lts-alpine

MAINTAINER quocnguyen <quocnguyen@clgt.vn>

WORKDIR /src

# extra tools to build native lib
RUN apk add --no-cache make gcc g++ python curl

# HEALTHCHECK --interval=5s --timeout=3s --retries=3 CMD curl --silent --fail localhost:6969 || exit 1

# install and cache package.json
COPY package.json /src
RUN npm install --production
RUN apk del make gcc g++ python

# Bundle app source
COPY . /src

CMD ["npm","start"]
