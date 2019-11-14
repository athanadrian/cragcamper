# DevCamper API

Backend API for DevCamper application, which is a bootcamp directory website

# Usage

    -   Rename "config/config.env.env" to "config/config.env" and update the values/settings to your own
    -   Install Dependencies
    -   npm install
    -   Run App

# Run in dev mode

    npm run dev

# Run in prod mode

    npm start
    Database Seeder
    To seed the database with users, bootcamps, courses and reviews with data from the "\_data" folder, run

# Destroy all data

    node seeder -d

# Import all data

    node seeder -i

# HOW TO PROVIDE API-DOCUMENTATION WITH POSTMAN AND DOCGEN

# Through POSTMAN

    -   Right to the collection : Publish Docs
    -   Choose Environment
    -   Choose Page Styling (Color, Fonts,...)
    -   Publish Collection

# Through DOCGEN

# Installation

1. Mac
   brew tap thedevsaddam/cli https://github.com/thedevsaddam/homebrew-cli.git
   brew install docgen

2. update
   brew upgrade docgen

3. Usage
   - view live HTML documentation from postman collection use docgen server -f input-postman-collection.json -p 8000
     This will open the html version of postman collection to the defined port
   - view live Markown documentation from postman collection use docgen server -f input-postman-collection.json -p 8000 -m This will open the markdown version of postman collection to the defined port
   - make HTML documentation use docgen build -i input-postman-collection.json -o ~/Downloads/index.html
   - make Markdown documentation use docgen build -i input-postman-collection.json -o ~/Downloads/index.md -m

# HOW TO SET UP UR PROJECT TO A CLOUD SERVER (Digital Ocean) AND MAKE IT RUN

# Steps to deploy a Node.js app to Digital Ocean using PM2, NGINX as a reverse proxy and an SSL from LetsEncrypt

1. Sign up for Digital Ocean

2. Create a droplet and log in via ssh
   I will be using the root user (root@XXX.XXX.XXX.XXX the IP address of your droplet),
   but would suggest creating a new user

3. Install Node/NPM to the Server

   curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
   sudo apt install nodejs
   node --version

4. Clone your project from Github
   There are a few ways to get your files on to the server, I would suggest using Git

   git clone yourproject.git

5. Install dependencies and test app

   cd yourproject
   npm install
   npm start (or whatever your start command)

   - stop app

   ctrl+C

6. Setup PM2 process manager to keep your app running

   sudo npm i pm2 -g
   pm2 start app (or whatever your file name)

   - Other pm2 commands

     - pm2 show appname
     - pm2 status
     - pm2 restart appname
     - pm2 stop appname or alll
     - pm2 delete 0
     - pm2 delete all
     - pm2 logs (Show log stream)
     - pm2 flush (Clear logs)

   - To make sure app starts when reboot

   pm2 startup ubuntu

   You should now be able to access your app using your IP and port. Now we want to setup a firewall blocking that port and setup NGINX as a reverse proxy so we can access it directly using port 80 (http)

7. Setup ufw firewall

   - sudo ufw enable
   - sudo ufw status
   - sudo ufw allow ssh (Port 22)
   - sudo ufw allow http (Port 80)
   - sudo ufw allow https (Port 443)

8. Install NGINX and configure

   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/default

9. Add the following to the location part of the server block

   server_name yourdomain.com www.yourdomain.com;
   location / {
   proxy_pass http://localhost:5000; #whatever port your app runs on
   proxy_http_version 1.1;
   proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
   proxy_cache_bypass \$http_upgrade;
   }

   - Check NGINX config

     sudo nginx -t

10. Restart NGINX

    sudo service nginx restart

    You should now be able to visit your IP with no port (port 80) and see your app. Now let's add a domain

11. Add domain in Digital Ocean - In Digital Ocean, go to networking and add a domain

12. Add an A record for @ and for www to your droplet

# Register and/or setup domain from registrar

1.  I prefer Namecheap for domains. Please use this affiliate link if you are going to use them
    https://namecheap.pxf.io/c/1299552/386170/5618

2.  Choose "Custom nameservers" and add these 3

    -ns1.digitalocean.com
    -ns2.digitalocean.com
    -ns3.digitalocean.com
    -It may take a bit to propogate

# Add SSL with LetsEncrypt

    sudo add-apt-repository ppa:certbot/certbot
    sudo apt-get update
    sudo apt-get install python-certbot-nginx
    sudo certbot --nginx -d atana.site -d www.atana.site

# Only valid for 90 days, test the renewal process with

    certbot renew --dry-run
