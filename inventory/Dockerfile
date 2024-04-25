FROM --platform=linux/amd64 node:20

ADD common /usr/common/

WORKDIR /usr/app
ADD inventory/src src/
COPY inventory/*.json ./

RUN npm install
RUN npm run build

CMD ["node", "build/index.js"]
