FROM node:carbon

RUN chmod 777 -R /etc/passwd
RUN chmod 777 -R /etc/shadow

WORKDIR /app

ADD . .

RUN chmod +x /app/entrypoint.sh
RUN npm install

RUN chmod 777 -R /root

RUN chmod 777 -R /etc/ca-certificates





CMD ["bash", "/app/entrypoint.sh"]

