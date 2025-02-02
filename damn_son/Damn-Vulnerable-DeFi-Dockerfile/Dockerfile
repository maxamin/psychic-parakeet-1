FROM node:14.17.1 as build

# Install openssh-server, permit auth login and expose 22
RUN apt-get update && apt-get install -y openssh-server
RUN adduser --home /home/gato --shell /bin/sh gato
RUN echo 'gato:gato123' | chpasswd
RUN echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config
RUN service ssh start

# Clone Damn Vulnerable DeFi and install dependencies
RUN git clone https://github.com/tinchoabbate/damn-vulnerable-defi.git /home/gato/damn-vulnerable-defi
RUN chmod -R ugo+rwx /home/gato/damn-vulnerable-defi
WORKDIR /home/gato/damn-vulnerable-defi
RUN git checkout v2.2.0
RUN npm install

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
