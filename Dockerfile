FROM node:18-slim

# node-pty ബിൽഡ് ചെയ്യാൻ ആവശ്യമായ Build Tools-ഉം apt, git, curl എന്നിവയും ഇൻസ്റ്റാൾ ചെയ്യുന്നു
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    curl \
    git \
    nano \
    wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

# ഇനി npm install ഒരു എററും ഇല്ലാതെ സക്സസ് ആകും
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
