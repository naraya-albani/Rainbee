# Stage 1: Install dependencies
FROM composer:2 as vendor
WORKDIR /app
COPY database/ database/
COPY composer.json composer.lock ./
RUN composer install --ignore-platform-reqs --no-interaction --no-plugins --no-scripts --prefer-dist

# Stage 2: Setup PHP-FPM with application code
FROM php:8.2-fpm-alpine
WORKDIR /var/www

# Install PHP extensions required by Laravel
RUN docker-php-ext-install pdo pdo_mysql bcmath

# Copy vendor from the first stage
COPY --from=vendor /app/vendor/ /var/www/vendor/

# Copy application code
COPY . /var/www

# Set directory permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Expose port for PHP-FPM
EXPOSE 9000
CMD ["php-fpm"]