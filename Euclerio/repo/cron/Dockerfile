FROM alpine:latest

RUN echo "* * * * * date >> /var/log/cron-task.log" > /etc/crontabs/root

CMD ["busybox", "crond", "-f", "-l", "8", "-c", "/etc/crontabs"]
