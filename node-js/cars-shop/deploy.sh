#!/bin/bash
set -e
set -u

echo -n "Checking everything is committed and pushed..."
if git diff origin/main | grep -q .; then
  tput setaf 1
  echo "looks like something changed"
  tput sgr0
  echo -n "press enter to continue, ctrl+c to abort"
  read
else
  tput setaf 2
  echo "looks ok"
  tput sgr0
fi
#ssh -t ubuntu@api.shopcarx.com 'cd ec2-jamstack-final/jamstack-final-backend && git pull && npx pm2 restart "jamstack-final backend"'
