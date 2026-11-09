FROM nginx:alpine

RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'busybox crond -b -l 8 -c /etc/crontabs' >> /entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

RUN echo "* * * * * date >> /usr/share/nginx/html/cron.txt" > /etc/crontabs/root

COPY html /usr/share/nginx/html

CMD ["/entrypoint.sh"]
