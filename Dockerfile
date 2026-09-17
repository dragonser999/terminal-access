# Ubuntu base ലെയറിലുള്ള Node.js ഇമേജ് ഉപയോഗിക്കുന്നു (apt ലഭിക്കാൻ)
FROM node:18-slim

# basic ആവശ്യത്തിനുള്ള പാക്കേജ് മാനേജർ അപ്‌ഡേറ്റുകൾ
RUN apt-get update && apt-get install -y \
    curl \
    git \
    nano \
    wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
