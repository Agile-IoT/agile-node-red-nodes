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

CMD node-red