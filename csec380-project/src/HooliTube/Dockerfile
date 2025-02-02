FROM php:7.2-apache

COPY webserver/ /var/www/html
COPY php.ini /usr/local/etc/php/conf.d

RUN chown nobody /var/www/html/videos/
RUN chmod -R 777 /var/www/html/videos/

RUN docker-php-ext-install mysqli