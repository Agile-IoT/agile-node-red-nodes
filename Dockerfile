#FROM resin/amd64-debian:jessie
FROM resin/rpi-raspbian:jessie

#RUN apt-get clean && apt-get update && apt-get install -y \
#  npm \
#  nodejs-legacy  \
#  build-essential

# node-red
# RUN sudo npm install -g --unsafe-perm node-red

RUN apt-get clean && apt-get update && apt-get install -y \
  nodered

RUN apt-get clean && apt-get update && apt-get install -y \
  npm 

EXPOSE 1880

COPY . /root/agile-node-red-node

RUN cd /root && mkdir -p .node-red && cd .node-red && npm install /root/agile-node-red-node

RUN apt-get clean && apt-get update && apt-get install -y \
  curl 

# install npm Q
RUN sudo npm install -g q

RUN cd /root && cd .node-red && npm install node-red-dashboard

RUN apt-get clean && apt-get update && apt-get install -y \
  build-essential

#upgrade npm to the newest version, otherwise we get build errors in node-red-contrib-graphs
RUN npm -g install npm

RUN cd /root && cd .node-red && npm install node-red-contrib-graphs

CMD node-red