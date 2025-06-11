FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# COPY --from=deps /app/public ./public
COPY --from=deps /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

CMD ["yarn", "start"]


# # Stage 1: Build dependencies
# FROM node:18-alpine AS deps
# WORKDIR /app

# # Menyalin file package.json dan yarn.lock untuk instalasi dependensi
# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile

# # Menyalin seluruh project
# COPY . .

# # Build aplikasi
# RUN yarn build

# # Stage 2: Runner untuk menjalankan aplikasi di environment production
# FROM node:18-alpine AS runner
# WORKDIR /app

# # Mengatur variabel lingkungan untuk produksi
# ENV NODE_ENV=production

# # Mengambil DSN dari variabel lingkungan
# ENV SENTRY_DSN=${SENTRY_DSN}

# # Menyalin hasil build dari stage sebelumnya
# COPY --from=deps /app/.next ./.next
# COPY --from=deps /app/node_modules ./node_modules
# COPY --from=deps /app/package.json ./package.json

# # Menjalankan aplikasi
# CMD ["yarn", "start"]
