FROM php:5.6.27-apache

RUN apt-get update && apt-get install -y \
    git \
    libjpeg62-turbo-dev \
    libpng12-dev

RUN docker-php-ext-configure gd --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install -j$(nproc) gd mysql pdo_mysql mysqli

WORKDIR /var/www/html
RUN rm -rf * \
    && git clone https://github.com/RandomStorm/DVWA.git /var/www/html

RUN sed -i "s/127.0.0.1/dvwamysql/g" /var/www/html/config/config.inc.php \
    && chmod a+w /var/www/html/hackable/uploads/ \
    /var/www/html/external/phpids/0.6/lib/IDS/tmp/phpids_log.txt
