killall node
cd /root/live
rm -Rf /root/live/project
git clone https://github.com/acanessa/project.git
node /root/live/project/server.js &
