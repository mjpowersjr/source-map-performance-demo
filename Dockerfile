FROM ubuntu

WORKDIR /app
COPY ./configure-image.sh /app/configure-image.sh
RUN ./configure-image.sh
COPY ./ /app
CMD ["node", "/app/lib-tsc/run-tests.js"]