#!/bin/bash
cd /root/skillgate-agent/xCrab
export NODE_ENV=production
pm2 start npm --name xcrab -- start
pm2 save
