cd /root/live
rm -Rvf /root/live/project
git clone https://github.com/acanessa/project.git
cd project
killall node
nodemon server.js
